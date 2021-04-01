import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import { config as configureEnvVariables } from 'dotenv';
import apiRouter from './routes/api';
import httpErrors from './middlewares/http-errors';
import ErrorController from './controllers/error';

const { handleNotFound, handleServerErrors } = new ErrorController();

// Configuring ENV variables
configureEnvVariables();

const app = express();

// Body Parsers
app.use(express.json());

// Logger
app.use(morgan('combined'));

// Custom HTTP Errors
app.use(httpErrors);

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
apiRouter.use(handleServerErrors);

// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port : ${PORT}`)); // eslint-disable-line
