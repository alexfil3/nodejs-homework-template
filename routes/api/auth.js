const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.authSchema), ctrl.register);

// verify
router.get("/verify/:verificationToken", ctrl.verifyEmail);

// resend verify
router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);

// signin
router.post("/login", validateBody(schemas.authSchema), ctrl.login);

// logout
router.post("/logout", authenticate, ctrl.logout);

// current
router.get("/current", authenticate, ctrl.getCurrent);

// update subscription
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrl.updateSubscription
);

// update avatar
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
