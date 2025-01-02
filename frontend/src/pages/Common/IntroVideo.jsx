import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
export const IntroVideo = ({ onSkip, desktopVideo, mobileVideo }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle user interaction and play video with sound
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setHasInteracted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <video
        ref={videoRef}
        className="w-full h-screen object-cover"
        autoPlay
        playsInline
        muted // Initially muted to allow autoplay
        onEnded={onSkip}
        src={isMobile ? mobileVideo : desktopVideo}
      />

      {/* Show unmute button if video is muted and hasn't been interacted with */}
      {!hasInteracted && (
        <button
          onClick={handlePlayWithSound}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg 
                     transition-all duration-300 font-semibold shadow-lg z-[10000]"
        >
          Click to Play with Sound
        </button>
      )}

      <button
        onClick={onSkip}
        className="absolute top-8 right-8 bg-white/90 hover:bg-white text-black 
                   px-6 py-3 rounded-lg transition-all duration-300 
                   font-semibold shadow-lg z-[10000]"
      >
        Skip Intro
      </button>
    </div>
  );
};
IntroVideo.propTypes = {
  onSkip: PropTypes.func.isRequired,
  desktopVideo: PropTypes.string.isRequired,
  mobileVideo: PropTypes.string.isRequired,
};
