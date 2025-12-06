import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";
import {
  loginValidate,
  userRegisterValidate,
} from "../validators/userValidate.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.post("/registerValidate", userRegisterValidate, validate, registerUser);
router.post("/login", loginValidate, validate, loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.get("/current-user", getCurrentUser);
export default router;
