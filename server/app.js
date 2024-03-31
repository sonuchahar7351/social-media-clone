const express = require ('express');
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
const cors = require('cors')
const app = express();
const PORT = 2048


mongoose.connection.on("connected",()=>{
    console.log("Connected to Mongo haahahahaa!")
})
mongoose.connection.on("error",(err)=>{
    console.log("error connecting :( ",err);
})

require('./models/user');
require('./models/post')

app.use(cors())
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'))

mongoose.connect(MONGOURI)

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})