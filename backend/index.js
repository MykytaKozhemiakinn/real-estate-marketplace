import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

const app = express();

dotenv.config()

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to DB');
        app.use('/api', authRoutes);
        app.use('/api', postRoutes);
        app.listen(8000);
    })
    .catch(console.error);

