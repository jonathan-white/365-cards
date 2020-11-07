const router = require("express").Router();
const cardsController = require("../../controllers/cardsController");

// Matches with "/api/cards/add"
router.route("/add")
  .post(cardsController.addCard);

// Matches with "/api/cards/add-multiple"
router.route("/add-multiple")
  .post(cardsController.addManyCards);

// Matches with "/api/cards/view"
router.route("/view")
  .get(cardsController.findAll)

// Matches with "/api/cards/:id"
router.route("/:id")
  .get(cardsController.findCard)
  .put(cardsController.update)

// Matches with "/api/cards/remove/:id"
router.route("/remove/:id")
  .delete(cardsController.remove);

module.exports = router;