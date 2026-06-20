import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    document.title = "Events";
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        🎟 Event Ticket Booking
      </h1>

      <div className="row">
        {events.map((event) => (
          <div
            key={event._id}
            className="col-md-4 mb-4"
          >
            <div className="card shadow h-100">
              <div className="card-body">
                <h4>{event.name}</h4>

                <p>
                  <strong>Venue:</strong>{" "}
                  {event.venue}
                </p>

                <p>
                  <strong>Total Seats:</strong>{" "}
                  {event.totalSeats}
                </p>

                <Link
                  to={`/events/${event._id}`}
                  className="btn btn-primary w-100"
                >
                  View Seats
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;