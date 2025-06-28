import { useState } from "react";
import { Navigate } from "react-router-dom";
import AccountNav from '../AccountNav';

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
        <div>
            <AccountNav />
            <form>
                {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="title, example: My lovely apt"/>
                {preInput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="address" />
                {preInput('Description', 'description of the place')}
                <textarea value={description} onChange={e => setDscription(e.target.value)} />
                {preInput('Extra info', 'house rules, etc')}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>
                {preInput('Check in&out times', 'add check in and out times, remember to have some time window for cleaning the room between guests')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="14"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check Out time</h3>
                        <input type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="11"/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                    </div>
                </div>
                <button className="primary my-4">Save</button>
            </form>
        </div>
    )
}

export default PlacesForm;