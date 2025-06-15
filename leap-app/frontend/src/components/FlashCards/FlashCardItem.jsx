// src/components/FlashCards/FlashCardItem.js
import React, { useState, useRef } from 'react';

function FlashCardItem({ card, index, isActive }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX - startX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Reset position
    setCurrentX(0);
  };

  const cardStyles = {
    transform: isDragging ? `translateX(${currentX}px) rotate(${currentX * 0.05}deg)` : 'translateX(0)',
    opacity: isActive ? 1 : 0,
    position: isActive ? 'relative' : 'absolute',
    zIndex: isActive ? 10 : 1,
    display: isActive ? 'block' : 'none',
    transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
  };

  return (
    <div 
      className="flash-card"
      ref={cardRef}
      style={cardStyles}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="card-content">
        <h3>{card.title || 'Key Point'}</h3>
        <p>{card.content}</p>
      </div>
    </div>
  );
}

export default FlashCardItem;