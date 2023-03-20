const client = require("../db");
const { v4: uuidv4 } = require("uuid");
const RequestError = require("../utils/requestError");

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
const selectUserAttributes = userAttributes
  .map((item) => `users.${item}`)
  .join(", ");
const updateUserAttributes = userAttributes.slice(1, -2);

const profileAttributes = ["id", "firstName", "lastName", "gender"];
const insertProfileAttributes = profileAttributes.join(", ");
const selectProfileAttributes = profileAttributes
  .slice(1)
  .map((item) => `profiles.${item}`)
  .join(" ,");
const updateProfileAttributes = profileAttributes.slice(1);

const getAllUsers = async (req, res) => {
  const query = `
    select ${selectUserAttributes}, ${selectProfileAttributes}
    from users
    join profiles on users.profileId = profiles.id
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

  if (!profileResponse.rowCount) {
    return RequestError(404, "Something goes wrong with сreating a profile");
  }

  const userResponse = await client.query(
    `
  insert into users (${insertUserAttributes})
  values ($1, $2, $3, $4)
    `,
    [username, email, role, profileId]
  );

  if (!userResponse.rowCount) {
    return RequestError(404, "Something goes wrong with сreating a user");
  }

  return res
    .status(201)
    .json({ data: { username, firstName, lastName, email, role, gender } });
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const newAttributes = req.body;

  const validProfileAttributes = Object.keys(newAttributes).filter((item) =>
    updateProfileAttributes.includes(item)
  );
  const validUserAttributes = Object.keys(newAttributes).filter((item) =>
    updateUserAttributes.includes(item)
  );

  if (validProfileAttributes.length !== 0) {
    let query = "update profiles set";
  }

  console.log("USERID", userId);
  return res.status(201).json({ data: `UPDATE METHOD` });
};

const removeUser = async (req, res) => {
  const { profileId } = req.params;

  const response = await client.query(
    `
      delete from users
      using profiles
      where users.profileId = $1 AND profiles.id = $1
    `,
    [profileId]
  );

  if (!response.rowCount) {
    return RequestError(404, `Fail to delete user profile ${profileId}`);
  }

  return res
    .status(201)
    .json({ data: `User profile ${profileId} was successfully deleted` });
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  removeUser,
};
