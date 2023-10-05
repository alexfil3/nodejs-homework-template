const express = require("express");

const ctrl = require("../../controllers/books");

const { validateBody } = require("../../middlewares");

const schemas = require("../../schemas/books");

const router = express.Router();

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.add);

router.delete("/:contactId", ctrl.deleteById);

router.put("/:contactId", ctrl.updateById);

module.exports = router;
