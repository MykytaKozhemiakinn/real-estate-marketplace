import {uploadImageToS3, deleteImageFromS3} from "../helpers/upload-image.js";
import {geoCodeAddress} from "../helpers/google.js";
import Post from "../models/post.js";
import {nanoid} from "nanoid";
import User from "../models/user.js";
import slugify from "slugify";

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

export const removeImage = async (req, res) => {
    try {
        const {Key, uploadedBy} = req.body;
        console.log(req.user._id, uploadedBy)
        if (req.user._id !== uploadedBy) return res.status(401).json({error: 'Unauthorized'});

        try {
            await deleteImageFromS3(Key);
            return res.json({success: true});
        } catch (error) {
            console.log(error);
            res.json({error: 'Remove image failed'})
        }
    } catch (error) {
        console.log(error);
        res.json({error: 'Remove image failed'})
    }
}

export const createPost = async (req, res) => {
    try {
        const {photos, description, address, propertyType, price, landSize, landType, action} = req.body;
        const isRequired = (field) => {
            res.json({error: `${field} is required`});
        }

        if (!photos || photos?.length === 0) return isRequired("Photos");
        if (!description?.trim()) return isRequired("Description");
        if (!address?.trim()) return isRequired("Address");
        if (!propertyType) return isRequired("Property type");
        if (!price) return isRequired("Price");
        if (!action) return isRequired("Action");
        if (propertyType === 'land') {
            if (!landSize) return isRequired("Land size");
            if (!landType) return isRequired("Land type");
        }

        const {location, googleMap} = await geoCodeAddress(address);
        try {
            const post = await new Post({
                ...req.body,
                slug: slugify(`${propertyType}-for-${action}-address-${address}-price-${price}-${nanoid(6)}`),
                postedBy: req.user._id,
                location: {
                    type: location.type,
                    coordinates: [
                        location.coordinates[1],
                        location.coordinates[0],
                    ]
                },
                googleMap
            });
            await post.save();
            await User.findByIdAndUpdate(req.user._id, {
                $set: {role: 'Seller'}
            });
            res.json(post)
        } catch (error) {
            return res.status(200).json({
                error: error.message || "Error during saving the post"
            });
        }

    } catch (error) {
        return res.status(500).json({
            error: error.message || "Create post error"
        });
    }
};

export const getPost = async (req, res) => {
    try {
        const {slug} = req.params;
        const post = await Post.findOne({slug}).select('-googleMap').populate("postedBy", "name username");
        if (!post) {
            return res.status(404).json({error: "No post found"});
        }
        const related = await Post.aggregate([
            {
                $geoNear: {
                    near: {
                        coordinates: post.location.coordinates,
                    },
                    distanceField: 'dist.calculated',
                    maxDistance: 50000,
                    spherical: true
                },
            },
            {
                $match: {
                    _id: {$ne: post._id},
                    action: post.action,
                    propertyType: post.propertyType,
                },
            },
            {
                $limit: 3
            },
            {
                $project: {
                    googleMap: 0
                },
            }
        ]);
        const relatedWithPopulatedBy = await Post.populate(related, {
            path: 'postedBy',
            select: 'name username'
        });
        res.json({post, related: relatedWithPopulatedBy})
    } catch (error) {
        console.log(error);
        res.json({error: "Error during finding the post"})
    }

};

export const getEstateForSell = async (req, res) => {
    try {
        const page = req.params.page || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const totalAmount = await Post.countDocuments({action: 'Sell'});

        const posts = await Post.find({action: 'Sell'}).populate("postedBy", 'name username').select("-googleMap").sort({createdAt: -1}).skip(skip).limit(pageSize);
        return res.json({posts, page, totalPages: Math.ceil(totalAmount / pageSize)});
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Get posts for sale error"
        });
    }
}

export const getEstateForRent = async (req, res) => {
    try {
        const page = req.params.page || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const totalAmount = await Post.countDocuments({action: 'Rent'});

        const posts = await Post.find({action: 'Rent'}).populate("postedBy", 'name username').select("-googleMap").sort({createdAt: -1}).skip(skip).limit(pageSize);
        return res.json({posts, page, totalPages: Math.ceil(totalAmount / pageSize)});
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Get posts for sale error"
        });
    }
}