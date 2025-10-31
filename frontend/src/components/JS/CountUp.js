import React, { useEffect, useRef } from "react";

const CountUp = ({ endValue }) => {
  const elRef = useRef(null);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px 0px", threshold: 0 };
    const element = elRef.current;

    const countDecimals = (val) => {
      if (Math.floor(val) === val) return 0;
      return val.toString().split(".")[1]?.length || 0;
    };

    const formatNumber = (val, decimals) => {
      return val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    };

    const easeOutQuint = (x) => {
      return 1 - Math.pow(1 - x, 5);
    };

    const iterateValue = (el, end, decimals) => {
      const start = 0;
      const duration = 2500;
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsedPercent = (timestamp - startTimestamp) / duration;
        const easedProgress = Math.min(easeOutQuint(elapsedPercent), 1);
        let interimNumber = Math.abs(easedProgress * (end - start) + start);
        el.innerHTML = formatNumber(interimNumber, decimals);
        if (easedProgress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        // Convert endValue to string and then parse it
        const end = parseFloat(endValue.toString().replace(/,/g, ""));
        const decimals = countDecimals(end);
        if (entry.isIntersecting) {
          iterateValue(entry.target, end, decimals);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    if (element) observer.observe(element);

    return () => observer.disconnect(); // Clean up observer on unmount
  }, [endValue]);

  return <span ref={elRef} data-countup-number={endValue}>{endValue}</span>;
};

export default CountUp;