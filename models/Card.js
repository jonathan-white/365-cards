var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CardSchema = new Schema({
    sequence: String,
    title: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    slogan: String,
    posted: { type: Date },
    dateAdded: { type: Date, default: Date.now }
});

var Card = mongoose.model('Card', CardSchema);

module.exports = Card;
