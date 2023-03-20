const User = (control) => {
  const attributes = [
    "id",
    "username",
    "email",
    "role",
    "dateCreate",
    "profileId",
  ];
  switch (control) {
    case "insert":
      return attributes
        .filter((item) => item !== "dateCreate")
        .slice(1)
        .join(", ");
    case "select":
      return attributes.map((item) => `users.${item}`).join(", ");
    case "update":
      return attributes.slice(1, -2);
    default:
      return null;
  }
};

const Profile = (control) => {
  const attributes = ["id", "firstName", "lastName", "gender"];
  switch (control) {
    case "insert":
      return attributes.join(", ");
    case "select":
      return attributes
        .slice(1)
        .map((item) => `profiles.${item}`)
        .join(" ,");
    case "update":
      return attributes.slice(1);
    default:
      return null;
  }
};

const calculateAttributesForUpdate = (
  id,
  validAttributes,
  newAttributes,
  tableName
) => {
  let query = `update ${tableName} set `;
  const bindVariables = [id];
  validAttributes.forEach((attr, i, keys) => {
    query += `${attr} = $${i + 2}`;
    bindVariables.push(newAttributes[attr]);
    if (i < keys.length - 1) {
      query += ", ";
    }
  });
  query += ` where ${tableName}.id = $1`;

  return { query, values: bindVariables };
};

module.exports = {
  User,
  Profile,
  calculateAttributesForUpdate,
};
