import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  wishlist: Schema.Types.ObjectId[];
  addresses: {
    label: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  role: 'user' | 'admin';
  refreshToken?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  passwordHash:  { type: String, required: true },
  avatar:        { type: String, default: '' },
  wishlist:      [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  addresses:     [{
    label:      String,
    line1:      String,
    line2:      String,
    city:       String,
    state:      String,
    postalCode: String,
    country:    { type: String, default: 'PK' },
    isDefault:  { type: Boolean, default: false }
  }],
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken:  { type: String },
  createdAt:     { type: Date, default: Date.now }
});

export const User = model<IUser>('User', userSchema);
