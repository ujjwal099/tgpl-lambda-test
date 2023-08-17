import { sendMailPromise } from "./sendMail.mjs";

export const sendBriefMails = async (briefMails, briefData) => {
  var options = {
    from: "noreply@thriwe.com",
    to: briefMails.join(", "),
    subject: `A New Brief has Submitted for ${briefData?.programName}`,
    text: `wow thats sample `,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            /* Set some general styles */
            body {
                background-color: #f8f8f8;
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }
    
            /* Style the container */
            .container {
                margin: 20px auto;
                max-width: 800px;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
    
            /* Style the headings */
            h1 {
                font-size: 28px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 20px;
            }
    
            /* Style the paragraphs */
            p {
                margin-bottom: 15px;
            }
    
            /* Style the link */
            a {
                color: #007bff;
                text-decoration: none;
            }
    
            /* Style the link on hover */
            a:hover {
                text-decoration: underline;
            }
    
            /* Style the logo image */
            .logo {
                display: block;
                max-width: 100%;
                max-height: 150px;
                margin: 0 auto 20px;
            }
    
            /* Style the table */
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
    
            table, th, td {
                border: 1px solid #ddd;
            }
    
            th, td {
                padding: 10px;
                text-align: left;
            }
    
            th {
                background-color: #f2f2f2;
            }
    
            /* Style the italic text */
            .italic-text {
                font-style: italic;
                color: #555;
            }
    
            /* Style the bold text */
            .bold-text {
                font-weight: bold;
                color: #007bff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img
                src="https://assets.thriwe.com/thriwe_website_main/img/logo.png"
                alt="Thriwe Logo"
                class="logo"
            />
            <p>Dear User,</p>
            <p>A form is successfully submitted for brief.</p>  
            <table>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Platform URL</td>
                    <td>
                        <a target="_blank" href="https://tgpl-crm.thriwe.com/">https://tgpl-crm.thriwe.com</a>
                    </td>
                </tr>
                <tr>
                    <td>Region</td>
                    <td>${briefData?.region}</td>
                </tr>
                <tr>
                    <td>Program Name</td>
                    <td>${briefData?.programName}</td>
                </tr>
                <tr>
                    <td>Offer Construct</td>
                    <td>${briefData?.offerConstruct}</td>
                </tr>
                <tr>
                    <td>Offer T&amp;C</td>
                    <td>${briefData?.offersTandC}</td>
                </tr>
                <tr>
                    <td>Criteria</td>
                    <td>${briefData?.criteria}</td>
                </tr>
                <tr>
                    <td>Category</td>
                    <td>${briefData?.category}</td>
                </tr>
                <tr>
                    <td>Customer Redemption Process</td>
                    <td>${briefData?.customerRedemptionProcess}</td>
                </tr>
                <tr>
                    <td>Visibility Elements</td>
                    <td>${briefData?.visibilityElements}</td>
                </tr>
                <tr>
                    <td>Focus Area</td>
                    <td>${briefData?.focusArea}</td>
                </tr>
                <tr>
                    <td>Merchant Redemption Process</td>
                    <td>${briefData?.merchantRedemptionProcess}</td>
                </tr>
                <tr>
                    <td>Pre Requisite Offers</td>
                    <td>${briefData?.preRequisiteOffers}</td>
                </tr>
                <tr>
                    <td>Update Schedule</td>
                    <td>${briefData?.updateSchedule}</td>
                </tr>
                <tr>
                    <td>Collaterals</td>
                    <td>${briefData?.collaterals}</td>
                </tr>
                <tr>
                    <td>Training</td>
                    <td>${briefData?.training}</td>
                </tr>
                <tr>
                    <td>Submission</td>
                    <td>${briefData?.submission}</td>
                </tr>
                <tr>
                    <td>Sourcing</td>
                    <td>${briefData?.sourcing}</td>
                </tr>
                <tr>
                    <td>Count</td>
                    <td>${briefData?.count}</td>
                </tr>
                <tr>
                    <td>Write Up</td>
                    <td>${briefData?.writeUp}</td>
                </tr>
            </table>
            <h2>Welcome Kit</h2>
            <ul>
            ${
              briefData?.welcomeKit && briefData?.welcomeKit.length > 0
                ? `
              <ul>
                ${briefData?.welcomeKit
                  .map(
                    (imageUrl) =>
                      `<li>
                     Welcome Kit :
                      <a target="_blank" href="${
                        imageUrl.data ? imageUrl.data : ""
                      }" >View Welcome Kit</a>
                    </li>`
                  )
                  .join("")}
              </ul>
            `
                : ""
            }  
            </ul>
            <p class="italic-text">Thanks,</p>
            <p class="bold-text">Team Thriwe</p>
        </div>
    </body>
    </html>    
    `,
  };
  await sendMailPromise(options);
};
