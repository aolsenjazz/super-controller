import React, { useState, useEffect, useCallback } from 'react';

export default function useDimensions(
  myRef: React.MutableRefObject<any> // eslint-disable-line
): {
  width: number;
  height: number;
} {
  const getDimensions = useCallback(() => {
    return {
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    };
  }, [myRef]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getDimensions, myRef]);

  return dimensions;
}
