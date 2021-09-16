require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const Signer = require('./Signer')

const app = express()
let signer;

try {
    signer = new Signer()
} catch (error) {
    console.log(error);
    process.exit(1);
}

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/sign',(req,res,next)=>{
    const signOptions = req.body.signOptions;
    const document = req.body.document;
    const jsonStr = JSON.stringify(document);

    const signature = signer.signFile(jsonStr,signOptions);
    res.status(200).json({signature});
})

app.listen(4999,()=>{
    console.log('running on port 4999')
});