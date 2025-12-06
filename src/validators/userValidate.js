import { checkSchema } from "express-validator";

export const userRegisterValidate = checkSchema({
  username: {
    trim: true,
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must be at least 3 characters",
    },
    // lowercase will happen automatically because your model has lowercase: true
  },

  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
  },

  fullName: {
    optional: true,
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Full name must be at least 3 characters",
    },
  },

  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
  },

  avatar: {
    optional: true,
    isObject: {
      errorMessage: "Avatar must be an object",
    },
  },

  "avatar.url": {
    optional: true,
    isURL: {
      errorMessage: "Avatar URL must be a valid URL",
    },
  },

  "avatar.localPath": {
    optional: true,
    isString: {
      errorMessage: "Local path must be a string",
    },
  },
});

export const loginValidate = checkSchema({
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "email should not be empty",
    },
    isEmail: {
      errorMessage: "Email Format is incorrect",
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Password Shouldn't be Empty",
    },
  },
});
