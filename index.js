require("dotenv").config();
const {
  sequelize,
  Event,
  User,
  event_info,
  ContactUs,
  event_coupon_code,
} = require("./models");
const express = require("express");
// const config = require("./config");
const app = express();
const jwt = require("jsonwebtoken");

var http = require("http").createServer(app);
app.use(express.json());

const sendEmail = require("./utils/email");

const checkIfUserverified = async (email) => {
  return User.findOne({
    where: {
      email,
      verified: "Yes",
    },
  });
};

const checkotp = async (email, otp) => {
  return User.findOne({
    where: {
      email,
      otp,
    },
  });
};

const checkIfUserExists = async (email) => {
  return User.findOne({
    where: {
      email,
    },
  });
};

// token
const signToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (client, statusCode, res) => {
  const token = signToken(client.email);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);
  const currentUser = await User.findOne({
    where: {
      email: client.email,
    },
  });
  currentUser.token = token;
  currentUser.verified = "Yes";

  await currentUser.save();
  res.status(statusCode).json({
    status: "success",
    token,
    user: currentUser,
  });
};

function getOTP() {
  let otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  return otp;
}

// register
app.get("/api/register", async (req, res) => {
  const { full_name, email } = req.body;
  const verified = "No";
  try {
    const exists = await checkIfUserExists(email);
    if (!exists) {
      const OTP = getOTP();
      const currentUser = await User.create({
        full_name,
        email,
        verified,
        otp: OTP,
      });
      const result = await sendEmail(email, OTP);
      return res.json({ status: "successful", user: currentUser });
    } else {
      if (exists.verified === "No") {
        const OTP = getOTP();
        exists.otp = OTP;
        exists.save();
        const result = await sendEmail(email, OTP);
        return res.send("OTP send to email: " + OTP);
      }
      res.send({ status: "fail", msg: "Email already exist" });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

// resend
app.get("/api/resend", async (req, res) => {
  const { email } = req.body;
  const OTP = getOTP();
  const currentUser = await User.findOne({
    where: {
      email,
    },
  });
  currentUser.otp = OTP;
  currentUser.save();
  await sendEmail(email, OTP);
  return res.json({ status: "successful", message: "OTP sent" });
});

// login
app.get("/api/login", async (req, res) => {
  const { email } = req.body;
  const exists = await checkIfUserExists(email);
  if (!exists) {
    res.send({ status: "fail", message: "email is not registered" });
  } else {
    const checkverified = await checkIfUserverified(email);
    if (!checkverified) {
      return res.send({ status: "fail", msg: "verify is not registered" });
    } else {
      const currentUser = await User.findOne({
        where: {
          email,
        },
      });
      const OTP = getOTP();
      currentUser.otp = OTP;
      currentUser.save();
      await sendEmail(email, OTP);
      console.log(`email sent to `);
      return res.json({ status: "successful", message: "OTP sent " + OTP });
    }
  }
});

// verify
app.get("/api/verify", async (req, res) => {
  const { email, otp } = req.body;
  const exists = await checkotp(email, otp);
  if (!exists) {
    res.send({ status: "fail", msg: "Otp is incorrect" });
  } else {
    exists.otp = null;
    exists.save();
    // console.log(exists.dataValues)
    createSendToken(exists, 200, res);
    // res.send(exists);
  }
});

// logout
app.get("/api/logout", async (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() - 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});

//get all events
app.get("/api/events", async (req, res) => {
  try {
    const results = await Event.findAll();
    if (results) {
      return res.json({
        status: "success",
        data: results,
      });
    } else {
      res.send("there are no results");
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

//all events with info
app.get("/api/event_info", async (req, res) => {
  try {
    const data = await event_info.findAll();
    return res.json({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "fail",
      message: "no data found",
    });
  }
});

// add users to contact us
app.get("/api/contactus", async (req, res) => {
  const { name, email, msg, phone, time, from_ip, from_browser } = req.body;
  try {
    const data = await ContactUs.create({
      name,
      email,
      msg,
      phone,
      time,
      from_ip,
      from_browser,
    });
    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.send("there was an error");
  }
});

http.listen(process.env.PORT, async () => {
  console.log(`server running on port ${process.env.PORT}`);
  await sequelize.authenticate();
  console.log("database connected");
});
