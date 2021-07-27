const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register a user
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECREATE_KEY
    ).toString(),
  });

  try {
    const createdUser = await newUser.save();
    res.status(200).json(createdUser);
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

//login a user

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status.json("User not found");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECREATE_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Wrong Password or Username");

    const AccessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECREATE_KEY,
      { expiresIn: "5d" }
    );

    const { password, ...info } = user._doc;
    res.status(200).json({...info,AccessToken});
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
});

module.exports = router;
