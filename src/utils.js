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

export { capitalize, kidBelts, adultBelts, age };
