import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js';

export const signupSchema = joi.object({
    userName: joi.string().alphanum().min(3).max(20).required().messages({
        'any.required': 'username is required',
        'string.empty': 'username is required'
    }),
    email: generalFeilds.email.required(),
    password: generalFeilds.password,
    cPassword: joi.string().valid(joi.ref('password')).required(),
}).required();

export const token = joi.object({
    token: joi.string().required(),
}).required();

export const loginSchema = joi.object({
    email: generalFeilds.email.required(),
    password: generalFeilds.password,
}).required();

export const sendCode = joi.object({
    email: generalFeilds.email.required(),
}).required();

export const forgetPassword = joi.object({
    code: joi.string().required(),
    email: generalFeilds.email.required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
}).required();
