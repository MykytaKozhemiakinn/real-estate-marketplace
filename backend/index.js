import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from "mongoose";

const app = express();

dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to DB')
}).catch(console.error);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(8000);