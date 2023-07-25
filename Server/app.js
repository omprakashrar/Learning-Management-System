import express from'express';

const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import {config} from'dotenv';
config();

app.use(express.json());

app.use(cors({
    origin: [process.env.FRONTENT_URL],
    credentials: true, 

}));
app.use(cookieParser());

app.use('/ping', function(req,res){
    res.send('OP!!!!!');

});

app.all('*', (req, res)=>{
    res.status(404).send('OOPS!! page not found')
});

export default app;