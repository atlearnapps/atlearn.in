import React, { useEffect, useState } from "react";

const PromptLibraryModal = ({
  open,
  setPromptOpen,
  setInputMessage,
  PromptLibrary,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    setIsOpen(open);
  }, [open, PromptLibrary]);
  const prompts = PromptLibrary;

  //   const prompts = [
  //     {
  //       heading: "Physics Prompts",
  //       subScection: [
  //         {
  //           subHeading: "Basic",
  //           questions: [
  //             `Explain [Newton's three laws of motion] with [examples from daily life].`,
  //             `Calculate [the velocity of an object] dropped from a height of [20 meters] (assume [no air resistance]).`,
  //             `Describe the differences between [speed, velocity, and acceleration].`,
  //           ],
  //         },
  //         {
  //           subHeading: "Intermediate",
  //           questions: [
  //             `Explain [Newton's three laws of motion] with [examples from daily life].`,
  //             `Calculate [the velocity of an object] dropped from a height of [20 meters] (assume [no air resistance]).`,
  //             `Describe the differences between [speed, velocity, and acceleration].`,
  //           ],
  //         },
  //         {
  //           subHeading: "Advanced",
  //           questions: [
  //             `Derive [Einstein's mass-energy equivalence formula] and explain its [implications in nuclear reactions].`,
  //             `Solve the [Schrödinger equation for a particle in a one-dimensional box] and interpret the [quantization of energy levels].`,
  //             `Analyze the [Doppler effect for sound waves] and calculate the [apparent frequency of a car horn] as the car moves toward an observer at [25 m/s].`,
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       heading: "Chemistry Prompts",
  //       subScection: [
  //         {
  //           subHeading: "Basic",
  //           questions: [
  //             `Write the [electron configuration of oxygen] and explain its [chemical properties] based on its [position in the periodic table].`,
  //             `Balance the chemical equation: [H₂ + O₂ → H₂O].`,
  //             `Define [acids and bases] according to the [Arrhenius and Bronsted-Lowry theories] with [examples].`,
  //           ],
  //         },
  //         {
  //           subHeading: "Intermediate",
  //           questions: [
  //             `Explain the differences between [ionic, covalent, and metallic bonding]. Provide [examples] of each.`,
  //             `Calculate the [molarity of a solution] prepared by dissolving [10 grams of NaCl in 500 mL of water].`,
  //             `Discuss the principles of [Le Chatelier's principle] and predict the [effect of increasing pressure] on the equilibrium of the reaction: [N₂(g) + 3H₂(g) ⇌ 2NH₃(g)].`,
  //           ],
  //         },
  //         {
  //           subHeading: "Advanced",
  //           questions: [
  //             `Derive the [Nernst equation] and apply it to calculate the [cell potential of a galvanic cell] at [non-standard conditions].`,
  //             `Explain the mechanisms of [SN1 and SN2 reactions] and predict the [major product] in a reaction between [2-bromobutane and hydroxide ion].`,
  //             `Analyze the [energy changes in a chemical reaction] using a [reaction coordinate diagram], including [activation energy and transition states].`,
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       heading: "Biology Prompts",
  //       subScection: [
  //         {
  //           subHeading: "Basic",
  //           questions: [
  //             `Draw and label the [structure of a typical animal cell] and describe the [functions of three major organelles].`,
  //             `Explain the process of [photosynthesis] and write the [balanced chemical equation] for it.`,
  //             `Define and give examples of [producers, consumers, and decomposers] in an ecosystem.`,
  //           ],
  //         },
  //         {
  //           subHeading: "Intermediate",
  //           questions: [
  //             `Describe the [structure and function of DNA] and explain how it [replicates during the cell cycle].`,
  //             `Compare and contrast [aerobic and anaerobic respiration]. Include [examples of organisms] that use each type of respiration.`,
  //             `Discuss the process of [natural selection] and how it leads to [evolution of species over time].`,
  //           ],
  //         },
  //         {
  //           subHeading: "Advanced",
  //           questions: [
  //             `Explain the [regulation of gene expression in eukaryotes], including the [role of transcription factors and epigenetic modifications].`,
  //             `Describe the [process of the immune response], focusing on the [roles of B cells and T cells in adaptive immunity].`,
  //             `Analyze the effects of a [specific mutation in the CFTR gene] on [protein function] and how it leads to the [symptoms of cystic fibrosis].`,
  //           ],
  //         },
  //       ],
  //     },
  //   ];

  const handlePromptSelection = (question) => {
    setInputMessage(question);
    setSearchQuery("");
    setPromptOpen(false);
  };

  // Filter prompts based on search query
  const filteredPrompts = prompts?.filter(
    (prompt) =>
      prompt?.heading?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      prompt?.subScection?.some(
        (subSection) =>
          subSection?.subHeading
            ?.toLowerCase()
            ?.includes(searchQuery?.toLowerCase()) ||
          subSection?.questions?.some((question) =>
            question?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          )
      )
  );

  return (
    <div className="">
      {/* <button
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsOpen(true)}
      >
        Open Prompt Library
      </button> */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => {
            setSearchQuery("");
            setPromptOpen(false);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl  w-full max-w-3xl h-[80vh] sm:h-[70vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 shadow-md p-4 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-gray-800">
                  Prompt Library
                </h2>
                <button
                  className="text-gray-500 hover:text-red-500 transition duration-200"
                  onClick={() => {
                    setSearchQuery("");
                    setPromptOpen(false);
                  }}
                >
                  <span className="text-3xl font-bold">&times;</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search for prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mt-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Scrollable Content */}
            <div className="space-y-6 mt-6 p-6">
              {filteredPrompts.map((prompt, index) => (
                <div key={index}>
                  {/* Main Heading */}
                  {prompt?.heading && (
                    <h2 className="text-xl font-bold mb-4 text-blue-600">
                      {`${index + 1}. ${prompt.heading}`}
                    </h2>
                  )}

                  {/* Subsections */}
                  {prompt.subScection.map((subSection, subIndex) => (
                    <div key={subIndex} className="mb-8">
                      {/* Subheading */}
                      {subSection?.subHeading && (
                        <div className="inline-block bg-gray-200 text-gray-800 font-semibold px-4 py-1 rounded-full mb-4">
                          {subSection?.subHeading}
                        </div>
                      )}

                      {/* Questions as Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {subSection.questions.map((question, questionIndex) => (
                          <div
                            key={questionIndex}
                            className=" cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 bg-gray-50"
                            onClick={() => handlePromptSelection(question)}
                          >
                            <h3 className="text-lg font-semibold mb-2">{`Question ${
                              questionIndex + 1
                            }`}</h3>
                            <p className="text-gray-800 text-sm leading-relaxed">
                              {question}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibraryModal;
