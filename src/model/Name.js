import mongoose from 'mongoose';

const NameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('Name', NameSchema);
