import {uploadImageToS3, deleteImageFromS3} from "../helpers/upload-image.js";
import {geoCodeAddress} from "../helpers/google.js";

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

export const createPost = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address?.trim()) {
            return res.status(400).json({ error: "Address is required" });
        }

        const { location, googleMap } = await geoCodeAddress(address);
        return res.json({ location, googleMap });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message || "Create post error"
        });
    }
};