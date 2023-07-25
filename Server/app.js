import express from'express';

const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import {config} from'dotenv';
import morgan from 'morgan';
import userRoute from './routes/user.routes.js'
config();

app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTENT_URL],
    credentials: true, 

}));
app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping', function(req,res){
    res.send('OP!!!!!');

});

app.use('/api/v1/user', userRoute)



app.all('*', (req, res)=>{
    res.status(404).send('OOPS!! page not found')
});

export default app;