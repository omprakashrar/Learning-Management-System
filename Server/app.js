const express = require('express');

const app = express();

// const cors = require(cors());

app.use(express.json());

// app.use(cors({
//     origin: [process.env.FRONTENT_URL],
//     credentials: true, 

// }));
// app.use(cookieParser());

// app.use('/ping', function(req,res){
//     res.send('/pong');

// });

app.all('*', (req, res)=>{
    res.status(404).send('OOPS!! page not found')
});

module.exports = app;