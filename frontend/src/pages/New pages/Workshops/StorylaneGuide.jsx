import React from "react";
import YouTube from "react-youtube";
import ParagraphText from "src/components/New components/ParagraphText";

const StorylaneGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Sign Up as a Parent Using Google Sign-In",
      description: `Easily register with your Google account and enjoy the multi-user login feature to switch between parent and child profiles.`,
      startSeconds: 0,
      endSeconds: 44,
      // color: "text-yellow-500",
    },
    {
      id: 2,
      title:
        "Explore Our Library Book Collections",
      description: `Browse a variety of engaging books and pick one your child loves to start the storytelling journey.`,
      startSeconds: 45,
      endSeconds: 58,
      // color: "text-purple-500",
    },
    {
      id: 3,
      title: "Use Our Writing and Customization Tools to Create Your Own Story",
      description:`Let your child write freely using interactive tools that spark imagination and creativity.`,
      startSeconds: 59,
      endSeconds: 78,
    },
    {
      id: 4,
      title: "Write in English or Tamil",
      description: `Encourage writing in your preferred language — whether it's English or your local Tamil dialect. You can even use our voice-to-text tool to speak your story and see it magically appear on the screen.`,
      startSeconds: 79,
      endSeconds: 125,
    },
    {
        id: 5,
        title: "Download the Full Story and Share",
        description: `Once the story is complete, download it as a PDF or turn it into a beautifully crafted book to share with friends and family.`,
        startSeconds: 126,
        endSeconds: 138,
      },
      {
        id: 5,
        title: "Reach Milestones and Earn Badges",
        description: `Celebrate progress with achievement badges and keep the motivation going as more stories are completed.`,
        startSeconds: 138,
        endSeconds: 178,
      },
  ];
  const videoId = "8ak1bjwYrG8";

  return (
    <section className="py-12 bg-white px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
      Write, Share, and Shine! Become a Young Author in English or Tamil!
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

export default StorylaneGuide;
