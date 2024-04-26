const Joi = require('joi');

module.exports = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        createdAt: Joi.date().default(Date.now())
    }).required()
});