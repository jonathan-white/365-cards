const router = require("express").Router();
const cardRoutes = require("./cards");

// api routes
router.use("/cards", cardRoutes);

module.exports = router;
