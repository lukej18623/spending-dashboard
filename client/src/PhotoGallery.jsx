import React from 'react';

const PhotoGallery = ({ images = [] }) => {
  // Placeholder images if none provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    'https://images.unsplash.com/photo-1534943441045-1ad8c5e6f0de?w=400'
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="photo-gallery">
      <h3>Recent Trips</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {displayImages.map((img, idx) => (
          <img 
            key={idx}
            src={img}
            alt={`Trip ${idx + 1}`}
            style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;