import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

const Places = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  const deletePlace = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/places/${id}`);
      alert("Listing deleted!");
      setPlaces(prev => prev.filter(place => place._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing.");
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={'/account/places/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>

      <div className="mt-4 grid gap-4">
        {places.length > 0 &&
          places.map((place) => (
            <div key={place._id} className="bg-gray-100 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
              <Link
                to={'/account/places/' + place._id}
                className="flex flex-1 gap-4 items-center"
              >
                <div className="w-32 h-32 bg-gray-300 flex-shrink-0">
                  <PlaceImg place={place} />
                </div>
                <div>
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2 text-gray-700">{place.description}</p>
                </div>
              </Link>
              <div className="flex justify-end">
                <button
                  onClick={() => deletePlace(place._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md self-start"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Places;
