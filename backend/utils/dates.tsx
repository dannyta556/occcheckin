export default function getYesterday() {
  let today = new Date();
  today.setDate(today.getDate() - 1);
  return today.getDate() + '/' + (today.getMonth() + 1) + '/' + today;
}
