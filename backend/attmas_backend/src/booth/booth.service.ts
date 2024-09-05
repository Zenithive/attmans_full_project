import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booth, BoothDocument } from './booth.schema';
import { CreateBoothDto } from './create-booth.dto';
import { User, UserDocument } from 'src/users/user.schema';
import {
  Exhibition,
  ExhibitionDocument,
} from 'src/exhibition/schema/exhibition.schema';
import { EmailService2 } from 'src/notificationEmail/Exebitionemail.service';
import { WorkExprience } from 'src/profile/schemas/work.exprience.schema';
import { BOOTH_STATUSES } from 'src/common/constant/status.constant';

@Injectable()
export class BoothService {
  constructor(
    @InjectModel(Booth.name) private boothModel: Model<BoothDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(WorkExprience.name)
    private workExperienceModel: Model<UserDocument>,
    @InjectModel(Exhibition.name)
    private exhibitionModel: Model<ExhibitionDocument>,
    private emailService: EmailService2,
  ) {}

  // async create(createBoothDto: CreateBoothDto): Promise<Booth> {
  //   console.log('Booth Products:', createBoothDto.products);

  //   // for (let index = 0; index < createBoothDto.products.length; index++) {
  //   //   //let element: string = createBoothDto.products[index];
  //   //   createBoothDto.products[index] = new Types.ObjectId(createBoothDto.products[index]);
  //   // }

  //   // Convert `_id` to `ObjectId` if it is a valid string
  //   // createBoothDto.products = createBoothDto.products.forEach((product) => {
  //   //   if (typeof product === 'string' && Types.ObjectId.isValid(product)) {
  //   //     return { ...product, _id: new Types.ObjectId(product) }; // Convert string to ObjectId
  //   //   }
  //   //   return product; // Return as is if not a string or already an ObjectId
  //   // });

  //   // Convert `exhibitionId` to ObjectId if it is a valid string
  //   if (typeof createBoothDto.exhibitionId === 'string' && Types.ObjectId.isValid(createBoothDto.exhibitionId)) {
  //     createBoothDto.exhibitionId = new Types.ObjectId(createBoothDto.exhibitionId);
  //   }

  //   const existingBooth = await this.boothModel.findOne({
  //     exhibitionId: createBoothDto.exhibitionId,
  //     userId: createBoothDto.userId,
  //   });

  //   if (existingBooth) {
  //     throw new Error('You have already participated in this exhibition');
  //   }

  //   const createdBooth = new this.boothModel(createBoothDto);
  //   const booth = await createdBooth.save();

  //   const newProducts = createBoothDto.products.filter(
  //     (product) => !product._id,
  //   );

  //   // if (newProducts.length > 0) {
  //   //   // Update WorkExperience by matching the username and pushing new products
  //   //   await this.workExperienceModel.updateOne(
  //   //     { username: createBoothDto.username },
  //   //     { $push: { products: { $each: newProducts } } },
  //   //   );
  //   // }

  //   const exhibitionId = new Types.ObjectId(createBoothDto.exhibitionId);

  //   const exhibition = await this.exhibitionModel
  //     .findById(exhibitionId)
  //     .populate('userId', 'firstName lastName username', this.userModel)
  //     .exec();
  //   if (exhibition) {
  //     const { username } = exhibition;
  //     await this.emailService.sendEmailtoExhibition(
  //       username,
  //       'New Booth Created',
  //       exhibitionId.toHexString(),
  //       booth.username,
  //       exhibition.title,
  //     );
  //   }
  //   console.log('exhibition', exhibition);
  //   return booth;
  // }

  async create(createBoothDto: CreateBoothDto): Promise<Booth> {
    console.log('Booth Products:', createBoothDto.products);

    let exhibitionId: Types.ObjectId;

    // Convert `exhibitionId` to ObjectId if it is a string
    if (
      typeof createBoothDto.exhibitionId === 'string' &&
      Types.ObjectId.isValid(createBoothDto.exhibitionId)
    ) {
      exhibitionId = new Types.ObjectId(createBoothDto.exhibitionId);
    } else if (createBoothDto.exhibitionId instanceof Types.ObjectId) {
      exhibitionId = createBoothDto.exhibitionId;
    } else {
      throw new Error('Invalid exhibitionId');
    }

    const existingBooth = await this.boothModel.findOne({
      exhibitionId,
      userId: createBoothDto.userId,
    });

    if (existingBooth) {
      throw new Error('You have already participated in this exhibition');
    }

    const createdBooth = new this.boothModel({
      ...createBoothDto,
      exhibitionId,
    });
    const booth = await createdBooth.save();

    // const newProducts = createBoothDto.products.filter(
    //   (product) => !product._id,
    // );

    // Update WorkExperience if needed
    // if (newProducts.length > 0) {
    //   await this.workExperienceModel.updateOne(
    //     { username: createBoothDto.username },
    //     { $push: { products: { $each: newProducts } } },
    //   );
    // }

    this.sendEmailToExhibition(exhibitionId, booth);

    console.log('Booth created:', booth);
    return booth;
  }

  // Email sending method remains the same
  async sendEmailToExhibition(exhibitionId: Types.ObjectId, booth: Booth) {
    const exhibition = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();

    if (exhibition) {
      const { username } = exhibition;
      await this.emailService.sendEmailtoExhibition(
        username,
        'New Booth Created',
        exhibitionId.toHexString(),
        booth.username,
        exhibition.title,
      );
    }
    console.log('Exhibition email sent:', exhibition);
  }

