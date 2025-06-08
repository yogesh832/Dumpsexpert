const Joi = require("joi");

//signup logic for entering details
const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,}$/)
    .required()
    .messages({
        'string.pattern.base': 'Password must start with an uppercase letter, be at least 5 characters long, and include letters, numbers, and symbols.',
    }),
});

//signin logic for entering details
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must start with an uppercase letter, be at least 5 characters long, and include letters, numbers, and symbols.',
    }),
});

exports.validateSignup = (req,res,next) => {
    const {error} = signupSchema.validate(req.body);
    if(error) return res.status(400).json({error: error.details[0].message});
    next();
};

exports.validateSignin = (req,res,next) => {
    const {error} = signinSchema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message});
    next();
};


const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must start with an uppercase letter, be at least 5 characters long, and include letters, numbers, and symbols.",
    }),
});

exports.validateResetPassword = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};