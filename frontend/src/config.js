const config = {
    get rootPublicUrl() {
        return process.env.PUBLIC_URL || window.location.origin;
    },
    
    get baseApiUrl() {
      const DEV_URL = 'http://localhost:7000';
      return process.env.REACT_APP_OVERRIDE_HOST || DEV_URL;
    },
} 

export default config;