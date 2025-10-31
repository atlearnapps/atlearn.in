import apiClients from "src/apiClients/apiClients";

const siteSetting = async () => {
    const data = {
      name: ["RegistrationMethod",],
    };
  
    const result = {}; // Object to store names and values
  
    try {
      const response = await apiClients.getSiteSettings(data);
      if (response.data) {
        response.data.forEach((item) => {
          switch (item.setting.name) {
            case "RegistrationMethod":
              result.registration = item.value;
              // setTermId(item.id);
              break;
            // case "PrivacyPolicy":
            //   result.privacyPolicy = item.value;
            //   // setPrivacyId(item.id);
            //   break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  
    return result; // Return the object with names and values
  };
  export default siteSetting;  