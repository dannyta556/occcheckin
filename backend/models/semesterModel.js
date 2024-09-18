import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema(
  {
    name: { type: 'String', unique: true, required: true },
    checkins: { type: Array, default: [], required: true },
  },
  {
    timestamps: true,
  }
);

const Semester = mongoose.model('semester', semesterSchema);
export default Semester;
