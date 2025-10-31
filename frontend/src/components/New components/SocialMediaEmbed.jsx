import React from "react";
import { InstagramEmbed, LinkedInEmbed } from "react-social-media-embed";
function SocialMediaEmbed({ platform, url }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {platform === "instagram" && (
        //   <InstagramEmbed url={url} width="100%" />
        <div className="w-full max-w-sm rounded-xl overflow-hidden ">
          <InstagramEmbed url={url} width="100%" />
          {/* <LinkedInEmbed 
    url="https://www.linkedin.com/embed/feed/update/urn:li:share:7354122950964334593"
    postUrl="https://www.linkedin.com/posts/atlearn_edtech-aiineducation-onlinelearning-activity-7354122952054894592-quSd"

  /> */}
        </div>
      )}
    </div>
  );
}

export default SocialMediaEmbed;
