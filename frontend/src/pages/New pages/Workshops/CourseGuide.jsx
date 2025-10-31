import React from "react";
import YouTube from "react-youtube";
import ParagraphText from "src/components/New components/ParagraphText";

const CourseGuide = () => {
  const steps = [
    {
      id: 1,
      title: "Sign Up with Google to Create an LMS Account.",
      description: `Quickly register using your Google account to get started with your own learning platform.`,
      startSeconds: 0,
      endSeconds: 30,
      // color: "text-yellow-500",
    },
    {
      id: 2,
      title:
        "Create Courses for Free by Going to the Course Settings",
      description: `Add lessons, a glossary, assignments, quizzes, and more. Interact with your students using Atlearn's built-in virtual meeting tools.`,
      startSeconds: 31,
      endSeconds: 79,
      // color: "text-purple-500",
    },
    {
      id: 3,
      title: "Add a Payment Structure to Your Course",
      description:`Set a course fee so students pay when they enroll — a great way to start earning through your expertise.`,
      startSeconds: 80,
      endSeconds: 94,
    },
    {
      id: 4,
      title: "Share Your Courses Easily and Invite Students",
      description: `Promote your course with just a few clicks and bring learners directly to your content.`,
      startSeconds: 95,
      endSeconds: 146,
    },
  ];
  const videoId = "GJl4r7P6so4";

  return (
    <section className="py-12 bg-white px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Launch Your Online Course for Free | Teach & Earn with Atlearn
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

export default CourseGuide;
