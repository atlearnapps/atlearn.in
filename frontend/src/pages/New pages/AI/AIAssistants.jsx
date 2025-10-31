import React from 'react'
import { Helmet } from 'react-helmet'
import { BASE_URL } from 'src/apiClients/config'
import ChatAssistants from './ChatAssistants'

function AIAssistants() {
  return (
    <div>
      <Helmet>
        <title>AI-Integrated LMS for Smart Learning Experiences</title>
        <meta
          name="description"
          content="Discover artificial intelligence in LMS with Atlearn's AI-based LMS. Enhance learning with an advanced AI-integrated LMS for students and educators."
        />
        <link rel="canonical" href={`${BASE_URL}/ai`} />
      </Helmet>
              <section>
          {/* bannaer section */}
          <div className="container2-xl bg-darkdeep1 py-50px  rounded-2xl relative overflow-hidden shadow-brand">
            <div className="container">
              <div className="flex flex-col items-center text-center w-full ">
                {/* banner Left */}
                <div data-aos="fade-up" className="w-4/5">
                  <h3 className="uppercase text-secondaryColor text-size-15 mb-5px md:mb-15px font-inter tracking-5px">
                    Smart Education
                  </h3>
                  <h1 className="text-3xl text-whiteColor md:text-6xl lg:text-size-50 2xl:text-6xl leading-10 md:leading-18 lg:leading-62px 2xl:leading-18 md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold ">
                    AI-Powered Learning Assistants
                    <span className="text-secondaryColor">.</span>
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <img
                className="absolute left-1/2 bottom-[15%] animate-spin-slow"
                src="./assets/images/register/register__2.png"
              alt="register icon"
              title="register icon"
              />
              <img
                className="absolute left-[42%] sm:left-[65%] md:left-[42%] lg:left-[5%] top-[4%] sm:top-[1%] md:top-[4%] lg:top-[10%] animate-move-hor"
                src="./assets/images/herobanner/herobanner__6.png"
              alt="herobanner icon"
              title="herobanner icon"
              />
              <img
                className="absolute right-[5%] bottom-[15%]"
                src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
              />
              <img
                className="absolute top-[5%] left-[45%]"
                src="./assets/images/herobanner/herobanner__7.png"
              alt="herobanner icon"
              title="herobanner icon"
              />
            </div>
          </div>
        </section>
        <section>
          <ChatAssistants/>
        </section>
    </div>
  )
}

export default AIAssistants
