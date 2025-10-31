import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

const Tilt = ({ children }) => {
  const tiltRef = useRef(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        perspective: 2000, // adjust as needed
      });
    }
    // Clean up the tilt effect when the component unmounts
    return () => tiltRef.current && tiltRef.current.vanillaTilt.destroy();
  }, []);

  return (
    <div ref={tiltRef} className="tilt">
      {children}
    </div>
  );
};

export default Tilt;
