// require('dotenv').config();
const inquirer = require('inquirer')
const express = require('express')
const bodyParser = require('body-parser')
const Signer = require('./Signer')

let __SCARDPIN__;

const app = express()
let signer;


app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/sign',(req,res,next)=>{
    const pin = req.headers.authorization;
    if(pin !== __SCARDPIN__) res.status(403).json({message : "unauthorized"})
    // const signOptions = req.body.signOptions;
    const document = req.body.document;
    const jsonStr = JSON.stringify(document);

    const signature = signer.signFile(jsonStr/*,signOptions*/);
    res.status(200).json({signature});
})

inquirer
  .prompt([
    {
      type: 'password',
      message: 'Enter the smart card PIN',
      name: 'PIN',
      mask: '*',
    }
  ])
  .then((answer) => {
    __SCARDPIN__ = answer.PIN;

    try {
        signer = new Signer(__SCARDPIN__)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    app.listen(4999,()=>{
        console.log('running on port 4999')
    });
  });
