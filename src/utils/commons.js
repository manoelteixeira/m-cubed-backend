const { faker } = require("@faker-js/faker");

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function choose(arr) {
  return arr[randomInt(0, arr.length)];
}

function getRandomName() {
  const options = [
    faker.animal.type,
    faker.vehicle.type,
    faker.science.chemicalElement,
  ];
  const selected = choose(options)();
  let name = selected?.name ? selected.name : selected;
  const adjective = capitalize(faker.word.adjective());
  name = `${adjective} ${name}`;
  filter = /[^a-zA-Z0-9]/g;
  name = name.replaceAll(filter, " ").toLowerCase();
  name = name
    .split(" ")
    .map((item) => capitalize(item))
    .join(" ");
  return name;
}

module.exports = {
  capitalize,
  randomInt,
  choose,
  getRandomName,
};
