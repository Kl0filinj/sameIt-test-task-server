const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "writer", "visitor").required(),
  gender: Joi.string().valid("male", "female").required(),
});

const updateUserSchema = Joi.object({
  username: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  role: Joi.string().valid("admin", "writer", "visitor"),
  gender: Joi.string().valid("male", "female"),
});

module.exports = {
  schema: { createUserSchema, updateUserSchema },
};
