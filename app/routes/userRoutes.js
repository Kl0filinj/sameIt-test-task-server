const express = require("express");
const {
  getAllUsers,
  createNewUser,
  removeUser,
} = require("../controllers/userController");
const { asyncWrapper } = require("../middleware/asyncWrapper");

const router = express.Router();

// GET all users
router.get("/", asyncWrapper(getAllUsers));

// ADD new user with profile
router.post("/:userId", asyncWrapper(createNewUser));

// REMOVE user with profile
router.delete("/:userId", asyncWrapper(removeUser));

module.exports = router;
