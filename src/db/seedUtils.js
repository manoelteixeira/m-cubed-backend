const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
require("dotenv").config();
const SALT = parseInt(process.env.SALT);

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
  const filter = /[^a-z1-9]/g;
  name = name.toLowerCase().trim().replaceAll(filter, " ").replaceAll(" ", ".");
  return `${name}${randomInt(0, 1000)}\@${role}.com`;
}

async function createLender() {
  const name = generateName();
  return {
    email: generateEmail(name, "lender"),
    name: name,
    password: await bcrypt.hash("password123", SALT),
    role: "lender",
  };
}

async function createBorrower() {
  const name = generateName();
  return {
    name: name.replaceAll("'", "\n"),
    email: generateEmail(name, "borrower"),
    password: await bcrypt.hash("password123", SALT),
    role: "borrower",
    city: faker.location.city(),
    street: faker.location.street(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    phone: faker.phone.number({ style: "international" }).slice(2),
    credit_score: randomInt(350, 850),
    start_date: faker.date.past({ years: 10 }).toISOString(),
    industry: faker.commerce.department(),
  };
}

function createLoanRequest(borrower_id) {
  return {
    title: faker.commerce.productName().replaceAll("'", "\n"),
    description: faker.commerce.productDescription().replaceAll("'", "\n"),
    value: Number(faker.commerce.price({ min: 2000, max: 10000 })),
    created_at: faker.date.past({ days: 10 }).toISOString(),
    borrower_id: borrower_id,
  };
}

function createLoanProposal(request, lender) {
  const date = new Date(request.created_at);
  date.setHours(date.getHours() + 1);
  return {
    title: `${lender.business_name} - ${request.title}`,
    description: faker.hacker.phrase().replaceAll("'", ""),
    loan_amount: request.value,
    interest_rate: randomInt(0, 12) / 100,
    repayment_term: randomInt(12, 60),
    lender_id: lender.id,
    created_at: date.toISOString(),
    loan_request_id: request.id,
  };
}

async function userFactory(num, role) {
  const data = [];
  while (data.length < num) {
    const user = await role();
    if (!data.find((value) => value.email == user.email)) {
      data.push(user);
    }
  }
  return data;
}

function loanRequestFactory(num, borrower_id) {
  const data = [];
  while (data.length < num) {
    data.push(createLoanRequest(borrower_id));
  }
  return data;
}

function loanProposalFactory(num, request, lender_id) {
  const data = [];
  while (data.length < num) {
    data.push(request, lender_id);
  }
  return data;
}

module.exports = {
  createLender,
  createBorrower,
  createLoanRequest,
  createLoanProposal,
  userFactory,
  loanRequestFactory,
  loanProposalFactory,
};
