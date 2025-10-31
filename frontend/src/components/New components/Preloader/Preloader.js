import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AtlearnIcon from "src/assets/images/Logo/atlearn-favicon.png";
import { setPageLoading } from "src/Redux/loadingSlice";

const Preloader = () => {
  const dispatch = useDispatch();
  const pageLoading = useSelector((state) => state.loading.pageLoading);

  useEffect(() => {

    const timer = setTimeout(() => {
      dispatch(setPageLoading(false)); 
    }, 1000);

    return () => clearTimeout(timer); 
  }, [dispatch,pageLoading]);

  if (!pageLoading) return null; 

  return (
    <div className="preloader flex fixed top-0 left-0 h-screen w-full items-center justify-center z-xxl bg-whiteColor opacity-100 visible transition-all duration-700">
      {/* Spinner */}
      <div className="w-[90px] h-[90px] border-[5px] border-t-blue border-r-blue border-b-blue-light border-l-blue-light rounded-full animate-spin-infinit"></div>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <img src={AtlearnIcon} alt="Preloader" className="h-15 w-15 block" />
      </div>
    </div>
  );
};

export default Preloader;
