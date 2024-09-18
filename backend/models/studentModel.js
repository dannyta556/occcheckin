import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    studentID: { type: String, required: true },
    enrolled: { type: Array, default: [] },
    mathlvl: { type: String },
    lastCheckin: { type: Date },
    isCheckedin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('student', studentSchema);
export default Student;
