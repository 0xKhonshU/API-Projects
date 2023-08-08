const User = require('../model/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
    // middleware working here to has password before store in db using .pre in the User model :)
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};


const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('invalid credintails');
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new UnauthenticatedError('invalid credintails');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };