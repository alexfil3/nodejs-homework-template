const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      if (Object.keys(req.body).length === 0) {
        next(HttpError(400, "missing fields"));
      }
      const fieldName = error.details[0].path[0];
      next(HttpError(400, `missing required ${fieldName} field`));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
