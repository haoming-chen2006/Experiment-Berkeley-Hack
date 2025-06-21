import React, { useState, useEffect, useRef } from 'react';
import './style.css';

import avatarImage from '../koa.png';
import anim1 from '../animations/Make the subject pose (both hands on its waist) and talk ad then resume to irginal mot.mp4';
import anim2 from '../animations/Make the subject pose and move around and talks with white _transparent backgrround.mp4';
import anim3 from '../animations/Make the subject pose and wave both hands slowly with white _transparent backgrround.mp4';
import anim4 from '../animations/Make the subject raise both hands and sway up and down.mp4';
import anim5 from '../animations/Make the subject start from ground and jump to this current positions then lands.mp4';
import anim6 from '../animations/Make the subject talk while maintaining white background.mp4';
import anim7 from '../animations/Make the subject talk while maintaining white_transparent background.mp4';
import anim8 from '../animations/Make the subject wave its hand .mp4';

export default function App() {
  const videos = [
    anim1,
    anim2,
    anim3,
    anim4,
    anim5,
  ];

  const [isAnimating, setAnimating] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(10); // percentage
  const [progress, setProgress] = useState(0);
  const videoIndex = useRef(0);

  const playNextAnimation = () => {
    const next = videos[videoIndex.current % videos.length];
    videoIndex.current = (videoIndex.current + 1) % videos.length;
    setCurrentVideo(next);
    setAnimating(true);
  };

  const handleClick = () => {
    if (isAnimating) {
      setAnimating(false);
    } else {
      playNextAnimation();
      setProgress((p) => {
        const next = p + 10;
        return next > 100 ? 0 : next;
      });
    }
  };

  const handleEnded = () => {
    setAnimating(false);
  };

  useEffect(() => {
    const id = setInterval(() => {
      playNextAnimation();
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const handleSidebarClick = () => {
    setSidebarWidth((w) => (w + 5) % 100);
  };

  return (
    <div className="layout">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="content">
        <div className="main">
          <div className="avatar-container" onClick={handleClick}>
            {isAnimating ? (
              <video src={currentVideo} autoPlay onEnded={handleEnded} />
            ) : (
              <img src={avatarImage} alt="avatar" />
            )}
          </div>
        </div>
        <div
          className="sidebar"
          style={{ width: `${sidebarWidth}%` }}
          onClick={handleSidebarClick}
        >
          Sidebar
        </div>
      </div>
    </div>
  );
}
