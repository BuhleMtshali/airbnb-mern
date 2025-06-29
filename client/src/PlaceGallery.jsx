import { useState } from "react";
import Image from "./Image";

const PlaceGallery = ({ place }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen">
        <div className="bg-black p-8 grid gap-4">
          <div>
            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.5 12c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12zm8.47-2.53a.75.75 0 10-1.06-1.06L9.19 11.13a.75.75 0 000 1.06l2.72 2.72a.75.75 0 101.06-1.06L10.81 12l2.16-2.53z"
                  clipRule="evenodd"
                />
              </svg>
              Close photos
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index}>
                <Image src={photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {place.photos?.[0] && (
            <div>
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square cursor-pointer object-cover"
                src={place.photos[0]}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="grid">
          {place.photos?.[1] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="aspect-square cursor-pointer object-cover"
              src={place.photos[1]}
              alt=""
            />
          )}
          {place.photos?.[2] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="aspect-square cursor-pointer object-cover relative top-2"
              src={place.photos[2]}
              alt=""
            />
          )}
        </div>
      </div>
      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.5 12c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12zm8.47-2.53a.75.75 0 10-1.06-1.06L9.19 11.13a.75.75 0 000 1.06l2.72 2.72a.75.75 0 101.06-1.06L10.81 12l2.16-2.53z"
            clipRule="evenodd"
          />
        </svg>
        Show more photos
      </button>
    </div>
  );
};

export default PlaceGallery;
