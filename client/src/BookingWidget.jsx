import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  const bookThisPlace = async () => {
    const response = await axios.post('/bookings', {
      checkIn, checkOut, numberOfGuests, name, phone, place: place._id, price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`)
    // booking logic goes here
    // console.log({
    //   checkIn,
    //   checkOut,
    //   numberOfGuests,
    //   name,
    //   phone,
    //   placeId: place._id,
    //   totalPrice: numberOfNights * place.price

  };

  if(redirect) return <Navigate to={redirect}/>

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: R{place.price} per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 border-r">
            <label>Check in:</label>
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
          </div>
          <div className="py-3 px-4">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={e => setNumberOfGuests(e.target.value)}
            min={1}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        )}
      </div>
      <button className="primary mt-4" onClick={bookThisPlace}>
        Book this place {numberOfNights > 0 && (
          <span> – Total: R{numberOfNights * place.price}</span>
        )}
      </button>
    </div>
  );
};

export default BookingWidget;
