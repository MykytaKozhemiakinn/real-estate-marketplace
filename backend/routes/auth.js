import express from 'express';
import {login, forgotPassword, getCurrentUser, updatePassword, updateUsername} from "../controllers/auth.js";
import {authenticate} from "../middlewares/auth.js";

const router = express.Router();


router.post('/login', (req, res) => login(req, res))
router.post('/forgot-password', (req, res) => forgotPassword(req, res))
router.get('/current-user', authenticate, (req, res) => getCurrentUser(req, res))
router.put('/update-password', authenticate, (req, res) => updatePassword(req,res))
router.put('/update-username', authenticate, (req, res) => updateUsername(req,res))

export default router;