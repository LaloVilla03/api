const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3002

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const user = require('./routes/users.js');
app.use('/api',user);

app.listen(PORT,()=>console.log(`Corriendo en puerto ${PORT}`));