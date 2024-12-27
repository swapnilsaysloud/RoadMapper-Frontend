import React, { useState, useEffect, useRef } from 'react';

const Runner = ({ gifUrl }) => {
  const [position, setPosition] = useState(-100);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const RunnerRef = useRef(null);


      // So the free tier shuts down the server after 20 minutes of inactivity, so adding this to keep the server alive
  
      const url = "https://roadmapper-backend-1.onrender.com"; // Replace with your Render URL
      const interval = 60000; // Interval in milliseconds (30 seconds)
  
      function reloadWebsite() {
        axios.get(url)
          .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
          })
          .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
          });
      }
  
  
      setInterval(reloadWebsite, interval);

    
  useEffect(() => {
    let animationFrameId;
    let screenWidth = window.innerWidth;

    const updateScreenWidth = () => {
      screenWidth = window.innerWidth;
    };

    const AnimateRunner = () => {
      setPosition((prevPosition) => {
        let newPosition = prevPosition + 5; 
        if (newPosition > screenWidth) {
          newPosition = -100; // Reset to start position
        }
        return newPosition;
      });
      animationFrameId = requestAnimationFrame(AnimateRunner);
    };

    if (imageLoaded) {
      animationFrameId = requestAnimationFrame(AnimateRunner);
    }
    
    window.addEventListener('resize', updateScreenWidth);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, [imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setError(null);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setError('Failed to load the GIF. Please check the URL.');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px', 
        overflow: 'hidden',
        zIndex: 1000,
        pointerEvents: 'none', 
      }}
    >
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <img 
          ref={RunnerRef}
          src={gifUrl}
          alt="Runner running"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            height: '100%',
            position: 'absolute',
            left: `${position}px`,
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      )}
      {!imageLoaded && !error && <div>Loading...</div>}
    </div>
  );
};

export default Runner;