const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

exports.index = async (req, res) => {
  const conditions = {};
  if (req.user.role != "Admin") {
    conditions._id = req.user._id;
  }
  const users = await User.find(conditions);

  return res.status(200).send({
    data: users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      };
    }),
  });
};

exports.show = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // send unauthorized for non admin user when accessing other user's detail
  if (user.id != req.user.id && req.user.role != "Admin") {
    return res
      .status(401)
      .send({ message: "You are unauthorized to access this resource" });
  }

  res.status(200).send({
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    },
  });
};

exports.store = async (req, res) => {
  // validate required field
  const rules = ["name", "username", "password"];
  const validateRequest = validate(rules, req.body);
  if (Object.keys(validateRequest).length) {
    return res.status(400).send({
      message: "Validation failed",
      data: validateRequest,
    });
  }

  const { name, username, password, role } = req.body;
  const userIsExist = await User.findOne({ username });
  if (userIsExist) {
    return res.status(403).send({
      message: `User ${username} already exists`,
    });
  }

  const user = new User({
    name,
    username,
    password: bcrypt.hashSync(password, 8),
    role: role ? role : "User",
  });

  try {
    await user.save();
    return res.status(201).send({
      message: "User is created successfully",
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "System error. Please contact administrator",
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, username, password, role } = req.body;

  if (!name && !username && !password && !role) {
    return res.status(400).send({
      message: "Please provide at least one field to update",
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  // return validation if username is already taken by other user
  const validateUsername = await User.findOne({
    username: username ?? user.username,
  });
  if (validateUsername && validateUsername.id != user.id) {
    return res.status(403).send({
      message: `User ${username} already exists`,
    });
  }

  user.name = name ?? user.name;
  user.username = username ?? user.username;
  user.password = password ? bcrypt.hashSync(password, 8) : user.password;
  user.role = role ?? user.role;

  try {
    await user.save();
    return res.status(200).send({
      message: `User ${user.name} is updated successfully`,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "System error. Please contact administrator.",
    });
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  try {
    await user.delete();
    return res.status(200).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "System error. Please contact administrator.",
    });
  }
};

// validate request field
const validate = (fields, requestBody) => {
  const messages = {};
  fields.forEach((field) => {
    if (!requestBody[field]) {
      messages[field] = `${field} is required`;
    }
  });

  return messages;
};
