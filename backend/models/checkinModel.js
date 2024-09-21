import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema(
  {
    studentID: { type: String, required: true },
    date: { type: String, required: true },
    semester: { type: String, required: true },
    checkin: { type: String },
    checkout: { type: String },
    total: { type: String },
  },
  {
    timestamps: true,
  }
);

const Checkin = mongoose.model('checkin', checkinSchema);
export default Checkin;
