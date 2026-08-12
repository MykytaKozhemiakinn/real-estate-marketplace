import express from 'express';
import {login} from "../controllers/auth.js";

const router = express.Router();

router.post('/login', (req, res) => login(req, res))

export default router;