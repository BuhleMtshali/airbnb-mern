import axios from 'axios';
import { useState } from 'react';

const PhotosUploader = ({ addedPhotos, onChange }) => {
    const [photoLink, setPhotoLink] = useState('');
    async function addPhotoByLink(e) {
        e.preventDefault();
        const { data: filename } = await axios.post('/uplad-by-link', {link: photoLink});
        onChange(prev => {
            return[...prev, filename];
        });
        setPhotoLink('');
    }

    return(
        <>
        <div className="flex gap-2">
            <input type="text" value={photoLink} onChange={e => setPhotoLink(e.target.value)} placeholder={'Add using a link ...jpg'}/>
            <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'>Add&nbsp;photo</button>
        </div>
        <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {
                addedPhotos.length > 0 && addedPhotos.map(link => (
                    <div className="h-32 flex relative" key={link}>
                        <Image className="rounded-2xl w-full object-cover" src={link} alt=""/>
                        <button onClick={ev => removePhoto(ev, link)} className='curser-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))
            }
        </div>
        </>
    )
}

export default PhotosUploader;