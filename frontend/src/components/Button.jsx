const Button = ({ text, onClick, children, style, loading, disabled }) => {
  return (
    <div>
      <button
        disabled={disabled}
        style={style && style}
        onClick={onClick}
        className={`text-white font-fredoka leading-none text-[16px] font-semibold pt-[19px] pr-[40px] pb-[20px] pl-[40px] text-center flex rounded-full bg-secondary transition duration-300 ease-in-out 
    ${
      disabled
        ? "opacity-70 cursor-not-allowed"
        : "hover:bg-primary hover:border-secondary border border-secondary"
    } 
  `}
      >
        {text}
        {children}
        {loading && <div className="spinnerButton"></div>}
      </button>
    </div>
  );
};

export default Button;
