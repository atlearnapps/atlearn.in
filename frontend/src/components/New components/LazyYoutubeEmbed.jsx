import { useState } from "react";

const LazyYoutubeEmbed = ({ videoId }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative w-full aspect-video rounded-lg bg-white border-2 border-secondaryColor shadow-dropdown-secodary">
      {!isIframeLoaded ? (
        <button
          className="w-full h-full flex items-center justify-center relative group"
          onClick={() => setIsIframeLoaded(true)}
        >
          <img
            src={thumbnailUrl}
            alt="YouTube video thumbnail"
            title="YouTube video thumbnail"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition">
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 84 84"
            >
              <circle cx="42" cy="42" r="42" fill="currentColor" opacity="0.8" />
              <polygon points="33,24 60,42 33,60" fill="black" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};
export default LazyYoutubeEmbed;