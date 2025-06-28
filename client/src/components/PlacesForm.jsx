import { useState } from "react";
import { Navigate } from "react-router-dom";

const PlacesForm = () => {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState('');
    const [description, setDscription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);

    function inputHeader(text){
        return <h2 className="text-2xl mt-4">{text}</h2>
    }

    function inputDescription(text){
        return <p className="text-gray-500 text-sm">{text}</p>
    }

    function preInput(header, description){
        return(
            <>
            {inputHeader(header)}
            {inputDescription(description)}
            </>
        )
    }

    if (redirect) return <Navigate to={'/account/places'}/>
    return(
        <div>PlacesForm</div>
    )
}