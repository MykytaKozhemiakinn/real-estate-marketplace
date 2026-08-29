import mongoose from 'mongoose';

const {Schema, ObjectId, model} = mongoose;

const postSchema = new Schema({
    photos: {
        type: [{}]
    },
    price: {
        type: String,
        maxLength: 255,
        index: true
    },
    address: {
        type: String,
        maxLength: 255,
        index: true,
    },
    propertyType: {
        type: String,
        enum: ['House', 'Apartment', 'Townhouse', 'Land'],
        default: 'House',
    },
    bedrooms: Number,
    bathRooms: Number,
    landSize: Number,
    landSizeType: String,
    carPark: Number,
    location: {
       type : {
           type: String,
           enum: ['Point'],
           default: 'Point',
       },
        coordinates: {
            type: [Number, Number],
        },
        googleMap: {},
    },
    title: {
        type: String,
        maxLength: 255
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {},
    features: {},
    nearBy: {},
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    published: {
        type: Boolean,
        default: true
    },
    action: {
        type: String,
        enum: ['Sell', 'Rent'],
        default: 'Rent'
    },
    status: {
        type: String,
        enum: ['in_market', 'off_market', 'deposit_taken', 'sold', 'rented'],
        default: 'in_market'
    },
}, {timestamps: true});

postSchema.index({location: '2dsphere'});

export default model("Post", postSchema);