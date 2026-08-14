import express from 'express';
import {login, forgotPassword} from "../controllers/auth.js";

const router = express.Router();


router.post('/login', (req, res) => login(req, res))
router.post('/forgot-password', (req, res) => forgotPassword(req, res))

export default router;