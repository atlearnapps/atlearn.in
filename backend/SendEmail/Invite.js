import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
import Token from "../models/token.js";
import jwt from "jsonwebtoken";
const Invite = async (email,termsURL,privacyURL) => {
  try {
    const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   host: "smtp.gmail.com",
    //   port: 587,
    //   secure: true, // upgrade later with STARTTLS
    //   auth: {
    //     user: "farlanes.akra@gmail.com",
    //     pass: "wmucrtchjzpknfch",
    //   },

    host: 'smtp.hostinger.com',
    port: 465, 
    secure: true,
    auth: {
        user: process.env.Email_User,
        pass:process.env.Email_Password,
      },
    });
    // const encryptedToken = bcrypt
    // .hashSync(email.toString(), 10)
    // .replaceAll("/", "");
    const encryptedToken = jwt.sign(
        {
          email: email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1w", // 1 week
        }
      );

    const token = await Token.create({
      email: email,
      token: encryptedToken,
    });

    const termsUrl = termsURL
    ? termsURL
    : `${process.env.CLIENT_URL}/terms-and-conditions`;
  const privacyUrl = privacyURL
    ? privacyURL
    : `${process.env.CLIENT_URL}/privacy-policy`;

    let emailContent, mailOptions;

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
                            <p style="margin: 0;">We're excited to have you get started. First, you need to register your account. Just press the button below.</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                            <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center" style="border-radius: 3px;" bgcolor="#0C56AC"><a href="${process.env.EMAIL_VERIFY_URL}/signup?token=${encryptedToken}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #0C56AC; display: inline-block;">Register an Account</a></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr> <!-- COPY -->
                  
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have not registered on atlearn, please ignore this email. <br>For any assistance or if you did not initiate this request, please contact our support team at <a href="mailto:contact@atlearn.in" style=" text-decoration: none;">contact@atlearn.in</a>.</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">Cheers,<br>atlearn Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding:0;Margin:0">
                                <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#001B48;width:600px">
                                  <tr>
                                   <td align="left" style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:30px;padding-left:20px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                      <tr>
                                       <td align="left" style="padding:0;Margin:0;width:560px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                          <tr>
                                           <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                           <p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:white;font-size:12px">Atlearn assistance, streamlines communications, fosters connections, and promotes more effective collaboration in boardrooms, classrooms, operating rooms, and all other environments.</p>
                                           </td>
                                          </tr>
                                          <tr>
                                           <td align="center" style="padding:0;Margin:0;font-size:0">
                                            <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                              <tr>
                                               <td align="center" valign="top" class="es-m-p0r" style="padding:0;Margin:0;padding-right:20px"><a target="_blank" href="https://www.youtube.com/@AkraTechServices/videos" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png" alt="Yt" title="Youtube" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
                                               <td align="center" valign="top" style="padding:0;Margin:0"><a target="_blank" href="https://www.linkedin.com/company/akra-tech-private-limited/" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px"><img src="https://feojygm.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png" alt="In" title="Linkedin" height="22" width="22" style="display:block;font-size:16px;border:0;outline:none;text-decoration:none"></a></td>
                                              </tr>
                                            </table></td>
                                          </tr>
                                          <tr>
                                           <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:Syne, Arial, sans-serif;line-height:18px;letter-spacing:0;color:white;font-size:12px"><a target="_blank" href="${privacyUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px">Privacy Policy</a> | <a target="_blank" href="${termsUrl}" style="mso-line-height-rule:exactly;text-decoration:underline;color:white;font-size:12px">Terms and Conditions</a></p></td>
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
                </td>
            </tr>
          
          
           
        </table>
       
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

export default Invite;
