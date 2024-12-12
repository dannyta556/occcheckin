import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.ts';
import courseRouter from './routes/courseRoutes.ts';
import studentRouter from './routes/studentRoutes.ts';
import checkinRouter from './routes/checkinRoutes.ts';

dotenv.config();

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers here
app.use('/api/courses', courseRouter);

app.use('/api/students', studentRouter);

app.use('/api/checkin', checkinRouter);

app.use('/api/seed', seedRouter);

// error handler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
