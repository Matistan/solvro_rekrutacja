import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(5050, () => {
    console.log('Server is running on http://localhost:5050/');
})

// Can be public, because to connect to the database I need to add your IP address to the whitelist
const MONGO_URI = 'mongodb+srv://matistan05:koralowa@cluster0.9t3mz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI,);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());