import React, { useState } from 'react';
import './style.css';

const defaultVideo = 'https://www.w3schools.com/html/mov_bbb.mp4';
const clickAnimation = 'https://www.w3schools.com/html/movie.mp4';

export default function App() {
  const [isAnimating, setAnimating] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setAnimating(true);
    }
  };

  const handleEnded = () => {
    setAnimating(false);
  };

  return (
    <div className="container" onClick={handleClick}>
      {isAnimating ? (
        <video src={clickAnimation} autoPlay onEnded={handleEnded} />
      ) : (
        <video src={defaultVideo} autoPlay loop />
      )}
    </div>
  );
}
