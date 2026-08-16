import {uploadImageToS3, deleteImageFromS3} from "../helpers/upload-image.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.files) return res.json({error: "Image is required"})
        const files = Array.isArray(req.files) ? req.files : [req.files];
        res.json(await uploadImageToS3(files, req.user._id))

    } catch (error) {
        console.log(error)
        res.json({
            error: "Upload image failed"
        })
    }
}

export const removeImage = async(req,res) => {
    try {
        const {Key, uploadedBy} = req.body;
        console.log(req.user._id, uploadedBy)
        if(req.user._id !== uploadedBy) return res.status(401).json({error: 'Unauthorized'});

        try{
            await deleteImageFromS3(Key);
            return res.json({success: true});
        }
        catch(error) {
            console.log(error);
            res.json({error: 'Remove image failed'})
        }
    }
    catch (error) {
        console.log(error);
        res.json({error: 'Remove image failed'})
    }
}