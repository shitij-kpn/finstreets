require("dotenv").config();
const { sequelize, Event, User } = require("./models");
const express = require("express");
// const config = require("./config");
const app = express();
const jwt = require("jsonwebtoken");

var http = require("http").createServer(app);
// var io = require('socket.io')(http);
app.use(express.json());

const sendEmail = require("./utils/email");

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

const checkIfUserverified = async (email) => {
  return User.findOne({
    where: {
      email,
      verified: "Yes",
    },
  });
};

const checkIotp = async (email, otp) => {
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
      res.send({ status: "failure", msg: "Email already exist" });
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
    res.send({ status: "failure", message: "email is not registered" });
  } else {
    const checkverified = await checkIfUserverified(email);
    if (!checkverified) {
      return res.send({ status: "failure", msg: "verify is not registered" });
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
  const exists = await checkIotp(email, otp);
  if (!exists) {
    res.send({ status: "failure", msg: "Otp is incorrect" });
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

// //get all course
// app.get("/api/all_courses", async (req, res) => {
//   const allCourses = await Category.findAll({
//     attributes: ["uuid", "category_type", "category_name"],
//     include: [
//       {
//         model: Course,
//         attributes: [
//           "uuid",
//           "course_name",
//           "course_thumb_img",
//           "course_ratings",
//           "course_duration",
//           "course_sale_price",
//           "course_base_price",
//           "category_type",
//         ],
//       },
//     ],
//   });
//   if (allCourses) {
//     return res.json({
//       status: "success",
//       data: allCourses,
//     });
//   }
//   res.json({
//     status: "failure",
//     message: "no data found",
//   });
// });

// //courses from 1 Category
// app.get("/api/category_all_courses", async (req, res) => {
//   const { category_type } = req.query;
//   try {
//     const data = await Category.findOne({
//       attributes: ["uuid", "category_type", "category_name"],
//       include: [
//         {
//           model: Course,
//           attributes: [
//             "uuid",
//             "course_name",
//             "course_thumb_img",
//             "course_ratings",
//             "course_duration",
//             "course_sale_price",
//             "course_base_price",
//             "category_type",
//           ],
//         },
//       ],
//       where: {
//         category_type,
//       },
//     });
//     return res.json({
//       status: "success",
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "failure",
//       message: "no data found",
//     });
//   }
// });

// //single course with FAQ, modules,chapters,teachers,Why_join
// app.get("/api/single_course", async (req, res) => {
//   const { course_uuid } = req.query;
//   try {
//     let courseData = await Course.findOne({
//       where: {
//         uuid: course_uuid,
//       },
//       attributes: [
//         "uuid",
//         "course_name",
//         "course_desc",
//         "course_thumb_img",
//         "course_img",
//         "course_join_img",
//         "course_ratings",
//         "course_duration",
//         "course_sale_price",
//         "course_base_price",
//         "course_video_url",
//         "course_state",
//         "category_type",
//         "ref_id",
//       ],
//       include: [
//         {
//           model: Module,
//           as: "modules",
//           attributes: ["uuid", "module_name", "ref_id"],
//           include: [
//             {
//               model: Chapter,
//               as: "chapters",
//               attributes: ["uuid", "chapter_name", "video_src"],
//             },
//           ],
//         },
//         {
//           model: Faq,
//           as: "faqs",
//           attributes: ["uuid", "question", "answer", "ref_id"],
//         },
//         {
//           model: Teacher,
//           as: "teachers",
//           attributes: ["uuid", "prof_name", "prof_desc", "prof_img"],
//           through: { attributes: [] },
//         },
//         {
//           model: Why_join,
//           as: "why_joins",
//           attributes: ["uuid", "question", "answer", "ref_id"],
//         },
//       ],
//     });
//     if (courseData) {
//       return res.json({
//         status: "success",
//         data: courseData,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "failure",
//       message: "no course found",
//     });
//   }
// });

// const checkIfOrderExists = async (whereObject) => {
//   return order_courses.findOne({
//     where: whereObject,
//   });
// };

// app.get("/api/order_courses", async (req, res) => {
//   const requestData = {
//     phonenumber: req.body.phonenumber,
//     name: req.body.name,
//     address: req.body.address,
//     city: req.body.city,
//     state: req.body.state,
//     pincode: req.body.pincode,
//     referral_id: req.body.referral_id,
//     from_ip: req.body.from_ip,
//     from_browser: req.body.from_browser,
//     amount: req.body.amount,
//     product_id: req.body.product_id,
//     payment_type: req.body.payment_type,
//   };
//   try {
//     //check if already exists
//     const exists = await checkIfOrderExists({
//       phonenumber: requestData.phonenumber,
//       product_id: requestData.product_id,
//     });
//     if (exists) {
//       return res.json({
//         status: "failure",
//         message: "already purchased",
//       });
//     }
//     const result = await order_courses.create(requestData);
//     return res.json({
//       status: "success",
//       data: result,
//     });
//   } catch (error) {
//     console.log(error);
//     res.send("there was an error");
//   }
// });

// app.get("/api/update_order_courses", async (req, res) => {
//   const { uuid, phonenumber, payment_id } = req.body;
//   try {
//     //check if order exists
//     const exists = await checkIfOrderExists({ uuid });
//     if (exists) {
//       exists.status = "Paid";
//       exists.payment_id = payment_id;
//       exists.save();
//       return res.json({
//         status: "success",
//         message: "Payment successful",
//       });
//     }
//     res.send("this id does not exist");
//   } catch (error) {
//     console.log(error);
//     res.send("there was an error check console");
//   }
// });

// app.get("/api/check_order", async (req, res) => {
//   const { uuid, phonenumber } = req.body;
//   try {
//     const exists = await checkIfOrderExists({ uuid });
//     if (exists) {
//       const orderData = exists.toJSON();
//       return res.json({
//         status: orderData.status,
//         data: orderData,
//       });
//     }
//     res.send("no data found");
//   } catch (error) {
//     console.log(error);
//     res.send("there was an error check console");
//   }
// });

http.listen(process.env.PORT, async () => {
  console.log(`server running on port ${process.env.PORT}`);
  await sequelize.authenticate();
  console.log("database connected");
});
