

export const useSocialNavigate = () => {

    const handleSocialNavigate = (link) => {
        if (link.startsWith("http://") || link.startsWith("https://")) {
          // Open the link in a new tab
          window.open(link, "_blank");
        } else {
          console.error("Invalid URL format");
        }
      };
      

  return handleSocialNavigate;
};