  async findAll(status?: string): Promise<Booth[]> {
    const filter = status ? { status } : {};
    return this.boothModel
      .find(filter)
      .populate('userId', 'firstName lastName', this.userModel)
      .exec();
  }

  // async findWorkExpriencesWithProductDetails(productId: string): Promise<any[]> {
  //   return this.workExperienceModel.aggregate([
  //     {
  //       $unwind: '$products', // Deconstruct the products array to process each ObjectId individually
  //     },
  //     {
  //       $match: {
  //         products: new mongoose.Types.ObjectId(productId), // Match documents with the given productId in the products array
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'workexpriences', // The collection to join with
  //         localField: 'products', // Field from the workexpriences collection (ObjectId)
  //         foreignField: '_id', // Field from the products collection (ObjectId)
  //         as: 'productDetails', // Output field that will contain the joined documents
  //       },
  //     },
  //     {
  //       $unwind: '$productDetails', // Deconstruct the productDetails array to process each product individually
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         workAddress: 1,
  //         productToMarket: 1,
  //         qualification: 1,
  //         organization: 1,
  //         sector: 1,
  //         designation: 1,
  //         userType: 1,
  //         hasPatent: 1,
  //         products: {
  //           productName: '$productDetails.productName',
  //           productDescription: '$productDetails.productDescription',
  //           // productType: '$productDetails.productType',
  //           productPrice: '$productDetails.productPrice',
  //           currency: '$productDetails.currency',
  //           videourlForproduct: '$productDetails.videourlForproduct',
  //         },
  //       },
  //     },
  //   ]).exec();
  // }

  async findOne(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById(id).exec();
    if (!booth) {
      throw new NotFoundException(`Booth with id ${id} not found`);
    }
    return booth;
  }

  // async findBoothProduct(username: string): Promise<Product[]> {
  //   const booth = await this.boothModel
  //     .findOne({ username })
  //     .select('products')
  //     .exec();
  //   if (!booth) {
  //     throw new NotFoundException(`Booth with username  ${username} not found`);
  //   }
  //   console.log('booth.products', booth.products);
  //   return booth.products;
  // }

  async delete(id: string): Promise<Booth> {
    const deletedBooth = await this.boothModel.findByIdAndDelete(id).exec();
    if (!deletedBooth) {
      throw new NotFoundException(`Booth with id ${id} not found`);
    }
    return deletedBooth;
  }

  // async approveBooth(id: string): Promise<Booth> {
  //   const booth = await this.boothModel.findById(id);
  //   if (!booth) {
  //     throw new NotFoundException('Booth not found');
  //   }
  //   booth.status = 'Approved';
  //   booth.buttonsHidden = true;
  //   await booth.save();

  //   const exhibitionId = new Types.ObjectId(booth.exhibitionId);

  //   const exhibition: any = await this.exhibitionModel
  //     .findById(exhibitionId)
  //     .populate('userId', 'firstName lastName username', this.userModel)
  //     .exec();
  //   if (exhibition) {
  //     const innovator = await this.userModel.findById(booth.userId);
  //     if (innovator) {
  //       await this.emailService.sendBoothStatusEmail(
  //         innovator.username,
  //         'Booth Approved',
  //         (exhibition._id as Types.ObjectId).toHexString(),
  //         booth.title,
  //         'approved',
  //         booth.username,
  //         exhibition.userId.firstName,
  //         exhibition.userId.lastName,
  //       );
  //     }
  //   }

  //   return booth;
  // }

  async approveBooth(id: string): Promise<Booth> {
    const booth = await this.boothModel.findById(id);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = BOOTH_STATUSES.approved;
    booth.buttonsHidden = true;
    await booth.save();

    const exhibitionId = new Types.ObjectId(booth.exhibitionId);

    const exhibition: any = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
    console.log('exhibition', exhibition);
    console.log('exhibition.userId', exhibition.userId);
    if (exhibition && exhibition.userId) {
      console.log('exhibition', exhibition);
      console.log('exhibition.userId', exhibition.userId);

      const innovator = await this.userModel.findById(booth.userId);
      if (innovator) {
        await this.emailService.sendBoothStatusEmail(
          innovator.username,
          'Booth Approved',
          (exhibition._id as Types.ObjectId).toHexString(),
          booth.title,
          'approved',
          booth.username,
          exhibition.userId.firstName,
          exhibition.userId.lastName,
        );
      }
    } else {
      // Handle the case where exhibition or exhibition.userId is null
      console.error('Exhibition or userId is null');
      // You might want to handle this scenario gracefully
    }

    return booth;
  }

  async rejectBooth(id: string, comment: string): Promise<Booth> {
    const booth = await this.boothModel.findById(id);
    if (!booth) {
      throw new NotFoundException('Booth not found');
    }
    booth.status = BOOTH_STATUSES.rejected;
    booth.buttonsHidden = true;
    booth.rejectComment = comment;
    await booth.save();

    const exhibitionId = new Types.ObjectId(booth.exhibitionId);

    const exhibition: any = await this.exhibitionModel
      .findById(exhibitionId)
      .populate('userId', 'firstName lastName username', this.userModel)
      .exec();
    if (exhibition) {
      const innovator = await this.userModel.findById(booth.userId);
      if (innovator) {
        await this.emailService.sendBoothStatusEmail(
          innovator.username,
          'Booth Rejected',
          (exhibition._id as Types.ObjectId).toHexString(),
          booth.title,
          'rejected',
          booth.username,
          exhibition.userId.firstName,
          exhibition.userId.lastName,
        );
      }
    }

    return booth;
  }

  async findByUsername(username: string): Promise<Booth> {
    const user = await this.boothModel.findOne({ username }).exec();
    return user;
  }
}
