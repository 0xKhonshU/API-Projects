const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');
const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = {
        //default values
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message
    };

    if (err.name === 'CastError') {
        customError.name = `Could not find the value of id: ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    if (err.name === 'ValidatorError') {
        customError.msg = Object.keys(err.errors).map((item) => item.message).join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate key value for : ${Object.keys(err.keyValue)}`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;