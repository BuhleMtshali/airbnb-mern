import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    const payload = {
      place: property._id, // 🔥 IMPORTANT: this should be the actual MongoDB _id from the backend
      checkIn: '2025-08-10',  // Replace with real input or selection
      checkOut: '2025-08-15', // Replace with real input or selection
      numberOfGuests: 2,      // Replace with user input
      name: 'Zano Mtshali',   // Can fetch from user profile or input field
      phone: '0123456789',    // Same here
      price: property.price * 5, // Or however you calculate total
    };

    try {
      const response = await axios.post('http://localhost:4000/bookings', payload, {
        withCredentials: true, // 🔐 important for sending cookies (JWT)
      });

      console.log('✅ Booking successful:', response.data);
      alert('Booking successful!');
      navigate('/account/bookings'); // Redirect user to their bookings
    } catch (error) {
      console.error('❌ Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{property.title}</h2>
      <p>{property.location}</p>
      <p>R{property.price} / night</p>
      <button
        onClick={handleBooking}
        className="mt-4 bg-primary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition"
      >
        Book Now
      </button>
    </div>
  );
};


