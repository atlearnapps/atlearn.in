
  
  const Dropdown = ({ options, selectedValue, setSelectedValue }) => (
    <select
      className="w-full py-2.5 px-2 bg-whiteColor dark:bg-darkdeep3-dark text-blackColor dark:text-blackColor-dark rounded-md text-sm focus:outline-none"
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      <option value="" disabled>
        Select Option
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  

  export default Dropdown;