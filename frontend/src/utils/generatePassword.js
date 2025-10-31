// export const generatePassword = () => {
//     const length = 12;
//     const charset =
//       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
//     let generatedPassword = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * charset.length);
//       generatedPassword += charset[randomIndex];
//     }
//     return generatedPassword
//   };


export const generatePassword = () => {
  const length = 12;
  const charSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    // symbols: "!@#$%^&*()_+~"
    symbols: "!@#$%&*_+~"

  };

  const allChars = charSets.lowercase + charSets.uppercase + charSets.numbers + charSets.symbols;
  
  const passwordArray = [
    getRandomChar(charSets.lowercase),
    getRandomChar(charSets.uppercase),
    getRandomChar(charSets.numbers),
    getRandomChar(charSets.symbols)
  ];


  while (passwordArray.length < length) {
    passwordArray.push(getRandomChar(allChars));
  }


  return shuffleArray(passwordArray).join('');
};

const getRandomChar = (charset) =>
  charset[Math.floor(Math.random() * charset.length)];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
