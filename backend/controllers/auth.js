import {sendWelcomeEmail} from '../helpers/email.js';
import validator from 'email-validator'
import User from "../models/user.js";
import {encryptPassword, validatePassword} from "../helpers/auth.js";
import {nanoid} from 'nanoid';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const {email, password} = req.body;

    if (!validator.validate(email)) return res.json({error: 'Valid email is required'});
    if (!email?.trim()) return res.json({error: 'Email is required'});
    if (!password?.trim()?.length) return res.json({error: 'Password is required'});
    if (password?.trim()?.length < 8) return res.json({error: 'Password must be at least 8 characters'});

    try {
        const user = await User.findOne({email});
        if (!user) {
            try {
                await sendWelcomeEmail(email);
                const createdUser = await User.create({
                    email, password: await encryptPassword(password), username: nanoid(6)
                });
                const token = jwt.sign({
                    _id: createdUser._id
                }, process.env.JWT_SECRET, {expiresIn: '1h'});
                createdUser.password = undefined;

                res.json({token, user: createdUser});
            } catch (error) {
                console.log(error);
                res.json({error: 'Invalid email. Please use valid email address'});
            }
        } else {
            const match = await validatePassword(password, user.password);
            if (!match) res.json({error: 'Invalid password'});
            else {
                const token = jwt.sign({
                    _id: user._id
                }, process.env.JWT_SECRET, {expiresIn: '1h'});
                user.password = undefined;
                res.json({token, user});
            }
        }
    } catch (error) {
        res.json({error: 'Something went wrong, please try again'});
    }
}