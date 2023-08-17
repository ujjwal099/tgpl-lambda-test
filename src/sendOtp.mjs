import axios from "axios";
import { sendMailPromise } from "./sendMail.mjs";

const sendCode = async (phone, code, countryCode) => {
  var data = JSON.stringify({
    flow_id: "63dcd4fbd6fc055abd747e13",
    mobiles: `${countryCode}${phone}`,
    var: code,
  });
  console.log("Data", data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.msg91.com/api/v5/flow/",
    headers: {
      authkey: "377863AM7ok4QkYD1c63bc0c29P1",
      "Content-Type": "application/json",
      Cookie: "PHPSESSID=40aiqhbvg8ncu7i16t4rkf1ig3",
    },
    data: data,
  };
  await axios(config);
  return;
};

const sendOtp = async (phone, mail, countryCode) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await sendCode(phone, code, countryCode);
  var data = {
    phone: phone,
    code: code,
  };
  var config = {
    method: "post",
    url: `https://${process.env.PARSE_ENDPOINT}/parse/classes/Otp`,
    headers: {
      "X-Parse-Master-Key": process.env.MASTER_KEY,
      "X-Parse-Application-Id": process.env.APPLICATION_ID,
      "Content-Type": "application/json",
    },
    data: data,
  };
  const result = await axios(config);
  console.log("Result", result.data);
  var options = {
    from: "noreply@thriwe.com",
    to: mail,
    subject: "OTP for Thriwe CRM | Email Verification",
    text: `wow thats sample `,
    html: `<p>Dear User,</p>
<p>Please use OTP ${code} to verify your credentials.<br>
Please Note: OTP is valid for 10 minutes only</p>
<p>
Stay Safe,<br>
Team Thriwe<br>
</p>`,
  };
  await sendMailPromise(options);
  return result.data;
};

export default sendOtp;
