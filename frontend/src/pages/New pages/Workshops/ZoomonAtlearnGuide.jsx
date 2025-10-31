import React from "react";
import YouTube from "react-youtube";
import ParagraphText from "src/components/New components/ParagraphText";

const ZoomonAtlearnGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Log in Using Google",
      description: `Access your Atlearn dashboard quickly by logging in with your Google account.`,
      startSeconds: 0,
      endSeconds: 23,
      // color: "text-yellow-500",
    },
    {
      id: 2,
      title:
        "Add a New Meeting and Enter Your Meeting Details",
      description: `Set up your session and choose Zoom as your meeting platform.`,
      startSeconds: 24,
      endSeconds: 37,
      // color: "text-purple-500",
    },
    {
      id: 3,
      title: "Schedule Your Meeting and Set Time Preferences",
      description:`Decide when your session takes place. Add a payment option to monetize your webinar easily.`,
      startSeconds: 38,
      endSeconds: 59,
    },
    {
      id: 4,
      title: "Enjoy Using Our Virtual Meeting Tools",
      description: `Host seamless sessions with interactive features that enhance your teaching experience.`,
      startSeconds: 60,
      endSeconds: 99,
    },
  ];
  const videoId = "huZSby0M5bA";

  return (
    <section className="py-12 bg-white px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
      Teach, Host, & Earn with Zoom on Atlearn -  Here's How!
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

export default ZoomonAtlearnGuide;
