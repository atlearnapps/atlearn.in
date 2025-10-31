import React from "react";

function PrimaryButton({
  children,
  primary,
  onClick,
  disabled,
  loading,
  style,
}) {
  return primary ? (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={`${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } flex items-center justify-center  text-center text-sm md:text-size-15 text-whiteColor bg-primaryColor dark:bg-primaryColor border border-primaryColor px-25px py-15px hover:text-primaryColor hover:bg-whiteColor rounded inline-block mr-6px md:mr-30px dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor`}
    >
      {children}
      {loading && <div className="spinnerButton"></div>}
    </button>
  ) : (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={`${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      } flex items-center justify-center text-sm md:text-size-15 text-whiteColor bg-secondaryColor border border-secondaryColor px-25px py-15px hover:text-secondaryColor hover:bg-whiteColor rounded inline-block dark:hover:bg-whiteColor-dark dark:hover:text-secondaryColor`}
    >
      {children}
      {loading && <div className="spinnerButton"></div>}
    </button>
  );
}

export default PrimaryButton;
