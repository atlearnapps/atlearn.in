import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
// import Token from "../models/token.js";
const InviteNewUser = async (email, name,termsURL,privacyURL) => {
  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      // host: "smtp.gmail.com",
      // port: 587,
      // secure: true, // upgrade later with STARTTLS
      // auth: {
      //   user: "farlanes.akra@gmail.com",
      //   pass: "wmucrtchjzpknfch",
      // },
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.Email_User,
        pass:process.env.Email_Password,
      },
    });

    const termsUrl = termsURL
    ? termsURL
    : `${process.env.CLIENT_URL}/terms-and-conditions`;
  const privacyUrl = privacyURL
    ? privacyURL
    : `${process.env.CLIENT_URL}/privacy-policy`;


    let emailContent, mailOptions;

    emailContent = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>
  
    <style type="text/css">
      @media only screen and (min-width: 670px) {
  .u-row {
    width: 650px !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 650px !important;
  }

}

@media (max-width: 670px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: 100% !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,
td {
  vertical-align: top;
  border-collapse: collapse;
}

p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: inherit !important;
  text-decoration: none !important;
}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
    </style>
  
  

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f2f2f2;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f2f2f2;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f2f2f2;"><![endif]-->
    
  
  
<div class="u-row-container" style="padding: 25px 10px 0px;background-color: rgba(255,255,255,0)">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 25px 10px 0px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      <a target="_blank" href="${process.env.CLIENT_URL}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:14px"><img align="center" border="0" src="https://assets.unlayer.com/projects/266571/1747228561759-Atlearn-WO-Logo.png?w=441.6px" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 234px;" width="234"/></a>
      
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  


  
  
    <!--[if gte mso 9]>
      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 650px;">
        <tr>
          <td background="https://emailmonster-production.s3.amazonaws.com/1503088437109-congruent_outline.png" valign="top" width="100%">
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 650px;">
        <v:fill type="tile" src="https://emailmonster-production.s3.amazonaws.com/1503088437109-congruent_outline.png" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
  
<div class="u-row-container" style="padding: 0px 10px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-image: url('images/image-1.png');background-repeat: repeat;background-position: center top;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 10px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-image: url('images/image-1.png');background-repeat: repeat;background-position: center top;background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color: #ffffff;width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
  <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 20px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      
      <img align="center" border="0" src="https://assets.unlayer.com/projects/0/1721126462962-OBJECTS.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 446px;" width="446"/>
      
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  
    <!--[if gte mso 9]>
      </v:textbox></v:rect>
    </td>
    </tr>
    </table>
    <![endif]-->
    


  
  
<div class="u-row-container" style="padding: 0px 10px;background-color: rgba(255,255,255,0)">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 650px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px 10px;background-color: rgba(255,255,255,0);" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px;"><tr style="background-color: #ffffff;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="650" style="width: 650px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 650px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
  
<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 20px 10px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 150%;"><span style="font-size: 20px; line-height: 30px;">We are excited to inform you that <strong>${name}</strong> has invited you to join Atlearn, a cutting-edge educational platform designed to enhance your learning experience. </span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%;"><span style="font-size: 20px; line-height: 30px;">Atlearn offers the convenience of virtual meetings, allowing you to connect with educators and fellow learners from anywhere. </span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%;"><span style="font-size: 20px; line-height: 30px;">To get started, please follow the link below to activate your account and begin your virtual journey with us.</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 50px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
<div align="center">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:85px; v-text-anchor:middle; width:304px;" arcsize="59%"  stroke="f" fillcolor="#28e0bf"><w:anchorlock/><center style="color:#FFF;"><![endif]-->
    <a href="${process.env.CLIENT_URL}/signup" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFF; background-color: #6D207B; border-radius: 50px;-webkit-border-radius: 50px; -moz-border-radius: 50px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
      <span style="display:block;padding:20px 50px;line-height:150%;"><strong><span style="font-size: 30px; line-height: 45px;">SIGN UP NOW</span></strong></span>
    </a>
    <!--[if mso]></center></v:roundrect><![endif]-->
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style=" font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 50px;font-family:arial,helvetica,sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 150%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 150%;"><span style="font-size: 20px; line-height: 30px;">If you have any questions or need assistance, feel free to reach out to our support team at <span style="color: #3598db; line-height: 21px;">contact@atlearn.in</span>.</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>


<table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color:#001B48 ;mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
    <tr>
     <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
     <p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:white;font-size:12px">Atlearn assistance, streamlines communications, fosters connections, and promotes more effective collaboration in boardrooms, classrooms, operating rooms, and all other environments.</p>
     </td>
    </tr>
    <tr>
     <td align="center" style="padding:0;Margin:0;font-size:0">
      <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
         <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://www.youtube.com/@AkraTechServices/videos" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
         <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.linkedin.com/company/akra-tech-private-limited/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png" alt="In" title="Linkedin" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
        </tr>
      </table></td>
    </tr>
    <tr>
     <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#10002B;font-size:12px"><a target="_blank" href="${privacyUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px">Privacy Policy</a> | <a target="_blank" href="${termsUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px">Terms and Conditions</a></p></td>
    </tr>
  </table>



  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
  </div>
  
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>`;
    mailOptions = {
      from: `"Atlearn" ${process.env.Email_User}`,
      to: email,
      subject: "Invitation to Join Atlearn ",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default InviteNewUser;
