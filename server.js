import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import apiRouter from './routes/api';
import cors from './middlewares/cors';
import httpErrors from './middlewares/http-errors';
import ErrorController from './controllers/error';

const { handleNotFound, handleServerErrors } = new ErrorController();

// Configuring ENV variables
dotenv.config();

const app = express();

// Enabling CORS
app.use(cors);

// Custom HTTP Errors
app.use(httpErrors);

// Body Parsers
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Logger
app.use(morgan('combined'));

// Connecting to database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Database Connected Successfully'); // eslint-disable-line
  })
  .catch((err) => {
    console.log('ERROR : Database Connection Failed', err); // eslint-disable-line
  });

app.use('/api', apiRouter);

// Handling Errors
app.use(handleNotFound);
app.use(handleServerErrors);

// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)); // eslint-disable-line
