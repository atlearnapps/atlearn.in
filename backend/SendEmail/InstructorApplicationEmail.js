import nodemailer from "nodemailer";

const InstructorApplicationEmail = async (
  email,
  message,
  name,
  subject,
  phone,
  termsURL,
  privacyURL,
  type
) => {
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
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

  <style type="text/css">
    @media only screen and (min-width: 520px) {
      .u-row {
        width: 500px !important;
      }

      .u-row .u-col {
        vertical-align: top;
      }


      .u-row .u-col-100 {
        width: 500px !important;
      }

    }

    @media only screen and (max-width: 520px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }

      .u-row {
        width: 100% !important;
      }

      .u-row .u-col {
        display: block !important;
        width: 100% !important;
        min-width: 320px !important;
        max-width: 100% !important;
      }

      .u-row .u-col>div {
        margin: 0 auto;
      }


      .u-row .u-col img {
        max-width: 100% !important;
      }

    }

    body {
      margin: 0;
      padding: 0
    }

    table,
    td,
    tr {
      border-collapse: collapse;
      vertical-align: top
    }

    .ie-container table,
    .mso-container table {
      table-layout: fixed
    }

    * {
      line-height: inherit
    }

    a[x-apple-data-detectors=true] {
      color: inherit !important;
      text-decoration: none !important
    }


    table,
    td {
      color: #000000;
    }
  </style>



</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9F9;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table role="presentation" id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9F9;width:100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
          <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #F9F9F9;"><![endif]-->



          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="https://assets.unlayer.com/projects/266571/1747637332870-math-101%20(5).png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 76%;max-width: 364.8px;" width="364.8" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p data-start="178" data-end="202" style="line-height: 140%; margin: 0px;">Dear Atlearn Team,</p>
                                <p data-start="178" data-end="202" style="line-height: 140%; margin: 0px;">&nbsp;</p>
                                <p data-end="268" data-start="164" style="line-height: 140%; margin: 0px;">You’ve received a new instructor application through the Atlearn website. Please find the details below:</p>
                                <ul data-start="316" data-end="488">
                                  <li data-start="316" data-end="353" style="line-height: 19.6px;"><strong data-start="318" data-end="331">Full Name</strong>: ${name}</li>
                                  <li data-start="354" data-end="396" style="line-height: 19.6px;"><strong data-start="356" data-end="373">Email Address</strong>: ${email}</li>
                                  <li data-start="397" data-end="445" style="line-height: 19.6px;"><strong data-start="399" data-end="415">Phone Number</strong>: ${phone || "No"}</li>
                                  <li data-start="446" data-end="488" style="line-height: 19.6px;"><strong data-start="448" data-end="459">Message</strong>:<br data-start="460" data-end="463"><em>${message}</em></li>
                                </ul>
                                <p data-start="442" data-end="540" style="line-height: 140%; margin: 0px;">Kindly review the submission and connect with the applicant for further discussion and next steps.</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #6e8afe;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: #6e8afe;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;"><span style="text-decoration: underline; line-height: 19.6px;"><span style="line-height: 19.6px;"><strong>Get in touch</strong></span></span></p>
                                <p style="line-height: 140%; margin: 0px;"><span style="line-height: 19.6px;">+91 6381250184</span></p>
                                <p style="line-height: 140%; margin: 0px;"><span style="line-height: 19.6px;">support@atlearn.in</span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div align="center" style="direction: ltr;">
                                <div style="display: table; max-width:184px;">
                                  <!--[if (mso)|(IE)]><table role="presentation" width="184" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:184px;"><tr><![endif]-->


                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://www.facebook.com/Atlearn.in" title="Facebook" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://www.linkedin.com/company/atlearn" title="LinkedIn" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://www.instagram.com/atlearn_in/" title="Instagram" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="https://in.pinterest.com/atlearnlms/" title="Pinterest" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/pinterest.png" alt="Pinterest" title="Pinterest" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->

                                  <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                          <a href="URL https://www.facebook.com/Atlearn.in AtLearn https://www.instagram.com/atlearn_in/ https://www.youtube.com/@Atlearn_In" title="YouTube" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if (mso)|(IE)]></td><![endif]-->


                                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                </div>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
              </div>
            </div>
          </div>





          <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #6e8afe;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: #6e8afe;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;"><span style="color: rgb(255, 255, 255); line-height: 19.6px;">Copyright © 2025 by Atlearn. All Rights Reserved.</span></p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!--[if (!mso)&(!IE)]><!-->
                    </div><!--<![endif]-->
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
      from: `"${name}" ${process.env.Email_User}`,
      to: process.env.Email_User,
      subject: "New Tutor Application - Let's Welcome Them Aboard!",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default InstructorApplicationEmail;
