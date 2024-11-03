const bcrypt = require("bcrypt");
const db = require("../db/dbConfig.js");
const { getRandomAvatar } = require("../utils/helpers.js");

require("dotenv").config();
const SALT = Number(process.env.SALT);

/**
 * Get all lenders
 * @returns {Array} - List of All lenders
 */
const getAllLenders = async () => {
  const queryStr =
    "SELECT lenders.id, users.id as user_id, users.email, lenders.business_name, lenders.image_url " +
    "FROM users JOIN lenders ON users.id = lenders.user_id";
  try {
    const allLenders = await db.any(queryStr);
    return allLenders;
  } catch (error) {
    return error;
  }
};

// Get a specific lender by ID
const getLender = async (id) => {
  const queryStr =
    "SELECT users.id as user_id, users.email, lenders.business_name, lenders.image_url, lenders.id " +
    "FROM users JOIN lenders ON users.id = lenders.user_id " +
    "WHERE lenders.id=$1";
  try {
    const oneLender = await db.one(queryStr, [id]);
    return oneLender;
  } catch (err) {
    if (err.message == "No data returned from the query.") {
      throw { message: "Lender not found." };
    } else if (err.message.includes("uuid")) {
      throw { message: "Invalid Lender ID." };
    } else {
      throw { error: "Something went wrong." };
    }
  }
};

/**
 * Create New Lender
 * @param {Object} lender
 * @returns {Object} - New Lender
 */
async function createLender(lender) {
  const { email, password, business_name } = lender;
  const image_url = await getRandomAvatar(lender.buiness_name);
  const password_hash = await bcrypt.hash(password, SALT);
  const userQuery =
    "INSERT INTO users(email, password, role, last_logged) VALUES" +
    "($[email], $[password], 'lender', $[last_logged]) " +
    "RETURNING *";
  const lenderQuery =
    "INSERT INTO lenders(business_name, image_url,  user_id) VALUES" +
    "($[business_name], $[image_url], $[user_id]) " +
    "RETURNING *";
  const addToMailListQuery =
    "INSERT INTO mail_list (email, role) " +
    "VALUES($[email], 'lender') RETURNING *";
  try {
    const data = await db.tx(async (t) => {
      const newUser = await t.one(userQuery, {
        email,
        password: password_hash,
        last_logged: new Date(),
      });

      const newLender = await t.one(lenderQuery, {
        business_name,
        image_url,
        user_id: newUser.id,
      });

      await t.one(addToMailListQuery, { email });

      return { newUser, newLender };
    });
    return {
      user_id: data.newUser.id,
      id: data.newLender.id,
      email: data.newUser.email,
      image_url: data.newLender.image_url,
      business_name: data.newLender.business_name,
      password_hash: data.newUser.password,
    };
  } catch (err) {
    if (err.detail.includes("email") && err.detail.includes("already exists"))
      return { error: "Email already exists." };
    else {
      return err;
    }
  }
}

/**
 * Delete Lender
 * @param {String} id - Lender ID
 * @returns
 */
async function deleteLender(id) {
  const lenderQuery = "SELECT * FROM lenders WHERE id=$1";
  const deleteLenderQuery = "DELETE from users WHERE id=$1 RETURNING *";
  try {
    const data = await db.tx(async (t) => {
      const lender = await t.one(lenderQuery, [id]);
      const user = await t.one(deleteLenderQuery, [lender.user_id]);
      return { lender, user };
    });
    const { lender, user } = data;
    const user_id = user.id;
    delete user.id;
    delete user.role;
    return {
      user_id,
      ...user,
      ...lender,
    };
  } catch (err) {
    if (err.message == "No data returned from the query.") {
      return { error: "Lender not found." };
    } else {
      return err;
    }
  }
}

async function updateLender(id, lender) {
  const queryStr =
    "UPDATE lenders SET business_name=$[business_name], image_url=$[image_url] " +
    "WHERE id=$[id] RETURNING *";

  try {
    const data = await db.one(queryStr, { ...lender, id });
    return data;
  } catch (err) {
    if (err.message.includes("No data returned from the query.")) {
      return { error: "Lender not Found" };
    } else if (
      err.message.includes("duplicate key value violates unique constraint")
    ) {
      return { error: "Email already in use." };
    } else {
      return err;
    }
  }
}

module.exports = {
  getAllLenders,
  getLender,
  createLender,
  deleteLender,
  updateLender,
};
