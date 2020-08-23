const mongoose = require("mongoose");

// If deployed, use the deployed database. Otherwise use the local database
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URI || process.env.LOCAL_DB,  
  { 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

module.exports = {
    db: mongoose.connection
}