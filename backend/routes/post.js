import express from 'express';
import multer from 'multer';
import * as post from '../controllers/post.js';
import {authenticate} from "../middlewares/auth.js";
import {getEstateForSell, getEstateForRent, removePost, getUserPosts, updatePost} from "../controllers/post.js";

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()})

router.post("/upload-image", authenticate, upload.any(), post.uploadImage)
router.delete("/remove-image", authenticate, post.removeImage)

router.post("/post/create", authenticate, post.createPost)
router.get("/post/user-posts/:id/:page", post.getUserPosts);
router.get("/post/:id", post.getPost)
router.get("/post/estate-for-sell/:page", post.getEstateForSell)
router.get("/post/estate-for-rent/:page", post.getEstateForRent)
router.patch("/post/update/:id", authenticate,  post.updatePost)
router.delete("/post/remove/:id", authenticate, post.removePost)


export default router;
