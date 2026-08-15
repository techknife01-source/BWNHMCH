import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  uploadDate: string;
  uploader: string;
  status: string;
  displayOrder: number;
  isFeatured?: boolean;
  image?: {
    driveFileId: string;
    fileName: string;
    mimeType: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const GallerySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Hospital & OPD' },
    imageUrl: { type: String, default: '' },
    uploadDate: { type: String, default: '' },
    uploader: { type: String, default: 'Authorized Admin' },
    status: { type: String, default: 'PUBLISHED' },
    displayOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    image: {
      driveFileId: { type: String, default: '' },
      fileName: { type: String, default: '' },
      mimeType: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const GalleryModel =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GallerySchema, 'gallery');
