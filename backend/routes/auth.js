import express from 'express';
import {
    login,
    forgotPassword,
    getCurrentUser,
    updatePassword,
    updateUsername,
    updateUser
} from "../controllers/auth.js";
import {authenticate} from "../middlewares/auth.js";

const router = express.Router();


router.post('/login', (req, res) => login(req, res))
router.post('/forgot-password', (req, res) => forgotPassword(req, res))
router.get('/user/current', authenticate, (req, res) => getCurrentUser(req, res))
router.patch('/user/update', authenticate, (req, res) => updateUser(req,res))
router.put('/user/update-password', authenticate, (req, res) => updatePassword(req,res))
router.put('/user/update-username', authenticate, (req, res) => updateUsername(req,res))

export default router;