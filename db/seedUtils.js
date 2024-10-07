const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const salt = 10;

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateName() {
  const noum = faker.company.buzzNoun();
  const adjective = faker.company.buzzAdjective();
  return `${capitalize(adjective)} ${capitalize(noum)}`;
}

function generateEmail(name, role) {
  let email = name.replace(" ", "-");
  email = email.toLowerCase();
  return `${email}@${role}Email.com`;
}

async function createLender() {
  const name = generateName();
  return {
    email: generateEmail(name, "lender"),
    name: name,
    password: await bcrypt.hash("password123", salt),
    role: "lender",
  };
}

async function createBorrower() {
  const name = generateName();
  return {
    name: name.replaceAll("'", "\n"),
    email: generateEmail(name, "borrower"),
    password: await bcrypt.hash("password123", salt),
    role: "borrower",
    city: faker.location.city(),
    street: faker.location.street(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    phone: faker.phone.number({ style: "international" }).slice(2),
    credit_score: randomInt(200, 1000),
    start_date: faker.date.past({ years: 10 }).toISOString(),
    industry: faker.commerce.department(),
  };
}

function createLoanRequest(user_id) {
  return {
    title: faker.commerce.productName().replaceAll("'", "\n"),
    description: faker.commerce.productDescription().replaceAll("'", "\n"),
    value: Number(faker.commerce.price({ min: 2000, max: 100000 })),
    created_at: faker.date.past({ days: 10 }).toISOString(),
    borrower_id: user_id,
  };
}

function createLoanProposal(request, lender_id) {
  const date = new Date(request.created_at);
  date.setHours(date.getHours() + 1);
  return {
    title: request.title,
    description: "Proposal Description",
    loan_amount: request.value,
    interest_rate: 0.05,
    repayment_term: 32,
    lender_id: lender_id,
    created_at: date,
    loan_request_id: request.id,
  };
}

module.exports = {
  createLender,
  createBorrower,
  createLoanRequest,
  createLoanProposal,
};
