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
            <button onClick={addPhotoByLink} className='bg-gray-200 px-4 rounded-2xl'></button>
        </div>
        </>
    )
}

export default PhotosUploader;