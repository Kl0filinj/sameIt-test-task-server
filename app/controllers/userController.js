const client = require("../db");

const userAttributes = [
  "id",
  "username",
  "email",
  "role",
  "dateCreate",
  "profileId",
];
const insertUserAttributes = userAttributes.slice(0, -2).slice(1).join(", ");
const selectUserAttributes = userAttributes.join(", ");

const profileAttributes = ["id", "firstName", "lastName", "state"];
const insertProfileAttributes = profileAttributes.slice(1).join(", ");
// const selectProfileAttributes = ["id", "firstName", "lastName", "state"];

const getAllUsers = async (req, res) => {
  const query = `
    select ${selectUserAttributes}
    from user
  `;
  const result = await client.query(query);

  return res.status(200).json({ data: result.rows });
};

const createNewUser = async (req, res) => {
  const { userName, firstName, lastName, email, role, state } = req.body;

  const userResponse = await client.query(
    `
  insert into user (${insertUserAttributes})
  values ($1, $2, $3)
    `,
    [userName, email, role]
  );

  console.log("userResponse: ", userResponse);

  const profileResponse = await client.query(
    `
  insert into profile (${insertProfileAttributes})
  values ($1, $2, $3)
    `,
    [firstName, lastName, state]
  );

  console.log("profileResponse: ", profileResponse);

  return res.status(201).json({ data: "Посмотри что в респонсах в консоли" });
};

const removeUser = async (req, res) => {
  return res.status(201).json({ data: "result.rows" });
};

module.exports = {
  getAllUsers,
  createNewUser,
  removeUser,
};
