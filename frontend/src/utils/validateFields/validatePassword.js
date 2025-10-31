const validationRules = [
    { test: (value) => value.length >= 8, message: "At least 8 characters" },
    {
      test: (value) => /[a-z]/.test(value),
      message: "At least 1 lowercase letter",
    },
    {
      test: (value) => /[A-Z]/.test(value),
      message: "At least 1 uppercase letter",
    },
    { test: (value) => /\d/.test(value), message: "At least 1 number" },
    {
      test: (value) => /[\W_]/.test(value),
      message: "At least 1 special character",
    },
  ];

   export const validatePassword = (value) => {
    return validationRules.map((rule) => ({
      message: rule.message,
      isValid: rule.test(value),
    }));
  };