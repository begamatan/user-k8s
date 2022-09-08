const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.user;

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        token: null,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
      expiresIn: 7200, // 2 hours
    });

    res.status(200).send({
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        token,
      },
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "System error, please contact administrator" });
  }
};
