const Joi = require('joi');

module.exports = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().required(),
        }),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required()
    }).required()
});