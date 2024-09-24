import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import './HelpTip.css';

type PropTypes = {
  body: string;
  backgroundColor?: string;
  size?: number;
};

export default function HelpTip({
  body,
  backgroundColor = 'rgba(0, 0, 0, 0.4)',
  size = 18,
}: PropTypes) {
  const [showTip, setShowTip] = useState(false);
  const [tipPosition, setTipPosition] = useState({ top: 0, left: 0 });
  const tipRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTipPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    });
    setShowTip(true);
  };

  const handleMouseLeave = () => {
    setShowTip(false);
  };

  return (
    <>
      <div
        className="help-tip"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor,
          width: size,
          height: size,
          lineHeight: `${size}px`, // Ensure text is vertically centered
        }}
      >
        <span>?</span>
      </div>
      {showTip &&
        createPortal(
          <div
            ref={tipRef}
            className="help-tip-body"
            style={{
              top: `${tipPosition.top}px`,
              left: `${tipPosition.left}px`,
            }}
          >
            <div className="help-tip-arrow" />
            <p>{body}</p>
          </div>,
          document.getElementById('modal-layer') as HTMLElement
        )}
    </>
  );
}
