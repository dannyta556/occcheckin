import express from 'express';
import Checkin from '../models/checkinModel.js';
import Student from '../models/studentModel.js';
import expressAsyncHandler from 'express-async-handler';

const checkinRouter = express.Router();

checkinRouter.get(
  '/getCheckins',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const studentID = query.studentID;

    const result = await Checkin.find({ studentID: studentID });

    if (result) {
      res.send({
        result,
        response: true,
      });
    } else {
      res.send({
        result,
        response: false,
      });
    }
  })
);

// Make Checkin (maybe in student)
// check in time format: mm/dd/yyyy hh:mm
checkinRouter.post(
  '/checkin',
  expressAsyncHandler(async (req, res) => {
    const thisStudent = await Student.find({ studentID: req.body.studentID });
    if (thisStudent.isCheckedin === true) {
      // student already is checked in
      res.send({ response: false });
    } else {
      const todayDate = getTodayDate('/');
      const todayTime = getTodayTime();

      const updateStudent = await Student.findOneAndUpdate(
        { studentID: thisStudent.studentID },
        { isCheckedin: true, lastCheckin: todayDate + ' ' + todayTime }
      );

      if (updateStudent) {
        res.send({
          response: true,
          message: `${updateStudent.firstname} ${updateStudent.lastname} has checked in at
          ${updateStudent.isCheckedin}`,
        });
      } else {
        res.send({
          response: false,
          message: `Error checking in ${thisStudent.studentID}`,
        });
      }
    }
  })
);
// Checkout
// need last checkin time from student
checkinRouter.post(
  '/checkout',
  expressAsyncHandler(async (req, res) => {
    const thisStudent = await Student.find({ studentID: req.body.studentID });
    const todayDate = getTodayDate('-');
    let lastCheckin = thisStudent.lastCheckin.split(' ');
    if (thisStudent.isCheckedin === false || todayDate != lastCheckin[0]) {
      res.send({ response: false });
    } else {
      const studentID = req.body.studentID;
      semester = getSemester(getTodayDate('/'));
      // split time from thisStudent.lastCheckin
      const checkin = thisStudent.lastCheckin;
      const checkout = getTodayTime();
      const total = getTotalHours(checkin, checkout);

      const makeCheckout = new Checkin({
        studentID: studentID,
        date: todayDate,
        semester: semester,
        checkin: checkin,
        checkout: checkout,
        total: total,
      });

      const saveCheckout = await makeCheckout.save();
      if (saveCheckout) {
        res.status(201).send({
          saveCheckout,
          message: `${saveCheckout.studentID} has checked out at ${saveCheckout.checkout}`,
        });
      } else {
        res.status(500).send({
          saveCheckout,
          message: `Error in checking out ${saveCheckout.studentID}`,
        });
      }
    }
  })
);

export default checkinRouter;
