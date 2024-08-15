import { useEffect, useState } from "react";

const useVirtualizerVelocity = ({
  virtualizer,
  estimateSize,
}) => {
  const [lastScrollOffset, setLastScrollOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [normalizedVelocity, setNormalizedVelocity] = useState(0);

  useEffect(() => {
    if (!virtualizer) return;
    const interval = setInterval(() => {
      // Get the current scroll offset
      const currentScrollOffset = virtualizer.scrollOffset;

      // Calculate the difference (velocity)
      const newVelocity = currentScrollOffset - lastScrollOffset;

      // velocity is normalized by the height of the element
      // so the interpretation is how many heights of a page
      // the page is scrolling per 100ms.
      setNormalizedVelocity(newVelocity / estimateSize(0));

      // Update the state with the new values
      setLastScrollOffset(currentScrollOffset);
      setVelocity(newVelocity);
      
    }, 50); // Adjust the interval for more/less frequent checks

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [lastScrollOffset, virtualizer, estimateSize]);

  return { velocity, normalizedVelocity };
};

export default useVirtualizerVelocity;