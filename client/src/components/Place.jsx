import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingWidget from "../BookingWidget";

const Place = () => {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    useEffect(() => {
        if(!id) return;
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        })
    }, [id]);

    if(!place) return '';

    return(
      <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
          <div>
            <div className="my-4">
                <h2 className="font-semibold text-2xl">Description</h2>{place.description}
            </div>
            Check-in: {place.checkIn}<br/>
            Check-out: {place.checkOut} <br/>
            Max number of guests: {place.maxGuests}
          </div>
          <div>
            <BookingWidget place={place}/>
          </div>
          <div className="bg-white -mx-8 px-8 py-8 border-t">
            <div><h2 className="font-semibold text-2xl">Wxtra infor</h2></div>
            <div className="mb-4 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
          </div>
    </div>
    )
}

export default Place;