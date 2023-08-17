import { sendMailPromise } from "./sendMail.mjs";

export const approvedMailBySales = async (mail) => {
  var options = {
    from: "noreply@thriwe.com",
    to: mail,
    subject: "OTP for Thriwe CRM | Email Verification",
    text: `wow thats sample `,
    html: `<p>Dear User,</p>
        <p>Merchant Approved</p>
    `,
  };
  await sendMailPromise(options);
};

export const rejectMailBySales = async (mail) => {
  var options = {
    from: "noreply@thriwe.com",
    to: mail,
    subject: "OTP for Thriwe CRM | Email Verification",
    text: `wow thats sample `,
    html: `<p>Dear User,</p>
        <p>Merchant Rejected</p>
    `,
  };
  await sendMailPromise(options);
};
