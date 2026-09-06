import Post from "../models/post.js";

export const incrementViewCounter = async (postId) => {
    try {
        await Post.findByIdAndUpdate(postId, {$inc: {views: 1}})
    }
    catch(error) {
        console.log(error)
    }
}