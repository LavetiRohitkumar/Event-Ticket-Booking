const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");

const reserveSeats = async (req, res) => {
  try {
    const { userId, eventId, seatNumbers } = req.body;

    const result = await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: seatNumbers },
        status: "available",
      },
      {
        $set: {
          status: "reserved",
        },
      }
    );

    if (result.modifiedCount !== seatNumbers.length) {
      return res.status(400).json({
        message: "One or more seats are no longer available",
      });
    }

    const reservation = await Reservation.create({
      userId,
      eventId,
      seatNumbers,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    res.status(201).json({
      message: "Seats reserved successfully",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    // Handle expired reservation
    if (reservation.expiresAt < new Date()) {
      await Seat.updateMany(
        {
          eventId: reservation.eventId,
          seatNumber: {
            $in: reservation.seatNumbers,
          },
        },
        {
          $set: {
            status: "available",
          },
        }
      );

      await Reservation.findByIdAndDelete(reservationId);

      return res.status(400).json({
        message: "Reservation expired",
      });
    }

    // Confirm booking
    await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: {
          $in: reservation.seatNumbers,
        },
      },
      {
        $set: {
          status: "booked",
        },
      }
    );

    await Reservation.findByIdAndDelete(reservationId);

    res.json({
      message: "Booking confirmed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  reserveSeats,
  confirmBooking,
};