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
    <div className="layout">
      <div className="progress-bar">
        <div className="progress" />
      </div>
      <div className="content">
        <div className="sidebar">Sidebar</div>
        <div className="main">
          <div className="avatar-container" onClick={handleClick}>
            {isAnimating ? (
              <video src={clickAnimation} autoPlay onEnded={handleEnded} />
            ) : (
              <video src={defaultVideo} autoPlay loop />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
