import express from 'express';
import multer from 'multer';
import * as post from '../controllers/post.js';
import {authenticate} from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()})

router.post("/upload-image", authenticate, upload.any(), post.uploadImage)
router.delete("/remove-image", authenticate, post.removeImage)
router.post("/create-post", authenticate, post.createPost)
router.get("/post/:slug", authenticate, post.getPost)


export default router;
