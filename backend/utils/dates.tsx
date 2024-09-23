export function getYesterday() {
  let today = new Date();
  today.setDate(today.getDate() - 1);
  return today.getDate() + '/' + (today.getMonth() + 1) + '/' + today;
}

// Fall, Spring, Summer
export const semesterDates = [
  { name: 'Fall', start: '08/20', end: '12/20' },
  { name: 'Spring', start: '01/20', end: '05/27' },
  { name: 'Summer', start: '06/06', end: '08/15' },
];

export const getSemester = (dateCheck: string) => {
  var c = dateCheck.split('/');

  for (let i = 0; i < semesterDates.length; ++i) {
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

export const getTodayDate = (format: string) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  let formatDay = '';
  let formatMonth = '';
  if (dd < 10) formatDay = '0' + dd;
  if (mm < 10) formatMonth = '0' + mm;

  const formattedToday = formatMonth + format + formatDay + format + yyyy;
  return formattedToday;
};

export const getTodayTime = () => {
  var currentDate = new Date();
  var time =
    currentDate.getHours.toString() + ':' + currentDate.getMinutes().toString();
  return time;
};

export const getTotalHours = (startTime: string, endTime: string) => {
  let s1 = startTime.split(':');
  let s2 = endTime.split(':');

  let mins = parseInt(s2[1]) - parseInt(s1[1]);
  let hours = parseInt(s2[0]) - parseInt(s1[0]);
  if (parseInt(s2[1]) < parseInt(s1[1])) {
    mins += 60;
    hours -= 1;
  }
  return hours.toString() + ':' + mins.toString();
};

export const checkValidDate = (
  dateFrom: string,
  dateTo: string,
  dateCheck: string
) => {
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
