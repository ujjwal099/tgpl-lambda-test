import pdfTemplate from "./document/index.mjs";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import chromium from "@sparticuz/chromium";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfUploadToServer = async ({ id }) => {
  try {
    var data = new FormData();
    data.append("files", fs.createReadStream(`/tmp/${id}.pdf`));
    var config = {
      method: "post",
      url: `https://${process.env.PARSE_ENDPOINT}/parse/files/${id}.pdf`,
      headers: {
        "X-Parse-Master-Key": process.env.MASTER_KEY,
        "X-Parse-Application-Id": process.env.APPLICATION_ID,
        ...data.getHeaders(),
      },
      data: data,
    };
    const result = await axios(config);
    return result.data;
  } catch (error) {
    throw error;
  }
};
const createPdf = async (
  data,
  templateType,
  textSignature,
  id,
  ipAddress,
  signedAgreement
) => {
  try {
    // console.log(data);
    // console.log(data.offers);
    const htmlString = pdfTemplate(
      data,
      templateType,
      textSignature,
      ipAddress,
      signedAgreement
    );
    console.log("htmlString", htmlString);

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const tab = await browser.newPage();
    // await tab.setContent(`<style>
    //   @page {
    //     counter-increment: page;
    //   }
    //   body::after {
    //     content: counter(page);
    //     position: fixed;
    //     bottom: 10px;
    //     right: 10px;
    //     background-image: url(${textSignature}); /* Replace with the path to your image */
    //     background-size: contain;
    //     background-repeat: no-repeat;
    //     width: 30px;
    //     height: 30px;
    //   }
    // </style>
    // ${htmlString}`);
    await tab.goto(`data:text/html,${encodeURIComponent(htmlString)}`);

    await tab.setViewport({ width: 612, height: 792 });
    tab.setViewport({ width: 612, height: 792 });
    await tab.addStyleTag({
      content: "@media print { section { page-break-after: always; } }",
    });

    let arr = await tab.pdf({
      path: `/tmp/${id}.pdf`,
      displayHeaderFooter: true,
      footerTemplate: `
    ${
      textSignature
        ? `
    <div id="footer" style="font-size: 10px; width: 100%; text-align: center; padding-top: 30px; margin-top: 30px;">
        <img src="${textSignature}" alt="Footer Image" style="width: 200px; margin-left: 60px;">
    </div>
    `
        : ""
    }
`,
      margin: { top: 60, right: 72, bottom: 100, left: 72 },
    });

    console.log(arr);
    // console.log(arr);
    const result = await pdfUploadToServer({ id });
    // console.log(result);
    const str1 = result.url.substring(0, 4);
    const str2 = result.url.substring(4);
    result.url = str1 + "s" + str2;
    await browser.close();
    return result;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export const resetPassword = async (mail) => {
  var userData = {
    where: {
      username: mail,
    },
  };
  var config = {
    method: "get",
    url: `https://tgpl-crm-api.thriwe.com/parse/users`,
    headers: {
      "X-Parse-Master-Key": "Hh4evLBEui54XoUj",
      "X-Parse-Application-Id": "PROD_APPLICATION_ID",
    },
    params: userData,
  };
  const userInformation = await axios(config);

  if (userInformation.data.results.length > 0) {
    const password = Math.random().toString(36).slice(2, 10);
    try {
      let updateUserData = {
        password: password,
      };
      var updateUserConfig = {
        method: "put",
        url: `https://tgpl-crm-api.thriwe.com/parse/users/${userInformation.data.results[0].objectId}`,
        headers: {
          "X-Parse-Master-Key": "Hh4evLBEui54XoUj",
          "X-Parse-Application-Id": "PROD_APPLICATION_ID",
        },
        data: updateUserData,
      };
      await axios(updateUserConfig);
      var options = {
        from: "noreply@thriwe.com",
        to: mail,
        subject: "Reset Password",
        text: ``,
        html: `
      <p style="color: #555555; margin-bottom: 10px;">Dear User,</p>
      <p style="color: #555555; margin-bottom: 20px;">Your password has been successfully reset.</p>
      <p style="color: #555555; margin-bottom: 20px;">Your new password is: <strong>${password}</strong></p>
      <p style="color: #555555; margin-bottom: 10px;">Thanks</p>
      <p style="color: #555555; margin-bottom: 0;">Team Thriwe</p>`,
      };
      await sendMailPromise(options);
      return "Reset Password Successful";
    } catch (error) {
      return error.message;
    }
  }
};

export default createPdf;
