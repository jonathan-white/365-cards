const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("morgan");
const app = express();
const { db } = require("./config/config");
const routes = require("./routes/api");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

// Morgan logger
app.use(logger("dev"));

// Data parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static Public Middleware
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'app/build')));
}

// Routes Middleware
app.use(routes);

// Connect to the database
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log('Connection to database is active');
});

app.listen(PORT, function() {
  console.log(`Server listening on port http://localhost:${PORT}`);
});