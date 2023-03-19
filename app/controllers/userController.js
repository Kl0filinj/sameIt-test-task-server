const client = require("../db");
const { v4: uuidv4 } = require("uuid");

const userAttributes = [
  "id",
  "username",
  "email",
  "role",
  "dateCreate",
  "profileId",
];
const insertUserAttributes = userAttributes
  .filter((item) => item !== "dateCreate")
  .slice(1)
  .join(", ");
const selectUserAttributes = userAttributes.join(", ");

const profileAttributes = ["id", "firstName", "lastName", "gender"];
const insertProfileAttributes = profileAttributes.join(", ");
// const selectProfileAttributes = ["id", "firstName", "lastName", "gender"];

const getAllUsers = async (req, res) => {
  const query = `
    select ${selectUserAttributes}
    from users
  `;
  const result = await client.query(query);

  return res.status(200).json({ data: result.rows });
};

const createNewUser = async (req, res) => {
  const { username, firstName, lastName, email, role, gender } = req.body;

  const profileId = uuidv4();
  const profileResponse = await client.query(
    `
  insert into profiles (${insertProfileAttributes})
  values ($1, $2, $3, $4)
    `,
    [profileId, firstName, lastName, gender]
  );

  console.log("profileResponse: ", profileResponse);

  const userResponse = await client.query(
    `
  insert into users (${insertUserAttributes})
  values ($1, $2, $3, $4)
    `,
    [username, email, role, profileId]
  );

  console.log("userResponse: ", userResponse);

  return res.status(201).json({ data: "Посмотри что в респонсах в консоли" });
};

const removeUser = async (req, res) => {
  const { userId } = req;
  const response = await client.query(
    `
    delete from users
    where id = $1
    `,
    [userId]
  );

  console.log("DELETE Resp", response);

  return res.status(201).json({ data: "Посмотри что в респонсах в консоли" });
};

module.exports = {
  getAllUsers,
  createNewUser,
  removeUser,
};
