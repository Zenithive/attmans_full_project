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
import { APIS } from "@/app/constants/api.constant";
import LatestProductTableForBooth from "./LatestProductTableForBooth";
import axiosInstance from "@/app/services/axios.service";
import { Product } from "../ProductTable";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${APIS.PRODUCTNAME}?username=${userDetails.username}`
        );
        setProducts(response.data || []);
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
    products: [] as Product[], // Updated type
    userId: userDetails._id,
    username: userDetails.username,
    exhibitionId: exhibitionId || "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    videoUrl: Yup.string().url("Invalid URL").required("Video URL is required"),
  });

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    console.log("Submitting form with values:", values); // Debugging statement

    try {
      const payload = { ...values, products: values.products }; // Send full product details
      await createBooth(payload);
      console.log("Booth created successfully");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating booth:", error); // To capture and log errors
    }
  };

  const handleProductSelect = (product: Product, setFieldValue: Function) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some(p => p._id === product._id);
      const updatedSelection = isSelected
        ? prevSelected.filter(p => p._id !== product._id)
        : [...prevSelected, product];

      setFieldValue("products", updatedSelection);
      return updatedSelection;
    });
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
          }) => {
            console.log("Form Errors:", errors); // Debugging form errors
            console.log("Form Values:", values); // Debugging current form values

            return (
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
                  render={() => (
                    <div>
                      <LatestProductTableForBooth
                        products={products}
                        selectedProducts={selectedProducts.map(p => (p?._id || ''))}
                        onProductSelect={(product: Product) =>
                          handleProductSelect(product, setFieldValue)
                        }
                      />
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
            )}}
        </Formik>
        
      </Box>
    </Modal>
  );
};

export default BoothDetailsModal;
