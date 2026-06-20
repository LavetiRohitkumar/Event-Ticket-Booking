import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservationId, setReservationId] = useState("");

  const [expiryTime, setExpiryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    document.title = "Seat Selection";
    fetchEvent();
  }, []);

  useEffect(() => {
    if (!expiryTime) return;

    const timer = setInterval(() => {
      const remaining =
        expiryTime - Date.now();

      if (remaining <= 0) {
        clearInterval(timer);

        setTimeLeft("");
        setExpiryTime(null);
        setReservationId("");

        fetchEvent();

        alert("Reservation expired");
        return;
      }

      const minutes = Math.floor(
        remaining / 60000
      );

      const seconds = Math.floor(
        (remaining % 60000) / 1000
      );

      setTimeLeft(
        `${minutes}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);

      setEvent(res.data.event);
      setSeats(res.data.seats);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== "available") return;

    if (
      selectedSeats.includes(seat.seatNumber)
    ) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) => s !== seat.seatNumber
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat.seatNumber,
      ]);
    }
  };

  const handleReserve = async () => {
    try {
      const res = await API.post(
        "/bookings/reserve",
        {
          userId:
            "6a36a7c908b1b177dffd7bc1",
          eventId: id,
          seatNumbers: selectedSeats,
        }
      );

      setReservationId(
        res.data.reservation._id
      );

      setExpiryTime(
        new Date(
          res.data.reservation.expiresAt
        ).getTime()
      );

      alert(res.data.message);

      fetchEvent();
      setSelectedSeats([]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Reservation Failed"
      );
    }
  };

  const handleBooking = async () => {
    try {
      const res = await API.post(
        "/bookings",
        {
          reservationId,
        }
      );

      alert(res.data.message);

      setReservationId("");
      setTimeLeft("");
      setExpiryTime(null);

      fetchEvent();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Booking Failed"
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>{event?.name}</h2>

      <p>
        <strong>Venue:</strong>{" "}
        {event?.venue}
      </p>

      <div className="mb-4">
        <span className="badge bg-success me-2">
          Available
        </span>

        <span className="badge bg-warning text-dark me-2">
          Reserved
        </span>

        <span className="badge bg-danger me-2">
          Booked
        </span>

        <span className="badge bg-primary">
          Selected
        </span>
      </div>

      <div
        className="d-flex flex-wrap"
        style={{
          maxWidth: "750px",
          gap: "8px",
        }}
      >
        {seats.map((seat) => (
          <div
            key={seat._id}
            onClick={() =>
              handleSeatClick(seat)
            }
            style={{
              width: "60px",
              height: "60px",
              cursor:
                seat.status ===
                "available"
                  ? "pointer"
                  : "not-allowed",
              textAlign: "center",
              lineHeight: "60px",
              color: "white",
              borderRadius: "6px",
              backgroundColor:
                selectedSeats.includes(
                  seat.seatNumber
                )
                  ? "#0d6efd"
                  : seat.status ===
                    "available"
                  ? "#198754"
                  : seat.status ===
                    "reserved"
                  ? "#ffc107"
                  : "#dc3545",
            }}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      <h5 className="mt-4">
        Selected Seats:
        {selectedSeats.length > 0
          ? ` ${selectedSeats.join(", ")}`
          : " None"}
      </h5>

      {reservationId && timeLeft && (
        <h4 className="text-danger mt-3">
          Reservation expires in:
          {" "}
          {timeLeft}
        </h4>
      )}

      <div className="mt-3">
        <button
          className="btn btn-warning"
          onClick={handleReserve}
          disabled={
            selectedSeats.length === 0
          }
        >
          Reserve Seats
        </button>

        {reservationId && (
          <button
            className="btn btn-success ms-3"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>
        )}
      </div>
    </div>
  );
}

export default EventDetails;