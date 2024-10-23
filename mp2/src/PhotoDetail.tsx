import './PhotoDetail.css';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Define the type for the NASA response data
interface NasaResponse {
    title: string;
    url: string;
    explanation: string;
    date: string;
}

interface PhotoDetailProps {
    results: NasaResponse[];
}

// Function to extract YouTube embed URL from the video URL
const getYouTubeEmbedUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else if (urlObj.hostname === 'youtu.be') {
            return `https://www.youtube.com/embed/${urlObj.pathname.split('/').pop()}?autoplay=1`;
        }
    } catch (error) {
        console.error('Invalid URL:', url, error);
    }
    return '';
};

const PhotoDetail: React.FC<PhotoDetailProps> = ({ results }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Convert id to a number safely, handling undefined case
    const photoId = id ? parseInt(id, 10) : -1;

    // Check if the photo exists in the results array
    const photo = results[photoId];

    // If the photo is not found or the id is invalid, return a message
    if (!photo || isNaN(photoId)) {
        return <div>Photo not found</div>;
    }

    // Check if the photo is a YouTube video or an image
    const embedUrl = getYouTubeEmbedUrl(photo.url);

    // Navigation handlers
    const handlePrevious = () => {
        if (photoId > 0) {
            navigate(`/photo/${photoId - 1}`);
        }
    };

    const handleNext = () => {
        if (photoId < results.length - 1) {
            navigate(`/photo/${photoId + 1}`);
        }
    };

    return (
        <div className='container'>
            {/* Previous and Next Buttons */}
            <div className='navigation-buttons'>
                <button
                    onClick={handlePrevious}
                    disabled={photoId === 0}
                    className='prev-button'
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={photoId === results.length - 1}
                    className='next-button'
                >
                    Next
                </button>
            </div>
            <h1 className='title'>{photo.title}</h1>
            <p className='date'>Date: {photo.date}</p>

            {embedUrl ? (
                <iframe
                    width="100%"
                    height="315"
                    src={embedUrl}
                    title={photo.title}
                    allowFullScreen
                ></iframe>
            ) : (
                <img src={photo.url} alt={photo.title} />
            )}

            <p className='description'>{photo.explanation}</p>

            {/* Previous and Next Buttons */}
            <div className='navigation-buttons'>
                <button
                    onClick={handlePrevious}
                    disabled={photoId === 0}
                    className='prev-button'
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={photoId === results.length - 1}
                    className='next-button'
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PhotoDetail;
