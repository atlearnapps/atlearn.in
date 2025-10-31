import React, { useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/css';

const CardSlider = () => {
  const cardsData = [
    {
      id: 1,
      image: './assets/images/grid/grid_1.png',
      category: 'Data & Tech',
      lessons: '23 Lessons',
      duration: '1 hr 30 min',
      title: 'Foundation course to understand about software',
      price: '$32.00',
      originalPrice: '$67.00',
      author: 'Micle John',
      authorImage: './assets/images/grid/grid_small_1.jpg',
      rating: 5,
    },
    {
      id: 2,
      image: './assets/images/grid/grid_1.png',
      category: 'Data & Tech',
      lessons: '20 Lessons',
      duration: '1 hr 15 min',
      title: 'Advanced data analysis techniques',
      price: '$45.00',
      originalPrice: '$80.00',
      author: 'Jane Doe',
      authorImage: './assets/images/grid/grid_small_1.jpg',
      rating: 4,
    },
    {
        id: 3,
        image: './assets/images/grid/grid_1.png',
        category: 'Data & Tech',
        lessons: '20 Lessons',
        duration: '1 hr 15 min',
        title: 'Advanced data analysis techniques',
        price: '$45.00',
        originalPrice: '$80.00',
        author: 'Jane Doe',
        authorImage: './assets/images/grid/grid_small_1.jpg',
        rating: 4,
      },
      {
        id: 4,
        image: './assets/images/grid/grid_1.png',
        category: 'Data & Tech',
        lessons: '20 Lessons',
        duration: '1 hr 15 min',
        title: 'Advanced data analysis techniques',
        price: '$45.00',
        originalPrice: '$80.00',
        author: 'Jane Doe',
        authorImage: './assets/images/grid/grid_small_1.jpg',
        rating: 4,
      },
      {
        id: 5,
        image: './assets/images/grid/grid_1.png',
        category: 'Data & Tech',
        lessons: '20 Lessons',
        duration: '1 hr 15 min',
        title: 'Advanced data analysis techniques',
        price: '$45.00',
        originalPrice: '$80.00',
        author: 'Jane Doe',
        authorImage: './assets/images/grid/grid_small_1.jpg',
        rating: 4,
      },
      {
        id: 6,
        image: './assets/images/grid/grid_1.png',
        category: 'Data & Tech',
        lessons: '20 Lessons',
        duration: '1 hr 15 min',
        title: 'Advanced data analysis techniques',
        price: '$45.00',
        originalPrice: '$80.00',
        author: 'Jane Doe',
        authorImage: './assets/images/grid/grid_small_1.jpg',
        rating: 4,
      },
    // Add four more card objects as needed
  ];

  useEffect(() => {
    // Initialize Swiper after component mounts
    const swiper = new Swiper('.featured-courses', {
      slidesPerView: 1,
      grabCursor: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1500: {
          slidesPerView: 4,
        },
      },
    });

    return () => {
      if (swiper) {
        swiper.destroy(); // Clean up Swiper instance
      }
    };
  }, []);

  return (
    <div data-aos="fade-up" className="sm:-mx-15px">
    <div className="swiper featured-courses">
      <div className="swiper-wrapper">
        {cardsData.map((card) => (
          <div className="swiper-slide" key={card.id}>
            <div className="relative mb-4">
              <div className="w-full overflow-hidden rounded">
                <img
                  src={card.imgSrc}
                  alt=""
                  className="w-full transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute left-0 top-1 flex justify-between w-full items-center px-2">
                <div>
                  <p className="text-xs text-whiteColor px-4 py-[3px] bg-secondaryColor rounded font-semibold">
                    Data &amp; Tech
                  </p>
                </div>
                <a
                  className="text-white bg-black bg-opacity-15 rounded hover:bg-primaryColor"
                  href="/"
                >
                  <i className="icofont-heart-alt text-base py-1 px-2" />
                </a>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 mb-15px">
                <div className="flex items-center">
                  <div>
                    <i className="icofont-book-alt pr-5px text-primaryColor text-lg" />
                  </div>
                  <div>
                    <span className="text-sm text-black dark:text-blackColor-dark">
                      {card.lessons}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <i className="icofont-clock-time pr-5px text-primaryColor text-lg" />
                  </div>
                  <div>
                    <span className="text-sm text-black dark:text-blackColor-dark">
                      {card.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="text-xl font-semibold text-blackColor mb-10px font-hind dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor"
              >
                {card.title}
              </div>
              <div className="text-lg font-semibold text-primaryColor font-inter mb-4">
                {card.price}
                <del className="text-sm text-lightGrey4 font-semibold">
                  / {card.oldPrice}
                </del>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 pt-15px border-t border-borderColor">
                <div>
                  <div
                    className="text-base font-bold font-hind flex items-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                  >
                    <img
                      className="w-[30px] h-[30px] rounded-full mr-15px"
                      src={card?.authorImg}
                      alt=""
                    />
                    <span className="flex">{card.author}</span>
                  </div>
                </div>
                <div className="text-start md:text-end">
                  {Array.from({ length: card.rating }, (_, index) => (
                    <i key={index} className="icofont-star text-size-15 text-yellow" />
                  ))}
                  <span className="text-xs text-lightGrey6"> (44)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-button-next" />
      <div className="swiper-button-prev" />
      <div className="swiper-pagination" />
    </div>
  </div>
  );
};

export default CardSlider;
