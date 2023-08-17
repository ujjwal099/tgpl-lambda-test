import nodemailer from "nodemailer";
import mandrillTransport from "nodemailer-mandrill-transport";
import "dotenv/config";
import AxiosUtils from "./utils/AxiosUtils/axiosUtils.mjs";
import axios from "axios";

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}

export const sendMailPromise = (options) => {
  var transporter = nodemailer.createTransport(
    mandrillTransport({
      auth: {
        apiKey: process.env.API_KEY || "GQQFb88GVJqao8cgBfBHfg",
      },
    })
  );
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

const sendMail = async (
  email,
  authEmail,
  spocEmail,
  isSigning,
  password,
  brandName,
  merchantName,
  authName,
  locallySigned,
  agreement,
  mailChange,
  country
) => {
  try {
    const today = dateToYMD(new Date());
    let configAuth;
    let configSpoc;
    let configSale;

    const emailSubmitAuth = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 10,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 10,
        payload: {
          email: authEmail,
          authEmail: authEmail,
          password: password,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authEmail,
          link: agreement,
          communicationCode: "email_submit_auth",
        },
      },
    });

    const emailSubmitSpoc = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 10,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 10,
        payload: {
          email: spocEmail,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authEmail,
          link: agreement,
          communicationCode: "email_submit_spoc",
        },
      },
    });

    const emailSubmitSale = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 10,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 10,
        payload: {
          email: email,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authName,
          link: agreement,
          communicationCode: "email_submit_sale",
        },
      },
    });

    const emailSignedAuth = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 9,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 9,
        payload: {
          email: authEmail,
          authEmail: authEmail,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authName,
          link: agreement,
          communicationCode: "email_signed_auth",
        },
      },
    });

    const emailSignedSpoc = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 9,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 9,
        payload: {
          email: spocEmail,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authName,
          link: agreement,
          communicationCode: "email_signed_spoc_sale",
        },
      },
    });

    const emailSignedSale = JSON.stringify({
      typeOfComms: 0,
      typeOfMessage: 9,
      requests: {
        programCode: "TGPL",
        userId: ["Dummy"],
        message: 9,
        payload: {
          email: email,
          merchantName: merchantName,
          brandName: brandName,
          today: today,
          authName: authName,
          link: agreement,
          communicationCode: "email_signed_spoc_sale",
        },
      },
    });

    if (mailChange == "Yes") {
      configAuth = {
        from: "noreply@thriwe.com",
        to: authEmail,
        subject: `${
          isSigning == "false"
            ? `MOU is submitted for Digital Signatures - ${brandName}`
            : `MOU is successfully signed - ${brandName}
`
        }`,
        text: `wow thats sample `,
        html: `
      ${
        isSigning == "false"
          ? `
        <p>Dear User,</p>
        <p>An MOU is successfully submitted for ${brandName}. Please login to below mention Platform URL and digitally
sign the MOU.</p>
        <p>AuthEmail : ${authEmail} </p>
       ${password ? `<p> Password : ${password} </p>` : ""}
        <p>Platform URL: <a href="https://tgpl-crm.thriwe.com/">https://tgpl-crm.thriwe.com</a></p>
        <p> Merchant Name: ${merchantName} </p>
        <p> Brand Name: ${brandName} </p>
        <p> Date of Signing: ${today} </p>
        <p> Agreement: <a href="${
          agreement ? agreement : ""
        }">View Agreement</a> </p>
        <p> Authorised Signatory: ${authName} </p>
        <p>Thanks, </p>
        <p>Team Thriwe </p>
          `
          : `
        <p>Dear User,</p>
        <p>MOU is successfully signed for ${brandName}. We have enclosed the signed MOU for reference.</p>
        <p>AuthEmail : ${authEmail} </p>
        ${password ? `<p> Password : ${password} </p>` : ""}
        <p>Platform URL: <a href="https://tgpl-crm.thriwe.com/">https://tgpl-crm.thriwe.com</a></p>
        <p> Merchant Name: ${merchantName} </p>
        <p> Brand Name: ${brandName} </p>
        <p> Date of Signing: ${today} </p>
        <p> Agreement: <a href="${
          agreement ? agreement : ""
        }">View Agreement</a> </p>
        <p> Authorised Signatory: ${authName} </p>
        <p>Thanks, </p>
        <p>Team Thriwe </p>
          `
      }
       `,
      };
      if (isSigning === "true") {
        configAuth = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "India"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSignedAuth,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
      } else {
        configAuth = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "India"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSubmitAuth,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
      }
    } else {
      if (locallySigned || isSigning) {
        configAuth = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "India"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSignedAuth,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
        configSpoc = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "india"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSignedSpoc,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
        configSale = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "india"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSignedSale,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
      } else {
        configAuth = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "india"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSignedAuth,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
        configSpoc = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "india"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSubmitSpoc,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
        configSale = AxiosUtils.axiosConfigConstructor(
          "post",
          country != "india"
            ? process.env.COMS_MIDDLE_EAST_URL
            : process.env.COMS_INDIA_URL,
          emailSubmitSale,
          {
            "Content-Type": "application/json",
          },
          country,
          null
        );
      }
    }
    await axios(configAuth);
    await axios(configSpoc);
    await axios(configSale);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
