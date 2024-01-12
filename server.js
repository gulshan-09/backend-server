require("dotenv").config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const router = require("./routers/router");
const PORT = process.env.PORT || 5002;

require("./db/conn");


app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));


app.use(router);
app.get("/", (req, res) => {
    res.status(200).json("Server Start");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});
