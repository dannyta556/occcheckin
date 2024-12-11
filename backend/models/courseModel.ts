import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('course', courseSchema);
export default Course;
