const express = require("express");
const router = express.Router();

const {
  reserveSeats,
  confirmBooking,
} = require("../controllers/bookingController");

router.post("/reserve", reserveSeats);
router.post("/", confirmBooking);

module.exports = router;