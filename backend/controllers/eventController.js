const Event = require("../models/Event");
const Seat = require("../models/Seat");

const createEvent = async (req, res) => {
  try {
    const { name, dateTime, venue, totalSeats } = req.body;

    const event = await Event.create({
      name,
      dateTime,
      venue,
      totalSeats,
    });

    const seats = [];

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        eventId: event._id,
        seatNumber: `A${i}`,
        status: "available",
      });
    }

    await Seat.insertMany(seats);

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    const seats = await Seat.find({
      eventId: req.params.id,
    });

    res.json({
      event,
      seats,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
};