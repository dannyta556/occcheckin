import express from 'express';
import Checkin from '../models/checkinModel.js';
import Student from '../models/studentModel.js';
import expressAsyncHandler from 'express-async-handler';

const checkinRouter = express.Router();

// Fall, Spring, Summer
const semesterDates = [
  { name: 'Fall', start: '08/20', end: '12/20' },
  { name: 'Spring', start: '01/20', end: '05/27' },
  { name: 'Summer', start: '06/06', end: '08/15' },
];

const getSemester = (dateCheck) => {
  var c = dateCheck.split('/');

  for (let i = 0; i < semesterDates.length(); ++i) {
    var d1 = semesterDates[i].start.split('/');
    var d2 = semesterDates[i].end.split('/');

    if (
      parseInt(c[0]) >= parseInt(d1[0]) &&
      parseInt(c[1]) >= parseInt(d1[1]) &&
      parseInt(c[0]) <= parseInt(d2[0]) &&
      parseInt(c[1]) <= parseInt(d2[0])
    ) {
      const today = new Date();
      return semesterDates[i].name + ' ' + today.getFullYear().toString();
    }
  }
};

const getTodayDate = (format) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = mm + format + dd + format + yyyy;
  return formattedToday;
};

const getTodayTime = () => {
  var currentDate = new Date();
  var time =
    currentDate.getHours.toString() + ':' + currentDate.getMinutes().toString();
  return time;
};

const getTotalHours = (startTime, endTime) => {
  let s1 = startTime.split(':');
  let s2 = endTime.split(':');

  let mins = parseInt(s2[1]) - parseInt(s1[1]);
  let hours = parseInt(s2[0]) - parseInt(s1[0]);
  if (parseInt(s2[1] < parseInt(s1[1]))) {
    mins += 60;
    hours -= 1;
  }
  return hours.toString() + ':' + mins.toString();
};

const checkValidDate = (dateFrom, dateTo, dateCheck) => {
  var d1 = dateFrom.split('/');
  var d2 = dateTo.split('/');
  var c = dateCheck.split('/');

  if (
    parseInt(c[0]) >= parseInt(d1[0]) &&
    parseInt(c[1]) >= parseInt(d1[1]) &&
    parseInt(c[0]) <= parseInt(d2[0]) &&
    parseInt(c[1]) <= parseInt(d2[1])
  ) {
    return true;
  } else {
    return false;
  }
};

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

// Checkout
// need last checkin time from student
checkinRouter.post(
  '/checkout',
  expressAsyncHandler(async (req, res) => {
    const thisStudent = await Student.find({ studentID: studentID });
    const todayDate = getTodayDate('-');
    if (
      thisStudent.isCheckedin === false ||
      todayDate != thisStudent.lastCheckin
    ) {
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
        });
      } else {
        res.status(500).send({
          saveCheckout,
        });
      }
    }
  })
);

export default checkinRouter;
