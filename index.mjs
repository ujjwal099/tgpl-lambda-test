import createPdf, { resetPassword } from "./src/index.mjs";
import fs from "fs";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "./src/sendMail.mjs";
import "dotenv/config";
import sendOtp from "./src/sendOtp.mjs";
import {
  approvedMailBySales,
  rejectMailBySales,
} from "./src/SalesConfirmMail.mjs";

import sendWhatsappMessage from "./src/sendMessageToWssp.mjs";
import { sendBriefMails } from "./src/sendMailToBrief.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handler = async (event) => {
  // TODO implement
  // console.log(event);
  const headers = event.headers;
  const xForwardedFor = headers["X-Forwarded-For"];

  // Extract the client IP address from the "X-Forwarded-For" header
  let ip;
  if (xForwardedFor) {
    ip = xForwardedFor.split(",")[0];
  } else {
    // If "X-Forwarded-For" header is not present, retrieve the source IP from the "requestContext"
    ip = event.requestContext.identity.sourceIp;
  }
  console.log(ip);
  let {
    data,
    templateType,
    textSignature,
    noremail,
    authEmail,
    spocEmail,
    isSigning,
    password,
    fileToBeDeletedName,
    brandName,
    merchantName,
    authName,
    ipAddress,
    locallySigned,
    agreement,
    phone,
    mailChange,
    signedAgreement,
    mail,
    countryCode,
    rejectedMail,
    approvedMail,
    authorizedSignatoryMail,
    whatsappPhoneNumber,
    merchantId,
    briefMails,
    briefData,
    country,
  } = JSON.parse(event.body);
  const id = Date.now();
  if (phone) {
    const { objectId } = await sendOtp(phone, mail, countryCode);
    const response = {
      statusCode: 200,
      body: objectId,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
    return response;
  } else if (noremail && authEmail && spocEmail) {
    console.log("noremail", noremail);
    await sendMail(
      noremail,
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
    );
    // console.log(noremail);
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: `Mail send successfully`,
    };
    return response;
  } else if (approvedMail) {
    await approvedMailBySales(approvedMail);
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: `Mail send successfully`,
    };
    return response;
  } else if (rejectedMail) {
    await rejectMailBySales(rejectedMail);
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: `Mail send successfully`,
    };
    return response;
  } else if (authorizedSignatoryMail) {
    const resetPasswordMessage = await resetPassword(authorizedSignatoryMail);
    const response = {
      statusCode: 200,
      body: JSON.stringify(resetPasswordMessage),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
    return response;
  } else if (whatsappPhoneNumber && merchantId && countryCode) {
    const responseWhatappMessage = await sendWhatsappMessage(
      countryCode,
      whatsappPhoneNumber,
      merchantId
    );
    const response = {
      statusCode: 200,
      body: JSON.stringify(responseWhatappMessage),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
    return response;
  } else if (briefMails && briefData) {
    await sendBriefMails(briefMails, briefData);
    const response = {
      statusCode: 200,
      body: "Mail send successfully",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
    return response;
  } else {
    if (ipAddress == "ip") ipAddress = ip;
    const ans = await createPdf(
      data,
      templateType,
      textSignature,
      id,
      ipAddress,
      signedAgreement
    );
    if (fileToBeDeletedName !== undefined) {
      try {
        var config = {
          method: "delete",
          url: `https://${process.env.PARSE_ENDPOINT}/parse/files/${fileToBeDeletedName}`,
          headers: {
            "X-Parse-Master-Key": process.env.MASTER_KEY,
            "X-Parse-Application-Id": process.env.APPLICATION_ID,
          },
        };
        await axios(config);
      } catch (error) {
        throw error;
      }
    }
    fs.unlink(`/tmp/${id}.pdf`, function (err) {
      if (err) throw err;
    });
    const response = {
      statusCode: 200,
      body: JSON.stringify(ans),
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
    };
    return response;
  }
};
