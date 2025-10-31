import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
// import Token from "../models/token.js";
const ScheduleEmail = async (scheduleDetails, subjectType) => {
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
        pass: process.env.Email_Password,
      },
    });
    let dateStr = scheduleDetails.startDate;
    let dateObj = new Date(dateStr);
    let startTime = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    let dateEnd = scheduleDetails.endDate;
    let dateObjEnd = new Date(dateEnd);
    let EndTime = dateObjEnd.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    let date = scheduleDetails.startDate;
    let datenewObject = new Date(date);

    // Extract the month and day in the "Mon DD" format
    let formattedDate = datenewObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
const subjectTxt = subjectType
      ? subjectType
      : 'Invitation';
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


      .u-row .u-col-33p33 {
        width: 166.65px !important;
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

                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="https://assets.unlayer.com/projects/266571/1747637969593-Atlearn-WO-Logo.png?w=422.4px" alt="atlearn logo" title="atlearn logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 44%;max-width: 211.2px;" width="211.2" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                    <img align="center" border="0" src="https://assets.unlayer.com/projects/266571/1739263453330-Here%E2%80%99s%20What%20we%20Offer%20(8).png?w=796.8px" alt="Atlearn meeting" title="Atlearn meeting" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 83%;max-width: 398.4px;" width="398.4" />

                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;">You have a new meeting scheduled on Atlearn. Please join the session using the details below</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                              <div align="center">
                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:37px; v-text-anchor:middle; width:95px;" arcsize="11%"  stroke="f" fillcolor="#6e8afe"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                <a href="" target="_blank" class="v-button" style="box-sizing: border-box; display: inline-block; text-decoration: none; text-size-adjust: none; text-align: center; color: rgb(255, 255, 255); background: rgb(110, 138, 254); border-radius: 4px; width: auto; max-width: 100%; word-break: break-word; overflow-wrap: break-word; font-size: 14px; line-height: inherit;"><span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Join now</span></span>
                                </a>
                                <!--[if mso]></center></v:roundrect><![endif]-->
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





          <div class="u-row-container" style="padding: 5px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 5px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: #ffffff;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="164" style="width: 164px;padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;"><strong><span style="color: rgb(110, 138, 254); line-height: 19.6px;">${scheduleDetails.title}</span></strong></p>
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
                <!--[if (mso)|(IE)]><td align="center" width="164" style="width: 164px;padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;"><strong><span style="color: rgb(110, 138, 254); line-height: 19.6px;">${formattedDate}</span></strong></p>
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
                <!--[if (mso)|(IE)]><td align="center" width="164" style="width: 164px;padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 5px 0px;border-top: 1px solid #6e8afe;border-left: 1px solid #6e8afe;border-right: 1px solid #6e8afe;border-bottom: 1px solid #6e8afe;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;"><strong><span style="color: rgb(110, 138, 254); line-height: 19.6px;">${startTime} to ${EndTime}</span></strong></p>
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

                              <div style="font-size: 14px; color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <p data-start="506" data-end="535" style="line-height: 140%; margin: 0px;"><strong data-start="506" data-end="535">How to Join Your Meeting:</strong></p>
                                <ol data-start="537" data-end="773">
                                  <li data-start="537" data-end="609" style="line-height: 19.6px;"><strong data-start="540" data-end="551">Log in:</strong> Access your Atlearn account using your usual credentials.</li>
                                  <li data-start="610" data-end="674" style="line-height: 19.6px;"><strong data-start="613" data-end="626">Navigate:</strong> Go to the “Meetings” section on your dashboard.</li>
                                  <li data-start="675" data-end="773" style="line-height: 19.6px;"><strong data-start="678" data-end="687">Join:</strong> Click on the “${scheduleDetails.title}” meeting link at the scheduled time to join the session.</li>
                                </ol>
                                <p data-start="775" data-end="1031" style="line-height: 140%; margin: 0px;">For the best experience, we recommend checking your audio and video settings before the meeting. If you encounter any issues or have any questions, please feel free to reach out to our support team at <a target="_blank" href="mailto:support@atlearn.in" rel="noopener">support@atlearn.in</a>.</p>
                              </div>

                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
                              <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 15px; font-weight: 400;">
                                <p style="line-height: 160%;"><span style="line-height: 32px;"><strong>Get in touch</strong></span></p>
                                <p style="line-height: 160%; margin: 0px;">+91 6381250184</p>
                                <p style="line-height: 160%; margin: 0px;">support@atlearn.in</p>
                              </h1>
                              <!--[if mso]></td></tr></table><![endif]-->

                            </td>
                          </tr>
                        </tbody>
                      </table>

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
                                          <a href="https://www.youtube.com/@Atlearn_In" title="YouTube" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/youtube.png" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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
                                          <a href="https://in.pinterest.com/atlearnlms/" title="Pinterest" target="_blank" style="color: rgb(0, 0, 238); text-decoration: underline; line-height: inherit;"><img src="https://cdn.tools.unlayer.com/social/icons/circle/pinterest.png" alt="Pinterest" title="Pinterest" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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

                      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                              <div style="font-size: 12px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                <p style="line-height: 140%; margin: 0px;">Copyright © 2025 by Atlearn. All Rights Reserved.</p>
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
      from: `"Atlearn" ${process.env.Email_User}`,
      to: scheduleDetails.guestEmail,
      subject: `${subjectTxt}: Atlearn - ${scheduleDetails.title}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export default ScheduleEmail;
