export  default function formatString(input) {
    if (typeof input === "string") {
      const lowercaseString = input.toLowerCase();
      const formattedString =
        lowercaseString.charAt(0).toUpperCase() + lowercaseString.slice(1);
      return formattedString;
    } else {
      return input;
    }
  }