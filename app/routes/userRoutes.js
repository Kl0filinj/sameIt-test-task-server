const express = require("express");
const {
  getAllUsers,
  createNewUser,
  removeUser,
} = require("../controllers/userController");
const { asyncWrapper } = require("../middleware/asyncWrapper");
const validateBody = require("../middleware/validateBody");
const { schema } = require("../utils/validationSchemas");

const router = express.Router();

// GET all users
router.get("/", asyncWrapper(getAllUsers));

// ADD new user with profile
router.post(
  "/",
  validateBody(schema.registerSchema),
  asyncWrapper(createNewUser)
);

// REMOVE user with profile
router.delete("/:userId", asyncWrapper(removeUser));

module.exports = router;
