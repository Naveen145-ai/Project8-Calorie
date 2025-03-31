import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial render
    checkSize();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkSize);
    
    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkSize);
  }, []);
  
  return isMobile;
}