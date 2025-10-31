import React, { useEffect, useState } from "react";

function Maintenance() {
  const targetDate = new Date("2024-11-15").getTime(); // Target date
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);
  return (
    <main className="bg-transparent">
      {/*maintenace countdown section */}
      <section>
        <div className="container w-screen h-screen flex flex-col items-center justify-center text-center">
          {/* heading */}
          <div>
            <h5 className="text-size-28 font-bold mb-15px text-blackColor dark:text-blackColor-dark leading-1.2">
              Sorry, We are
            </h5>
            <h1 className="text-size-40 3xl:text-size-100 font-bold mb-15px text-blackColor dark:text-blackColor-dark leading-1.2">
              Under Maintenance
            </h1>
            <p className="text-contentColor dark:text-contentColor-dark">
              We're currently under maintenance, if all goes as planned we'll be
              back in
            </p>
          </div>
          {/* count down  */}
          <div className="countdown flex gap-5 md:gap-10 items-center mt-50px">
            <div className="w-15 h-15 md:w-70px md:h-70px lg:w-20 lg:h-20 3xl:w-30 3xl:h-30 bg-primaryColor text-whiteColor rounded-lg2 flex flex-col items-center justify-center">
              <p className="count text-size-15 md:text-lg lg:text-xl 3xl:text-size-40 md:mb-10px">
                {timeLeft.days}
              </p>
              <span className="text-sm md:text-xl">Days</span>
            </div>
            <div className="w-15 h-15 md:w-70px md:h-70px lg:w-20 lg:h-20 3xl:w-30 3xl:h-30 bg-primaryColor text-whiteColor rounded-lg2 flex flex-col items-center justify-center">
              <p className="count text-size-15 md:text-lg lg:text-xl 3xl:text-size-40 md:mb-10px">
                {timeLeft.hours}
              </p>
              <span className="text-sm md:text-xl">Hrs</span>
            </div>
            <div className="w-15 h-15 md:w-70px md:h-70px lg:w-20 lg:h-20 3xl:w-30 3xl:h-30 bg-primaryColor text-whiteColor rounded-lg2 flex flex-col items-center justify-center">
              <p className="count text-size-15 md:text-lg lg:text-xl 3xl:text-size-40 md:mb-10px">
                {timeLeft.minutes}
              </p>
              <span className="text-sm md:text-xl">Min</span>
            </div>
            <div className="w-15 h-15 md:w-70px md:h-70px lg:w-20 lg:h-20 3xl:w-30 3xl:h-30 bg-primaryColor text-whiteColor rounded-lg2 flex flex-col items-center justify-center">
              <p className="count text-size-15 md:text-lg lg:text-xl 3xl:text-size-40 md:mb-10px">
                {timeLeft.seconds}
              </p>
              <span className="text-sm md:text-xl">Sec</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Maintenance;
