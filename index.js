const express = require('express')
const db = require('./models')
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user')

const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api",userRoutes)

db.sequelize.sync().then( () => {
    app.listen(port, () => {
        console.log("DB CONNECTED")
        console.log(`listening at: http://localhost:${port}`)
    });
});