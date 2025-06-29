import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDates";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch bookings:', err);
    }
  };

  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      await axios.delete(`/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
      alert("Failed to cancel booking. Try again.");
    }
  };

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 ? (
          bookings.map(booking => (
            <div
              key={booking._id}
              className="flex flex-col md:flex-row gap-4 bg-gray-200 rounded-2xl overflow-hidden p-4 mb-4"
            >
              <Link
                to={`/account/bookings/${booking._id}`}
                className="flex flex-col md:flex-row gap-4 grow"
              >
                <div className="md:w-48">
                  {booking.place ? (
                    <PlaceImg place={booking.place} />
                  ) : (
                    <div className="text-red-500 italic">Place info not available</div>
                  )}
                </div>

                <div className="py-3 pr-3 grow">
                  <h2 className="text-xl font-semibold">
                    {booking.place ? booking.place.title : 'Place not found'}
                  </h2>
                  {booking.place && (
                    <BookingDates booking={booking} className="mb-2 mt-2 text-gray-500" />
                  )}
                  <div className="flex gap-1 items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span className="text-lg font-bold">Total: R{booking.price}</span>
                  </div>
                </div>
              </Link>

              <div className="flex justify-end md:items-start">
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition duration-200"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
