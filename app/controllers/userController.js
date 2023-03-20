const client = require("../db");
const { v4: uuidv4 } = require("uuid");
const RequestError = require("../utils/requestError");
const {
  User,
  Profile,
  calculateAttributesForUpdate,
} = require("../utils/userControllerUtils");

const getAllUsers = async (req, res) => {
  const { role } = req.query;

  const userRole = ["admin", "writer", "visitor"].includes(role)
    ? `where users.role = '${role}'`
    : "";

  const query = `
    select ${User("select")}, ${Profile("select")}
    from users
    join profiles on users.profileId = profiles.id
    ${userRole}
  `;

  const result = await client.query(query);

  if (!result.rows) {
    return RequestError(404, "Something goes wrong with getting a profile");
  }

  return res.status(200).json({ data: result.rows });
};

const createNewUser = async (req, res) => {
  const { username, firstName, lastName, email, role, gender } = req.body;

  const profileId = uuidv4();
  const profileResponse = await client.query(
    `
  insert into profiles (${Profile("insert")})
  values ($1, $2, $3, $4)
    `,
    [profileId, firstName, lastName, gender]
  );

  if (!profileResponse.rowCount) {
    return RequestError(404, "Something goes wrong with сreating a profile");
  }

  const userResponse = await client.query(
    `
  insert into users (${User("insert")})
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
    Profile("update").includes(item)
  );

  const validUserAttributes = Object.keys(newAttributes).filter((item) =>
    User("update").includes(item)
  );

  let profileId;

  if (validUserAttributes.length !== 0) {
    const { query, values } = calculateAttributesForUpdate(
      userId,
      validUserAttributes,
      newAttributes,
      "users"
    );

    profileId = await client.query(
      `${query} returning users.profileId`,
      values
    );

    if (!profileId.rows[0].profileid) {
      return RequestError(404, "Something goes wrong with updating user");
    }
  }

  if (validProfileAttributes.length !== 0) {
    const { query, values } = calculateAttributesForUpdate(
      profileId.rows[0].profileid,
      validProfileAttributes,
      newAttributes,
      "profiles"
    );

    const profileUpdateResult = await client.query(query, values);

    if (!profileUpdateResult.rowCount) {
      return RequestError(404, "Something goes wrong with updating a profile");
    }
  }

  return res
    .status(201)
    .json({ data: `User profile ${userId} was successfully updated` });
};

const removeUser = async (req, res) => {
  const { userId } = req.params;

  const query = `
        select ${User("select")}
        from users
        where id = $1
    `;

  const result = await client.query(query, [userId]);
  const profileId = result.rows[0].profileid;

  const response = await client.query(
    `
      delete from users
      using profiles
      where users.profileId = $1 AND profiles.id = $1
    `,
    [profileId]
  );

  if (!response.rowCount) {
    return RequestError(404, `Fail to delete user profile ${userId}`);
  }

  return res
    .status(201)
    .json({ data: `User profile ${userId} was successfully deleted` });
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  removeUser,
};
