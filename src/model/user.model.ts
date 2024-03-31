import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = model<IUser>('User', userSchema);

export { UserModel, IUser };
