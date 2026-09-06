import {sendWelcomeEmail} from '../helpers/email.js';
import validator from 'email-validator'
import User from "../models/user.js";
import {encryptPassword, validatePassword} from "../helpers/auth.js";
import {nanoid} from 'nanoid';
import jwt from 'jsonwebtoken';
import {sendTemporaryPasswordEmail} from "../helpers/email.js";
import Post from "../models/post.js";

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

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    let user = await User.findOne({email});

    try {
        if (!user) return res.json({error: 'If you are already registered user, you will reset temporary password shortly'});
        else {
            const password = nanoid(12);
            user.password = await encryptPassword(password);
            await user.save();
            try {
                await sendTemporaryPasswordEmail(email, password);
                return res.json({message: 'Password sent to your mailbox successfully'});
            } catch (error) {
                return res.json({error: 'Error while trying to send temporary password'});
            }
        }
    } catch (error) {
        return res.json({error: 'Something went wrong, please try again'});
    }
}

export const updatePassword = async(req, res) => {
    try {
        let {password} = req.body;
        password = password?.trim() ?? '';

        if(!password) return res.json({error: 'Password is required'})
        if(password?.length < 8) return res.json({error: 'Password length should be at least 8 characters long'})

        const hashedPassword = await encryptPassword(password);
        await User.findByIdAndUpdate(req.user._id, {password: hashedPassword});
        res.json({ok: true})
    }
    catch (error) {
        res.json({error})
    }
}

export const updateUser = async (req, res) => {
    try {
        const {_id} = req.user;
        const user = await User.findOne({_id})

        if (!user) return res.status(404).json({error: "User not found"});
        if (user._id.toString() !== _id.toString()) return res.status(401).json({error: 'Unauthorized'});

        const {name, phone, company, address, about} = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (company !== undefined) updates.company = company;
        if (address !== undefined) updates.address = address;
        if (about !== undefined) updates.about = about;

        const updatedUser = await User.findByIdAndUpdate(_id,
            {$set: updates},
            {new: true, runValidators: true}
        ).select('-password');
        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Error updating user"
        });
    }
}

export const updateUsername = async(req, res) => {
  try {
      const {username} = req.body;
      const trimmedUsername = username?.trim();

      if(!trimmedUsername) return res.json({error: "Username is required"});
      const existingUser = await User.findOne({username: trimmedUsername});
      if(existingUser) return res.json({error: "Username is already taken. Try different one"});

      const updatedUser = await User.findByIdAndUpdate(req.user._id, {username: trimmedUsername}, {new: true});
      updatedUser.password = undefined;
      res.json(updatedUser)
  } catch(error) {
      res.json({
          error
      })
  }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.json({error: 'No user with this id'});
        user.password = undefined;
        res.json({user});
    } catch (error) {
        res.json({error})
    }
}