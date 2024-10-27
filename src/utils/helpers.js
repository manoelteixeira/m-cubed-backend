const { faker } = require("@faker-js/faker");

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function choose(arr, num) {
  if (!num) {
    return arr[randomInt(0, arr.length)];
  } else if (arr.length <= num) {
    return arr;
  }
  const chosen = [];
  while (chosen.length <= num) {
    const item = arr[randomInt(0, arr.length)];
    if (!chosen.includes(item)) {
      chosen.push(item);
    }
  }
  return chosen;
}

function getRandomName() {
  const options = [
    faker.animal.type,
    faker.vehicle.type,
    faker.science.chemicalElement,
    faker.color.human,
    faker.commerce.department,
    faker.food.fruit,
    faker.food.spice,
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

async function getRandomAvatar(name) {
  const baseURL = "https://api.multiavatar.com";
  const data = await fetch(`${baseURL}/${name}.svg`);

  return data.url || "https://placehold.co/600x400";
}

/**
 * Offset date by year, month, day, hour
 * @param {Date} date
 * @param {Object} data
 */
function offsetDate(date, options) {
  const years = options.years;
  const months = options.months;
  const days = options.days;
  const hours = options.hours;

  let newDate = new Date(date.toISOString());
  if (years) {
    newDate.setFullYear(newDate.getFullYear() + years);
  }
  if (months) {
    newDate.setMonth(newDate.getMonth() + months);
  }
  if (days) {
    newDate.setDate(newDate.getDate() + days);
  }
  if (hours) {
    newDate.setHours(newDate.getHours() + hours);
  }
  return newDate;
}

function isExpired(currentDate, date) {
  const dif = currentDate - date;
  if (dif >= 0) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  capitalize,
  randomInt,
  choose,
  getRandomName,
  getRandomAvatar,
  offsetDate,
  isExpired,
};
