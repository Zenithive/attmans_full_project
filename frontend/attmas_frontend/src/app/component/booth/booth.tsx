import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useAppSelector } from "@/app/reducers/hooks.redux";
import { UserSchema, selectUserSession } from "@/app/reducers/userReducer";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, FieldArray, Form } from "formik";
import * as Yup from "yup";
import ProductTableForBooth, { ProductForBooth } from "../ProductTableForBooth";
import axios from "axios";
import { APIS } from "@/app/constants/api.constant";
import AddIcon from "@mui/icons-material/Add";

interface BoothDetailsModalProps {
  open: boolean;
  onClose: () => void;
  createBooth: (boothData: any) => Promise<void>;
  exhibitionId: string | null;
}

const BoothDetailsModal: React.FC<BoothDetailsModalProps> = ({
  open,
  onClose,
  createBooth,
  exhibitionId,
}) => {
  const userDetails: UserSchema = useAppSelector(selectUserSession);
  const [productDetails, setProductDetails] = useState<ProductForBooth[]>([]);
  const [existingProducts, setExistingProducts] = useState<ProductForBooth[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${APIS.PRODUCTNAME}?username=${userDetails.username}`
        );
        console.log("response of Products ", response.data);
        setProductDetails(response.data || []);
        setExistingProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    if (open && userDetails._id) {
      fetchProductDetails();
    }
  }, [userDetails._id, open]);

  const initialValues = {
    title: "",
    description: "",
    videoUrl: "",
    products: [
      {
        productName: "",
        productDescription: "",
        productType: "",
        productPrice: "",
        currency: "INR",
        videourlForproduct: "",
      },
    ] as unknown as ProductForBooth[],
    userId: userDetails._id,
    username: userDetails.username,
    exhibitionId: exhibitionId || "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    videoUrl: Yup.string().url("Invalid URL").required("Video URL is required"),
    products: Yup.array().of(
      Yup.object().shape({
        productDescription: Yup.string().required(
          "Product description is required"
        ),
        productType: Yup.string().required("Product type is required"),
        productPrice: Yup.number()
          .required("Product price is required")
          .min(0, "Price cannot be negative"),
        currency: Yup.string().required("Currency is required"),
        videourlForproduct: Yup.string()
          .url("Invalid URL")
          .required("Video URL is required"),
      })
    ),
  });

  // const handleSubmit = async (
  //   values: typeof initialValues,
  //   { resetForm }: any
  // ) => {
  //   console.log("Submitting form with values:", values);
  //   try {
  //     await createBooth(values);
  //     console.log("Booth created successfully");
  
  //     // New post request with only userId, username, and products
  //     await axios.post(`${APIS.ADDBOTHPRODUCTTOWORKEXPRINCE}`, {
  //       userId: values.userId,
  //       username: values.username,
  //       products: values.products,
  //     }, {
  //       params: { username: values.username }
  //     });
  //     console.log("Product added to WorkExperience");
  
  //     resetForm();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error creating booth:", error);
  //   }
  // };


  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    try {
      await createBooth(values);

      // Identify new products
      const newProducts = values.products.filter(
        (product) =>
          !existingProducts.some(
            (existingProduct) =>
              existingProduct.productName === product.productName &&
              existingProduct.productDescription === product.productDescription &&
              existingProduct.productType === product.productType &&
              existingProduct.productPrice === product.productPrice &&
              existingProduct.currency === product.currency &&
              existingProduct.videourlForproduct === product.videourlForproduct
          )
      );

      if (newProducts.length > 0) {
        // Send only new products in the API request
        await axios.post(
          `${APIS.FORMTOPRODUCT}`,
          {
            userId: values.userId,
            username: values.username,
            products: newProducts,
          },
          {
            params: { username: values.username },
          }
        );
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating booth:", error);
    }
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          bgcolor: "white",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
          maxHeight: "90vh",
          borderRadius: "20px",
          "@media (max-width: 767px)": {
            width: "78%",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2">
          Booth Details
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <TextField
                fullWidth
                label="Title"
                name="title"
                color="secondary"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                color="secondary"
                multiline
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
              />
              <TextField
                fullWidth
                label="Video URL"
                name="videoUrl"
                color="secondary"
                value={values.videoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={Boolean(touched.videoUrl && errors.videoUrl)}
                helperText={touched.videoUrl && errors.videoUrl}
              />
              <FieldArray
                name="products"
                render={(arrayHelpers) => (
                  <div>
                    <ProductTableForBooth
                      products={values.products}
                      productDetails={productDetails}
                      onRemove={(index) => arrayHelpers.remove(index)}
                      onChange={(index, updatedProduct) =>
                        setFieldValue(`products[${index}]`, updatedProduct)
                      }
                    />

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        arrayHelpers.push({
                          productName: "",
                          productDescription: "",
                          productType: "",
                          productPrice: "",
                          currency: "INR",
                          videourlForproduct: "",
                        })
                      }
                      startIcon={<AddIcon />} // Adding the AddIcon here
                      sx={{ mt: 2 }}
                    >
                      Add Product
                    </Button>
                  </div>
                )}
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default BoothDetailsModal;
