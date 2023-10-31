const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.authSchema), ctrl.register);

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

module.exports = router;
