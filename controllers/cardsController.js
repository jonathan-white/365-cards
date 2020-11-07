const { Card } = require("../models");

module.exports = {
  findAll: function(req, res) {
    Card
      .find(req.query)
      .sort({ sequence: 1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => {
        console.log(err);
        res.status(422).json(err);
      });
  },
  findCard: function(req, res) {
    Card
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  addCard: function(req, res) {
    Card
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  addManyCards: function(req, res) {
    Card
      .insertMany(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    Card
      .findOneAndUpdate({ _id: req.params.id }, req.body)
			.then(dbModel => 
				Card.findById(dbModel._id)
					.then(dbCard => res.json(dbCard))
					.catch(err => res.status(422).json(err))	
			)
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    Card
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
