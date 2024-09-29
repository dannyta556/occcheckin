export function getYesterday() {
  let today = new Date();
  today.setDate(today.getDate() - 1);
  return (
    today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear()
  );
}

// Fall, Spring, Summer
export const semesterDates = [
  { name: 'Fall', start: '08/20', end: '12/20' },
  { name: 'Spring', start: '01/20', end: '05/27' },
  { name: 'Summer', start: '06/06', end: '08/15' },
];

export const getSemester = (dateCheck) => {
  //var c = dateCheck.split('/');
  for (let i = 0; i < semesterDates.length; ++i) {
    var d1 = semesterDates[i].start.split('/');
    var d2 = semesterDates[i].end.split('/');
    /*
      parseInt(c[0]) >= parseInt(d1[0]) &&
      parseInt(c[1]) >= parseInt(d1[1]) &&
      parseInt(c[0]) <= parseInt(d2[0]) &&
      parseInt(c[1]) <= parseInt(d2[0])
    */
    let today = new Date();
    if (
      new Date(dateCheck) >=
        new Date(semesterDates[i].start + '/' + today.getFullYear()) &&
      new Date(dateCheck) <=
        new Date(semesterDates[i].end + '/' + today.getFullYear())
    ) {
      const today = new Date();
      return semesterDates[i].name + ' ' + today.getFullYear().toString();
    } else {
      return 'none';
    }
  }
};

export const getTodayDate = (format) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  console.log(dd);
  let formatDay = '';
  let formatMonth = '';
  if (dd < 10) {
    formatDay = '0' + dd;
  } else {
    formatDay = dd.toString();
  }
  if (mm < 10) {
    formatMonth = '0' + mm;
  } else {
    formatMonth = mm.toString();
  }

  const formattedToday = formatMonth + format + formatDay + format + yyyy;
  return formattedToday;
};

export const getTodayTime = () => {
  var currentDate = new Date();
  let hours =
    currentDate.getHours() < 10
      ? '0' + currentDate.getHours().toString()
      : currentDate.getHours().toString();
  let mins =
    currentDate.getMinutes() < 10
      ? '0' + currentDate.getMinutes().toString()
      : currentDate.getMinutes().toString();
  return hours + ':' + mins;
};

export const getTotalHours = (startTime, endTime) => {
  let s1 = startTime.split(':');
  let s2 = endTime.split(':');

  let mins = parseInt(s2[1]) - parseInt(s1[1]);
  let hours = parseInt(s2[0]) - parseInt(s1[0]);
  if (parseInt(s2[1]) < parseInt(s1[1])) {
    mins += 60;
    hours -= 1;
  }
  let formatHrs = hours < 10 ? '0' + hours.toString() : hours.toString();
  let formatMins = mins < 10 ? '0' + mins.toString() : mins.toString();
  return formatHrs + ':' + formatMins;
};

export const checkValidDate = (dateFrom, dateTo, dateCheck) => {
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
