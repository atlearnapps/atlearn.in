import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Token from "../models/token.js";
const sendEmail = async (user, mailtype,roomid,termsURL,privacyURL) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.Email_User,
        pass:process.env.Email_Password,
      },
    });
    const encryptedToken = bcrypt
      .hashSync(user.id.toString(), 10)
      .replaceAll("/", "");

    const token = await Token.create({
      user_id: user.id,
      token: encryptedToken,
    });
    let url = `${process.env.EMAIL_VERIFY_URL}/${encryptedToken}/verifyEmail`;
    if (roomid) {
      url += `?roomId=${roomid}`;
    }


    const termsUrl = termsURL
    ? termsURL
    : `${process.env.CLIENT_URL}/terms-and-conditions`;
  const privacyUrl = privacyURL
    ? privacyURL
    : `${process.env.CLIENT_URL}/privacy-policy`;

    let emailContent, mailOptions;

    if (mailtype === "verifyemail") {
      emailContent = `<!DOCTYPE html>
            <html>
            
            <head>
                <title></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <style type="text/css">
                    @media screen {
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 400;
                            src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: normal;
                            font-weight: 700;
                            src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 400;
                            src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                        }
            
                        @font-face {
                            font-family: 'Lato';
                            font-style: italic;
                            font-weight: 700;
                            src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                        }
                    }
            
                    /* CLIENT-SPECIFIC STYLES */
                    body,
                    table,
                    td,
                    a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
            
                    /* RESET STYLES */
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
            
                    table {
                        border-collapse: collapse !important;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
            
                    /* iOS BLUE LINKS */
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* MOBILE STYLES */
                    @media screen and (max-width:600px) {
                        h1 {
                            font-size: 32px !important;
                            line-height: 32px !important;
                        }
                    }
            
                    /* ANDROID CENTER FIX */
                    div[style*="margin: 16px 0;"] {
                        margin: 0 !important;
                    }
                </style>
            </head>
            
            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                <!-- HIDDEN PREHEADER TEXT -->
                <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account.
                </div>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- LOGO -->
                    <tr>
                        <td  align="center">
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                          <tr>
                           <td align="center" style="padding:0;Margin:0">
                            <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                              <tr>
                               <td align="left" style="padding:20px;Margin:0">
                                <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                   <td align="left" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tr>
                                       <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="${process.env.CLIENT_URL}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:14px"><img class="adapt-img" src="https://assets.unlayer.com/projects/266571/1747228561759-Atlearn-WO-Logo.png?w=441.6px" alt="Logo" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none" height="50" title="Logo"></a></td>
                                      </tr>
                                    </table></td>
                                  </tr>
                                </table></td>
                              </tr>
                            </table></td>
                          </tr>
                        </table>
                  </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="top" style=" border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;">Thank you for signing up with Atlearn! To ensure the security of your account and activate your subscription, please verify your email address by clicking the link below.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                    <table border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 3px;" bgcolor="#0C56AC"><a href=${url} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0C56AC; display: inline-block;">Confirm Account</a></td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr> <!-- COPY -->
                          
                                <tr>
                                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                    <p style="margin: 0;">If you have not registered on Atlearn, please ignore this email. <br>For any assistance or if you did not initiate this request, please contact our support team at <a href="mailto:support@atlearn.in" style=" text-decoration: none;">support@atlearn.in</a>.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                        <p style="margin: 0;">Cheers,<br>Atlearn Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                <tr>
                    <td align="center" style="padding:0;Margin:0">
                        <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#001B48;width:600px;">
                          <tr>
                           <td align="left" style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:30px;padding-left:20px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                               <td align="left" style="padding:0;Margin:0;width:560px">
                                <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                   <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                   <p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color: #ffffff;font-size:12px">Atlearn assistance, streamlines communications, fosters connections, and promotes more effective collaboration in boardrooms, classrooms, operating rooms, and all other environments.</p>
                                   </td>
                                  </tr>
                                  <tr>
                                   <td align="center" style="padding:0;Margin:0;font-size:0">
                                    <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tr>
                                       <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://www.youtube.com/@Atlearn_In" style="mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
                                       <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.linkedin.com/company/atlearn/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png" alt="In" title="Linkedin" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
                                      </tr>
                                    </table></td>
                                  </tr>
                                  <tr>
                                   <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><a target="_blank" href="${privacyUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color: #ffffff;font-size:12px">Privacy Policy</a> | <a target="_blank" href="${termsUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color: #ffffff;font-size:12px">Terms and Conditions</a></p></td>
                                  </tr>
                                </table>
                              </td>
                              </tr>
                            </table>
                        </td>
                          </tr>
                        </table></td>
                </tr>
                 
                </table>
            </body>
            
            </html> `;
      mailOptions = {
        from: `"Atlearn" ${process.env.Email_User}`,
        to: user.email,
        subject: "Verify Your Email Address for atlearn Account",
        html: emailContent,
      };
    } else if (mailtype === "forgetpassword") {
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
              @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
          .u-row .u-col {
            vertical-align: top;
          }
        
          .u-row .u-col-50 {
            width: 300px !important;
          }
        
          .u-row .u-col-100 {
            width: 600px !important;
          }
        
        }
        
        @media (max-width: 620px) {
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
        
        table, td { color: #000000; } #u_body a { color: #161a39; text-decoration: underline; }
            </style>
          
          
        
        <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
        
        </head>
        
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
            
          
          
        <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #f9f9f9;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #f9f9f9;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;" align="left">
                
          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <span>&#160;</span>
                </td>
              </tr>
            </tbody>
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
          
          <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
             <td align="center" style="padding:0;Margin:0">
              <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px">
                <tr>
                 <td align="left" style="padding:20px;Margin:0">
                  <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                    <tr>
                     <td align="left" style="padding:0;Margin:0;width:560px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                         <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank" href="${process.env.CLIENT_URL}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:14px"><img class="adapt-img" src="https://assets.unlayer.com/projects/233521/1716007910322-imgpsh_fullsize_anim.png" alt="Logo" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none" height="50" title="Logo"></a></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table></td>
            </tr>
          </table>

        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #161a39;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;" align="left">
                
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right: 0px;padding-left: 0px;" align="center">
              
              <!-- <img align="center" border="0" src="images/image-2.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;" width="58"/> -->
              <!-- <img align="center" border="0" style="background-color :transparent;" src="http://localhost:8000/Images/forgottpassword.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;" width="58"/> -->
              
            </td>
          </tr>
        </table>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;" align="left">
                
          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 28px; line-height: 39.2px; color: #000000; font-family: Lato, sans-serif;">Please reset your password </span></p>
          </div>
        
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
          
        
        
          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
              
        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
          <div style="height: 100%;width: 100% !important;">
          <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
          
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;" align="left">
                
          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Hello,</span></p>
        <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">We have sent you this email in response to your request to reset your password on company name.</span></p>
        <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
        <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">To reset your password, please follow the link below: </span></p>
          </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;" align="left">
                
          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
        <div align="left">
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:51px; v-text-anchor:middle; width:205px;" arcsize="2%"  stroke="f" fillcolor="#18163a"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
            <a href="${process.env.EMAIL_VERIFY_URL}/${encryptedToken}/resetPassword" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #0C56AC; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
              <span style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 18px; line-height: 21.6px;">Reset Password</span></span>
            </a>
            <!--[if mso]></center></v:roundrect><![endif]-->
        </div>
        
              </td>
            </tr>
          </tbody>
        </table>
        
        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;" align="left">
                
          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"><span style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span style="font-size: 16px; line-height: 22.4px;">Please ignore this email if you did not request a password change.</span></em></span><br /><span style="color: #888888; font-size: 14px; line-height: 19.6px;"><em><span style="font-size: 16px; line-height: 22.4px;">&nbsp;</span></em></span></p>
          </div>
        
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
          
        
        
          
          
        <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                <tr>
                 <td align="center" style="padding:0;Margin:0">
                  <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#fec624;width:600px">
                    <tr>
                     <td align="left" style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:30px;padding-left:20px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                         <td align="left" style="padding:0;Margin:0;width:560px">
                          <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr>
                             <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                             <p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#10002B;font-size:12px">Atlearn assistance, streamlines communications, fosters connections, and promotes more effective collaboration in boardrooms, classrooms, operating rooms, and all other environments.</p>
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
                             <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:#10002B;font-size:12px"><a target="_blank" href="${privacyUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:12px">Privacy Policy</a> | <a target="_blank" href="${termsUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:#3C096C;font-size:12px">Terms and Conditions</a></p></td>
                            </tr>
                          </table>
                        </td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table>
        
            </td>
          </tr>
          </tbody>
          </table>
        
        </body>
        
        </html>`;

      mailOptions = {
        from: `"Atlearn" ${process.env.Email_User}`,
        to: user.email,
        subject: "Reset Password",
        html: emailContent,
      };
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }

  // try{
  //     const transporter = nodemailer.createTransport({
  //         host: 'smtp.ethereal.email',
  //         port: 587,
  //         auth: {
  //             user: 'maggie90@ethereal.email',
  //             pass: 'dtcwGmcQjRSZ94F9qV'
  //         }
  //     });

  //     await transporter.sendMail({
  //         from: 'ameents1123@gmail.com', // sender address
  //         to: "ameents.ts@gmail.com", // list of receivers
  //         subject: "Hello ✔", // Subject line
  //         text: "Hello world?", // plain text body
  //         html: "<b>Hello world?</b>", // html body
  //       });

  // }catch(error){
  //     console.log(error);
  // }
};

export default sendEmail;
