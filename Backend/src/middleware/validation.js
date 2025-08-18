// const Joi = require('joi');
import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().max(100),
    bio: Joi.string().max(500),
    address: Joi.string().max(200).allow(null),
    mobile: Joi.string().pattern(/^\d{10}$/).allow(null).messages({
      'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    aadhar: Joi.string().pattern(/^\d{12}$/).allow(null).messages({
      'string.pattern.base': 'Aadhar number must be 12 digits'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  updateProfile: Joi.object({
    fullName: Joi.string().max(100).allow(null),
    bio: Joi.string().max(500).allow(null),
    avatar: Joi.string().uri().allow(null),
    address: Joi.string().max(200).allow(null),
    mobile: Joi.string().pattern(/^\d{10}$/).allow(null).messages({
      'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    aadhar: Joi.string().pattern(/^\d{12}$/).allow(null).messages({
      'string.pattern.base': 'Aadhar number must be 12 digits'
    })
  }),

  blog: Joi.object({
    title: Joi.string().max(200).required(),
    content: Joi.string().required(),
    summary: Joi.string().max(500),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string(),
    status: Joi.string().valid('draft', 'published'),
    featuredImage: Joi.string().uri()
  }),

  comment: Joi.object({
    content: Joi.string().max(1000).required(),
    blogId: Joi.string().hex().length(24).required()
  }),

  reply: Joi.object({
    content: Joi.string().max(1000).required()
  }),
  updateComment: Joi.object({
    content: Joi.string().max(1000).required()
  }),
  share: Joi.object({
    platform: Joi.string().valid('facebook', 'twitter', 'linkedin', 'whatsapp', 'email').required()
  })
};
