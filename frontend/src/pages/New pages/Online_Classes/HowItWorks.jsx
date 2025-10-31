import React from "react";
import YouTube from "react-youtube";
import { BASE_URL } from "src/apiClients/config";
import ParagraphText from "src/components/New components/ParagraphText";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Sign up to start or join online classes.",
      description: `<a href=${BASE_URL} title="Register Atlearn" class="text-blue" target="_blank" rel="noopener noreferrer" >Register</a> quickly to access or participate in online learning sessions.`,
      startSeconds: 9,
      endSeconds: 20,
      // color: "text-yellow-500",
    },
    {
      id: 2,
      title:
        "Create meeting rooms and easily add participants or share the invite link.",
      description: `Set up <a href=https://www.youtube.com/shorts/uh7tKxREpB4 title="virtual classrooms" class="text-blue" target="_blank" rel="noopener noreferrer" >virtual classrooms</a>  effortlessly and invite others with a simple link.`,
      startSeconds: 21,
      endSeconds: 35,
      // color: "text-purple-500",
    },
    {
      id: 3,
      title: "Schedule your meeting rooms in advance for convenience.",
      description: `<a href=https://www.youtube.com/shorts/jU0N4wi8P9k title="Plan and organize" class="text-blue" target="_blank" rel="noopener noreferrer" >Plan and organize</a>  your classes or meetings ahead of time with ease.`,
      startSeconds: 36,
      endSeconds: 49,
    },
    {
      id: 4,
      title: "Explore Webinars and Join Meetings",
      description: `Discover all the <a href=${BASE_URL}/join-meetings title="upcoming webinars" class="text-blue" target="_blank" rel="noopener noreferrer" >upcoming webinars</a>  on our homepage and join the sessions that spark your interest`,
      startSeconds: 50,
      endSeconds: 62,
    },
  ];
  const videoId = "pGXNuJ9zBBg";

  return (
    <section className="py-12 bg-white px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        How to Get Start With Atlearn's Virtual Meetings | Step-by-Step Guide
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12  max-w-6xl mx-auto">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            {/* YouTube Video Section */}
            <div className="w-full">
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    rel: 0,
                    start: step?.startSeconds || 0,
                    end: step?.endSeconds || null,
                  },
                }}
                onReady={(event) => {
                  const player = event.target;
                  player.seekTo(step?.startSeconds || 0, true);
                  // player.pauseVideo();
                  player.playVideo();
                  player.mute();
                }}
                onStateChange={(event) => {
                  const player = event.target;

                  // Pause if the video exceeds the end time
                  if (
                    event.data === 1 &&
                    player.getCurrentTime() >= step?.endSeconds
                  ) {
                    player.pauseVideo();
                  }
                }}
              />
            </div>

            {/* Text Section */}
            <div className="mt-4 flex items-start space-x-4">
              {/* Number */}
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-dashed rounded-full ${step.color} font-bold text-xl`}
              >
                {step.id}
              </div>
              {/* Heading and Description */}
              <div className="text-left">
                <h3 className={`text-xl font-bold ${step.color}`}>
                  {step.title}
                </h3>
                <ParagraphText>{step.description}</ParagraphText>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
