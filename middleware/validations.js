import { body, validationResult } from "express-validator";

// Registration validation
export const validateSignInOrUp = [
//   body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long"
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


export const validateOTP = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("enteredOtp").notEmpty().isLength({ min: 6, max: 6 }) 
  .withMessage('OTP must be exactly 6 digits long.')
]


// // isLoginned validation (example: checking if user is logged in via a token or session)
// export const validateIsLoginned = [
//   body("token").notEmpty().withMessage("Token is required"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];

// // isLoginned validation (example: checking if user is logged in via a token or session)
// export const validateIsAdmin = [
//     body("userType").notEmpty().equals(
//        "admin"
//       ).withMessage("You are not a valid person"),
//     (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//     },
//   ];

// // isAuthor validation (example: checking if user has author privileges)
// export const validateIsAuthor = [
//   body("role").equals("author").withMessage("User must be an author"),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];

