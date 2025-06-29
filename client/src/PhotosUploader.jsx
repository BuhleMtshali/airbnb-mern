import axios from 'axios';
import { useState } from 'react';
import ImageComponent from './Image';

const PhotosUploader = ({ addedPhotos, onChange }) => {
  const [photoLink, setPhotoLink] = useState('');

  async function addPhotoByLink(e) {
    e.preventDefault();
    if (!photoLink.trim()) {
      alert('Please enter an image URL first!');
      return;
    }
    try {
      const { data: filename } = await axios.post('/upload-by-link', { link: photoLink });
      onChange(prev => [...prev, filename]);
      setPhotoLink('');
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Failed to upload image. Check the link and try again.');
    }
  }

  function uploadPhoto(e) {
    const files = e.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    axios
      .post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        const { data: filenames } = response;
        onChange(prev => [...prev, ...filenames]);
      })
      .catch(err => {
        console.error('❌ Upload failed:', err);
        alert('Photo upload failed. Try again.');
      });
  }

  function removePhoto(e, filename) {
    e.preventDefault();
    onChange([...addedPhotos.filter(photo => photo !== filename)]);
  }

  function selectAsMainPhoto(e, link) {
    e.preventDefault();
    onChange([filename, ...addedPhotos.filter(photo => photo !== filename)])
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={e => setPhotoLink(e.target.value)}
          placeholder="Add using a link ...jpg"
        />
        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">
          Add&nbsp;photo
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {addedPhotos.length > 0 &&
          addedPhotos.map(link => (
            <div className="h-32 flex relative" key={link}>
              <ImageComponent
                className="rounded-2xl w-full object-cover"
                src={link}
                alt="Uploaded"
              />
              {/* Remove button */}
              <button
                onClick={e => removePhoto(e, link)}
                className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                title="Remove photo"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Make Main Photo button */}
              <button
                onClick={e => selectAsMainPhoto(e, link)}
                className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3"
                title="Set as main photo"
              >
                {link === addedPhotos[0] ? (
                  // MAIN photo icon (check)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  // Not main icon (empty check)
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}

        {/* Upload from device */}
        <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600 hover:bg-gray-100 transition">
          <input type="file" multiple className="hidden" onChange={uploadPhoto} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;
