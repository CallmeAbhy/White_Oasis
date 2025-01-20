import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

export const IntroVideo = ({ onSkip, desktopVideo, mobileVideo }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    const preloadVideo = () => {
      const video = new Audio();
      video.src = isMobile ? mobileVideo : desktopVideo;
    };
    preloadVideo();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, mobileVideo, desktopVideo]);

  // Function to handle user interaction and play video with sound
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setHasInteracted(true);
    }
  };

  // Function to handle video loading
  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Loading spinner while video is loading */}
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <video
        ref={videoRef}
        className={`w-full h-screen object-cover ${
          isVideoLoading ? "invisible" : "visible"
        }`}
        autoPlay
        playsInline
        muted // Initially muted to allow autoplay
        onLoadedData={handleVideoLoad}
        onEnded={onSkip}
        src={isMobile ? mobileVideo : desktopVideo}
      />

      {/* Show unmute button if video is muted and hasn't been interacted with */}
      {!hasInteracted && !isVideoLoading && (
        <button
          onClick={handlePlayWithSound}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white/90 hover:bg-white text-black px-6 py-3 rounded-lg 
                     transition-all duration-300 font-semibold shadow-lg z-[10000]"
        >
          Click to Play with Sound
        </button>
      )}

      {/* Skip button - only show when video is loaded */}
      {!isVideoLoading && (
        <button
          onClick={onSkip}
          className="absolute top-8 right-8 bg-white/90 hover:bg-white text-black 
                     px-6 py-3 rounded-lg transition-all duration-300 
                     font-semibold shadow-lg z-[10000]"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
};

IntroVideo.propTypes = {
  onSkip: PropTypes.func.isRequired,
  desktopVideo: PropTypes.string.isRequired,
  mobileVideo: PropTypes.string.isRequired,
};
