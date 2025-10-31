import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "src/components/Logo";
import { setUser } from "src/Redux/userSlice";
import { UseAuth } from "src/utils/UseAuth/UseAuth";
import { useSocialNavigate } from "src/utils/Navigation/useSocialNavigate";
import { PopupModal } from "react-calendly";
// import CustomTooltip from "src/components/New components/CustomTooltip/CustomTooltip";
// import ContactUsIcon from "src/assets/images/Contact/contact-us.png";
// import { FiCalendar } from "react-icons/fi";
import AtlearnAILogo from "src/assets/images/Logo/atlearn_ai_wo_logo.webp";
import AtlearnLMSLogo from "src/assets/images/Logo/atlearn_lms_wo_logo.webp";
import AtlearnSchoolLogo from "src/assets/images/Logo/atlearn_school_wo_logo.webp";
import DemoPopup from "./DemoPopup";

function Navbar() {
  const {
    loginWithRedirect,
    logout,
    // user: authUser,
    // isAuthenticated,
    // isLoading,
    // getAccessTokenSilently,
  } = useAuth0();
  const handleSocialNavigate = useSocialNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuData = [
    //------------sample Data -------------------
    // {
    //   title: "Home",
    //   link: "/",
    //   subItems: [
    //     {
    //       title: "Home Light",
    //       link: "/",
    //       subItems: [
    //         { title: "Home (Default)", link: "/" },
    //         { title: "Elegant", link: "/" },
    //       ],
    //     },
    //     {
    //       title: "Home Dark",
    //       link: "/",
    //       subItems: [
    //         { title: "Home Default (Dark)", link: "/" },
    //         { title: "Elegant (Dark)", link: "/" },
    //       ],
    //     },
    //   ],
    // },
    {
      title: "Home",
      link: "/",
    },

    {
      title: "Meetings",
      link: "/meetings",
    },
    {
      title: "Online Tests",
      link: "/online-test",
    },
    // {
    //   title: "Apply As Tutor",
    //   link: "/become-a-tutor",
    // },
    {
      title: "pricing",
      link: "/pricing",
    },
  ];
  const { user } = useSelector((state) => state.user);
  const navRef = useRef(null);
  const [active, setActive] = useState(false);
  const [joinMeetingPath, setJoinMeetingPath] = useState("");
  const auth = UseAuth(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const queryParams = new URLSearchParams(location.search);
  const Room_id = queryParams.get("roomId");
  const Sheduled_id = queryParams.get("scheduleId");

  useEffect(() => {
    const path = location.pathname;
    if (path === "/Join-meeting") {
      setJoinMeetingPath(`?roomId=${Room_id}&scheduleId=${Sheduled_id}`);
    }
  }, [location, Room_id, Sheduled_id]);

  const controllerStyle = (accordionController, isActive) => {
    const rotateAbleLine = accordionController.querySelectorAll("span")[1];

    if (rotateAbleLine) {
      rotateAbleLine.style.transform = !isActive
        ? "rotate(0deg)"
        : "rotate(90deg)";
    }
  };

  const toggleAccordion = (accordion, isActive) => {
    const parentContent = accordion.closest(".accordion-content");
    const content = accordion.querySelector(".accordion-content");
    const contentWrapper = accordion.querySelector(".content-wrapper");
    const contentHeight = contentWrapper ? contentWrapper.offsetHeight : 0;

    if (content) {
      content.style.height = !isActive ? `${contentHeight}px` : "0";

      if (!isActive) {
        setTimeout(() => {
          if (!parentContent) {
            content.style.height = "auto";
          }
        }, 500);
      }
    }
  };

  const accordionController = (accordionContainer) => {
    const groupOfAccordion = Array.from(accordionContainer.children);

    groupOfAccordion.forEach((accordion, idx) => {
      const accordionController = accordion.querySelector(
        ".accordion-controller"
      );
      const isInitiallyActive = accordion.classList.contains("active");

      if (isInitiallyActive) {
        const contents = accordion.querySelector(".accordion-content");
        const contentHeight = contents ? contents.children[0].offsetHeight : 0;
        if (contents && contentHeight) {
          contents.style.height = `${contentHeight}px`;
        }
      }

      if (accordionController) {
        accordionController.addEventListener("click", function () {
          const currentAccordion = this.closest(".accordion");
          const isActive = currentAccordion.classList.contains("active");

          let waitForDblClick = setTimeout(() => {
            groupOfAccordion.forEach((accordion) => {
              const isAccordionController = accordion.querySelector(
                ".accordion-controller"
              );
              if (isAccordionController) {
                accordion.classList.remove("active");
                controllerStyle(isAccordionController, true);
                toggleAccordion(accordion, true);
              }
            });

            if (!isActive) {
              currentAccordion.classList.add("active");
              controllerStyle(accordionController, false);
              toggleAccordion(currentAccordion, false);
            }
          }, 10);

          accordionController.addEventListener("dblclick", function () {
            clearTimeout(waitForDblClick);
          });
        });
      }
    });
  };

  useEffect(() => {
    if (user?.user) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [user]);

  useEffect(() => {
    if (auth.user) {
      dispatch(setUser(auth.user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    const navItems = Array.from(navRef.current.querySelectorAll(".nav-item"));

    const showDropdown = (currentIndex) => {
      navItems.forEach((navItem, idx) => {
        const dropdown = navItem.querySelector(".dropdown");
        if (idx === currentIndex && dropdown) {
          dropdown.style.display = "block";
          setTimeout(() => {
            dropdown.style.opacity = "1";
            dropdown.style.transform = "translate(0)";
          }, 150);
        }
      });
    };

    const hideDropdown = (currentIndex) => {
      navItems.forEach((navItem, idx) => {
        const dropdown = navItem.querySelector(".dropdown");
        if (idx === currentIndex && dropdown) {
          dropdown.style.opacity = "0";
          dropdown.style.transform = "translateY(20px)";
          setTimeout(() => {
            dropdown.style.display = "none";
          }, 150);
        }
      });
    };

    const handleMouseEnter = () => {
      navItems.forEach((navItem, idx) => {
        navItem.addEventListener("mouseenter", () => showDropdown(idx));
      });
    };

    const handleMouseLeave = () => {
      navItems.forEach((navItem, idx) => {
        navItem.addEventListener("mouseleave", () => hideDropdown(idx));
      });
    };

    handleMouseEnter();
    handleMouseLeave();

    // Cleanup function
    return () => {
      navItems.forEach((navItem) => {
        navItem.removeEventListener("mouseenter", showDropdown);
        navItem.removeEventListener("mouseleave", hideDropdown);
      });
    };
  }, []);

  useEffect(() => {
    const mobileMenu = document.querySelector(".mobile-menu");
    const openMobileMenu = document.querySelector(".open-mobile-menu");
    const closeMobileMenuButtons =
      document.querySelectorAll(".close-mobile-menu");

    const handleOpen = () => {
      mobileMenu.style.right = "0";
      closeMobileMenuButtons.forEach((btn) => (btn.style.display = "block"));
    };

    const handleClose = () => {
      const currentScreenSize = window.innerWidth;
      mobileMenu.style.right = currentScreenSize >= 768 ? "-330px" : "-280px";

      setTimeout(() => {
        closeMobileMenuButtons.forEach((btn) => (btn.style.display = "none"));
      }, 500); // Adjust delay to match transition duration
    };

    // Open menu event
    openMobileMenu?.addEventListener("click", handleOpen);

    // Close menu when clicking any close button or menu link
    closeMobileMenuButtons.forEach((btn) => {
      btn.addEventListener("click", handleClose);
    });

    return () => {
      openMobileMenu?.removeEventListener("click", handleOpen);
      closeMobileMenuButtons.forEach((btn) => {
        btn.removeEventListener("click", handleClose);
      });
    };
  }, []);

  useEffect(() => {
    const accordionContainers = document.querySelectorAll(
      ".accordion-container"
    );

    accordionContainers.forEach((accordionContainer) => {
      accordionController(accordionContainer);
    });

    return () => {
      // Cleanup function to remove event listeners if needed
      accordionContainers.forEach((accordionContainer) => {
        const groupOfAccordion = Array.from(accordionContainer.children);
        groupOfAccordion.forEach((accordion) => {
          const accordionController = accordion.querySelector(
            ".accordion-controller"
          );
          if (accordionController) {
            accordionController.removeEventListener(
              "click",
              accordionController.handleClick
            );
          }
        });
      });
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    dispatch(setUser(""));

    logout({
      returnTo: process.env.REACT_APP_LOGOUT_URL || window.location.origin,
    });

    // navigate("/login", { replace: true });
  };

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback${
          joinMeetingPath ? `?roomId=${Room_id}&scheduleId=${Sheduled_id}` : ""
        }`,
      },
      authorizationParams: {
        prompt: "login",
      },
    });
    //  await loginWithRedirect();
  };
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: `/callback${joinMeetingPath ? `?to=${joinMeetingPath}` : ""}`,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <div>
      {/* Header top start */}
      <div className="bg-blackColor2 dark:bg-lightGrey10-dark hidden lg:block">
        <div className="container 3xl:container-secondary-lg 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/918015801639"
                title="Chat with us on WhatsApp for assistance"
                className="flex items-center text-decoration-none "
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-green-500 rounded-full p-0 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                  >
                    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.837.738 5.495 2.031 7.813L0 32l8.305-2.016A15.928 15.928 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.313c-3.18 0-6.155-.97-8.645-2.625L5.312 27.75l1.156-3.656C4.88 21.513 4 18.833 4 16c0-6.63 5.37-12 12-12s12 5.37 12 12-5.37 12-12 12zm6.786-9.373c-.346-.176-2.042-1.01-2.358-1.13-.317-.118-.55-.175-.783.175-.235.352-.9 1.13-1.104 1.36-.204.235-.404.26-.75.088a12.295 12.295 0 01-3.612-2.23c-.665-.59-1.118-1.32-1.25-1.546-.131-.235-.015-.536.198-.712.2-.17.437-.444.656-.666.218-.222.29-.377.437-.63.145-.26.073-.476-.037-.666-.111-.186-.783-1.89-1.073-2.587-.283-.684-.572-.59-.783-.601-.2-.007-.431-.008-.662-.008-.231 0-.6.085-.914.435-.314.352-1.2 1.174-1.2 2.868 0 1.694 1.236 3.332 1.407 3.565.171.235 2.434 3.666 5.91 5.133 3.476 1.467 3.476.982 4.094.918.62-.06 2.042-.833 2.33-1.64.287-.81.287-1.506.2-1.64-.088-.134-.317-.214-.662-.39z" />
                  </svg>
                </div>
                +91 6381250184
              </a>

              <a
                href="mailto:support@atlearn.in"
                title="Email us at support@atlearn.in for support"
                className="flex items-center text-blue-500 hover:text-blue-700 mr-2"
              >
                <div className="flex items-center justify-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                  >
                    <path d="M12 12.713l11.985-8.713H.015L12 12.713zm0 2.574L.015 6v12h23.97V6L12 15.287z" />
                  </svg>
                </div>
                <span className="ml-2">support@atlearn.in</span>
              </a>
            </div>
            <div className="flex  items-center">
              <DemoPopup />
              <button
                className="flex items-center gap-2 text-secondary hover:text-primary cursor-pointer text-size-12 2xl:text-size-15 px-15px py-2 text-whiteColor bg-green-600 block border border-green-600 rounded-standard font-semibold mr-[7px] 2xl:mr-15px "
                onClick={() => setIsOpen(true)}
              >
                {/* <FiCalendar className="text-base 2xl:text-lg" /> */}
                Schedule a Call
              </button>

              <div>
                <ul className="flex gap-[13px] text-[15px]"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopupModal
        url="https://calendly.com/atlearn-lms/atlearn-demo"
        onModalClose={() => setIsOpen(false)}
        open={isOpen}
        rootElement={document.getElementById("root")}
      />
      <div className="transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark ">
        <nav>
          <div className=" px-20   container2-xl mx-auto relative">
            <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
              {/* navbar left */}
              <div className="lg:col-start-1 lg:col-span-2">
                <span
                  onClick={() => navigate("/")}
                  className=" cursor-pointer block mr-2"
                >
                  {location.pathname === "/ai-assistants" ? (
                    <div>
                      <img
                        src={AtlearnAILogo}
                        className="w-60"
                        alt="logo"
                        title="Atlearn logo"
                      />
                    </div>
                  ) : location.pathname === "/lms-ai" ? (
                    <div>
                      <img
                        src={AtlearnLMSLogo}
                        className="w-60"
                        alt="logo"
                        title="Atlearn logo"
                      />
                    </div>
                  ) : location.pathname === "/school-management" ? (
                    <div>
                      <img
                        src={AtlearnSchoolLogo}
                        className="w-60"
                        alt="logo"
                        title="Atlearn logo"
                      />
                    </div>
                  ) : (
                    <Logo />
                  )}
                </span>
              </div>
              {/* Main menu */}
              <div
                ref={navRef}
                className="hidden lg:block lg:col-start-3 lg:col-span-7"
              >
                <ul className="nav-list flex justify-center items-center ml-4 gap-[35px]">
                  <li className="nav-item group relative">
                    <Link
                      to="/"
                      title="Home"
                      className={`px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-secondaryColor  ${
                        isActive("/")
                          ? "text-secondaryColor dark:text-secondaryColor"
                          : "dark:text-whiteColor"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item group relative">
                    <Link
                      to="/courses"
                      title="Courses"
                      className={`whitespace-nowrap px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-secondaryColor  ${
                        isActive("/courses")
                          ? "text-secondaryColor dark:text-secondaryColor"
                          : "dark:text-whiteColor"
                      }`}
                    >
                      Courses
                    </Link>
                  </li>
                  <li className="nav-item group relative">
                    <Link
                      to="/meetings"
                      title="Meetings"
                      className={` whitespace-nowrap  px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-secondaryColor  ${
                        isActive("/meetings")
                          ? "text-secondaryColor dark:text-secondaryColor"
                          : "dark:text-whiteColor"
                      }`}
                    >
                      Meetings
                    </Link>
                  </li>

                  <li className="nav-item group relative">
                    <Link
                      to="/assessments"
                      title="assessments"
                      className={`whitespace-nowrap px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-secondaryColor  ${
                        isActive("/assessments")
                          ? "text-secondaryColor dark:text-secondaryColor"
                          : "dark:text-whiteColor"
                      }`}
                    >
                      Assessments
                    </Link>
                  </li>
                  <li className="nav-item group relative">
                    <Link
                      to="/ai"
                      title="ai"
                      className={`whitespace-nowrap px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-10 lg:py-5 2xl:py-30px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-secondaryColor  ${
                        isActive("/ai")
                          ? "text-secondaryColor dark:text-secondaryColor"
                          : "dark:text-whiteColor"
                      }`}
                    >
                      AI
                    </Link>
                  </li>
                </ul>
              </div>
              {/* navbar right */}
              <div className="lg:col-start-10 lg:col-span-3">
                <ul className="relative nav-list flex justify-end items-center">
                  {active ? (
                    <li className="hidden lg:block relative group">
                      <span className=" cursor-pointer text-size-12 2xl:text-size-15 px-15px py-2 text-blackColor hover:text-whiteColor bg-whiteColor block hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold mr-[7px] 2xl:mr-15px dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor">
                        {/* Profile Image */}
                        {/* <img
                        src="/path/to/profile-image.jpg"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      /> */}
                        <i className="icofont-user-alt-5" />
                      </span>

                      {/* Submenu */}
                      <ul className=" shadow-dropdown absolute right-0 mt-2 max-w-dropdown2 w-2000  bg-white dark:bg-whiteColor-dark rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 dark:bg-whiteColor-dark">
                        <li>
                          <Link
                            to={"/settings/profile"}
                            title="My Profile"
                            className="block px-4 py-2 text-blackColor hover:bg-primaryColor hover:text-whiteColor  dark:text-contentColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor"
                          >
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={"/room"}
                            title="Meetings"
                            className="block px-4 py-2 text-blackColor hover:bg-primaryColor hover:text-whiteColor  dark:text-contentColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor"
                          >
                            Meetings
                          </Link>
                        </li>
                        {user?.user?.role?.name === "Administrator" && (
                          <li>
                            <Link
                              to={"/organization/dashboard"}
                              title="Administrator Panel"
                              className="block px-4 py-2 text-blackColor hover:bg-primaryColor hover:text-whiteColor  dark:text-contentColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor"
                            >
                              Administrator Panel
                            </Link>
                          </li>
                        )}

                        <li>
                          <span
                            onClick={handleLogout}
                            className=" cursor-pointer block px-4 py-2 text-blackColor hover:bg-primaryColor  dark:text-contentColor-dark hover:text-whiteColor dark:hover:bg-primaryColor dark:hover:text-whiteColor"
                          >
                            Logout
                          </span>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <>
                      {/* <li className="hidden lg:block">
                        <Link
                          to={"/become-a-tutor"}
                          title="Apply As Tutor"
                          className=" mr-2 text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
                        >
                          Apply As Tutor
                        </Link>
                      </li> */}
                      <li className="hidden lg:block">
                        {/* <Link
                        to={"/login"}
                        className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
                      >
                        Login
                      </Link> */}

                        <span
                          // onClick={()=>loginWithRedirect()}
                          // onClick={()=>handleLogin()}
                          // onClick={()=>handleSignup()}
                          // onClick={()=>handleOAuthRequest()}
                          onClick={() => handleLogin()}
                          className=" cursor-pointer text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
                        >
                          Login
                        </span>
                      </li>
                    </>
                  )}

                  <li className="block lg:hidden">
                    <button className="open-mobile-menu text-3xl text-darkdeep1 hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor">
                      <i className="icofont-navigation-menu" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <>
        {/* mobile menu */}
        <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
          <button className="close-mobile-menu text-lg bg-darkdeep1 hover:bg-secondaryColor text-white px-[11px] py-[6px] absolute top-0 right-full hidden">
            <i className="icofont icofont-close-line" />
          </button>
          {/* mobile menu wrapper */}
          <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
            {/* mobile menu accordions */}

            <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
              <ul className="accordion-container">
                {menuData?.map((item, index) => (
                  <li key={index} className="accordion close-mobile-menu">
                    {/* accordion header */}
                    <div className="flex items-center justify-between ">
                      <Link
                        title="item?.title"
                        className={`${
                          isActive(item?.link)
                            ? "text-secondaryColor dark:text-secondaryColor"
                            : "dark:text-whiteColor"
                        } leading-1 py-11px text-darkdeep1 font-medium hover:text-secondaryColor  dark:hover:text-secondaryColor`}
                        to={item?.link}
                      >
                        {item?.title}
                      </Link>
                      {item?.subItems && (
                        <button className="accordion-controller px-3 py-4">
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                          <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                        </button>
                      )}
                    </div>
                    {/* accordion content */}
                    {item?.subItems && (
                      <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                        <div className="content-wrapper">
                          <ul className="accordion-container">
                            {item?.subItems?.map((submenu, subindex) => (
                              <li key={subindex} className="accordion">
                                {/* accordion header */}
                                <div className="flex items-center justify-between">
                                  <Link
                                    to={submenu?.link}
                                    title={submenu?.title}
                                    className="leading-1 text-darkdeep1 text-sm pl-15px pt-3 pb-7px font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                  >
                                    {submenu?.title}
                                  </Link>
                                  {submenu?.subItems && (
                                    <button className="accordion-controller px-3 py-4">
                                      <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor" />
                                      <span className="w-[10px] h-[1px] bg-darkdeep1 block dark:bg-whiteColor rotate-90 -mt-[1px] transition-all duration-500" />
                                    </button>
                                  )}
                                </div>
                                {/* accordion content */}
                                <div className="accordion-content h-0 overflow-hidden transition-all duration-500">
                                  <div className="content-wrapper">
                                    {/* Dropdown */}
                                    <ul>
                                      {submenu?.subItems?.map(
                                        (subitemMenu, subItemIndex) => (
                                          <li key={subItemIndex}>
                                            <Link
                                              title={subitemMenu?.title}
                                              to={subitemMenu?.link}
                                              className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-7px font-light hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                            >
                                              {subitemMenu?.title}
                                            </Link>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* my account accordion */}
            <div>
              <ul className="accordion-container mt-9 mb-30px pb-9 border-b border-borderColor dark:border-borderColor-dark">
                <li className="accordion group">
                  {/* accordion header */}
                  <div className="accordion-controller flex items-center justify-between">
                    <span className="leading-1 text-darkdeep1 font-medium group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor">
                      My Account
                    </span>
                    <button className="px-3 py-1">
                      <i className="icofont-thin-down text-size-15 text-darkdeep1 group-hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor" />
                    </button>
                  </div>
                  {/* accordion content */}
                  <div className="accordion-content h-0 overflow-hidden transition-all duration-500 shadow-standard">
                    <div className="content-wrapper">
                      <ul>
                        {active ? (
                          <>
                            <li>
                              <div className="flex items-center justify-between">
                                <Link
                                  to={"/settings/profile"}
                                  title="My Profile"
                                  className="leading-1 text-darkdeep1 text-sm pl-30px pt-4 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                >
                                  My Profile
                                </Link>
                              </div>
                            </li>
                            <li>
                              <div className="flex items-center justify-between">
                                <Link
                                  to={"/room"}
                                  title="My Room"
                                  className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                >
                                  My Room
                                </Link>
                              </div>
                            </li>

                            {user?.user?.role?.name === "Administrator" && (
                              <li>
                                <div className="flex items-center justify-between">
                                  <Link
                                    to={"/organization/dashboard"}
                                    title="Administrator Panel"
                                    className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                  >
                                    Administrator Panel
                                  </Link>
                                </div>
                              </li>
                            )}
                            <li>
                              <div className="flex items-center gap-1">
                                <span
                                  onClick={handleLogout}
                                  className="leading-1 text-darkdeep1 text-sm pl-30px pt-3 pb-3 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                                >
                                  Logout
                                </span>
                              </div>
                            </li>
                          </>
                        ) : (
                          <li>
                            <div className="flex items-center gap-1">
                              <span
                                onClick={() => handleLogin()}
                                className="leading-1 text-darkdeep1 text-sm pl-30px pt-7 pb-7 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                Login
                              </span>
                              <span
                                onClick={() => handleSignUp()}
                                className="leading-1 text-darkdeep1 text-sm pr-30px pt-7 pb-7 font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor"
                              >
                                <span>/</span> Create Account
                              </span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            {/* Mobile menu social area */}
            <div>
              {/* <ul className="flex gap-6 items-center mb-5">
                <li>
                  <span
                    className="facebook cursor-pointer"
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.facebook.com/Atlearn.in"
                      )
                    }
                  >
                    <i className=" icofont icofont-facebook text-fb-color dark:text-whiteColor dark:hover:text-secondaryColor" />
                  </span>
                </li>
                <li>
                  <span
                    className="linkedin cursor-pointer"
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.linkedin.com/company/atlearn"
                      )
                    }
                  >
                    <i className="icofont icofont-linkedin dark:text-whiteColor dark:hover:text-secondaryColor" />
                  </span>
                </li>

                <li>
                  <span
                    className="pinterest cursor-pointer"
                    onClick={() =>
                      handleSocialNavigate(
                        "https://in.pinterest.com/atlearnlms/"
                      )
                    }
                  >
                    <i className="icofont icofont-pinterest dark:text-whiteColor dark:hover:text-secondaryColor" />
                  </span>
                </li>
                <li>
                  <span
                    className="instagram cursor-pointer "
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.instagram.com/atlearn_in/"
                      )
                    }
                  >
                    <i className="icofont icofont-instagram dark:text-whiteColor dark:hover:text-secondaryColor" />
                  </span>
                </li>
                <li>
                  <span
                    className="google cursor-pointer"
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.youtube.com/@Atlearn_In/featured"
                      )
                    }
                  >
                    <i className="icofont icofont-youtube-play dark:text-whiteColor dark:hover:text-secondaryColor" />
                  </span>
                </li>
              </ul> */}
              <ul className="flex gap-3 lg:gap-2 2xl:gap-3 mb-10px">
                <li>
                  <span
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.facebook.com/Atlearn.in"
                      )
                    }
                    className=" cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#3b5998] hover:bg-[#2d4373] text-center rounded-full transition"
                  >
                    <i className="icofont-facebook" />
                  </span>
                </li>

                <li>
                  <span
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.linkedin.com/company/atlearn"
                      )
                    }
                    className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#0077b5] hover:bg-[#005582] text-center rounded-full transition"
                  >
                    <i className="icofont-linkedin" />
                  </span>
                </li>

                <li>
                  <span
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.instagram.com/atlearn_in/"
                      )
                    }
                    className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-center rounded-full transition"
                  >
                    <i className="icofont-instagram" />
                  </span>
                </li>

                <li>
                  <span
                    onClick={() =>
                      handleSocialNavigate(
                        "https://www.youtube.com/@Atlearn_In/featured"
                      )
                    }
                    className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#FF0000] hover:bg-[#cc0000] text-center rounded-full transition"
                  >
                    <i className="icofont-youtube-play" />
                  </span>
                </li>

                <li>
                  <span
                    onClick={() =>
                      handleSocialNavigate(
                        "https://in.pinterest.com/atlearnlms/"
                      )
                    }
                    className="cursor-pointer w-[40.19px] lg:w-[35px] 2xl:w-[40.19px] h-[37px] lg:h-[35px] 2xl:h-[37px] flex items-center justify-center text-whiteColor bg-[#E60023] hover:bg-[#b7001c] text-center rounded-full transition"
                  >
                    <i className="icofont-pinterest" />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Navbar;
