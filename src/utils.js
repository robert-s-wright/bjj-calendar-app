function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const kidBelts = [
  "White",
  "Gray & White",
  "Gray",
  "Gray & Black",
  "Yellow & White",
  "Yellow",
  "Yellow & Black",
  "Orange & White",
  "Orange",
  "Orange & Black",
  "Green & White",
  "Green",
  "Green & Black",
];

const adultBelts = [
  "White",
  "Blue",
  "Purple",
  "Brown",
  "Black",
  "Red & Black",
  "Red & White",
  "Red",
];

const age = (user) => {
  return user.birthday !== ""
    ? Math.floor((new Date() - new Date(user.birthday)) / 31557600000)
    : null;
};

function durationCalculation(value) {
  let hour = 0;
  let minutes = value;

  while (minutes >= 60) {
    hour += 1;
    minutes -= 60;
  }

  return `${hour}:${minutes === 0 ? "00" : minutes}`;
}

export { capitalize, kidBelts, adultBelts, age, durationCalculation };
