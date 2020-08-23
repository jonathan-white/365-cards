const db = require("../models");

module.exports = {
  findAll: function(req, res) {
    db.Card
      .find(req.query)
      .sort({ dateAdded: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findCard: function(req, res) {
    db.Card
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  addCard: function(req, res) {
    db.Card
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Card
      .findOneAndUpdate({ _id: req.params.id }, req.body)
			.then(dbModel => 
				db.Card.findById(dbModel._id)
					.then(dbCard => res.json(dbCard))
					.catch(err => res.status(422).json(err))	
			)
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Card
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
