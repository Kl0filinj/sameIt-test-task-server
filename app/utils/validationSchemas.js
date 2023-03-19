const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "writer", "visitor").required(),
  state: Joi.string().valid("male", "female").required(),
});

module.exports = {
  schema: { registerSchema },
};
