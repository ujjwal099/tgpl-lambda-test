import axios from "axios";
import "dotenv/config";

const sendWhatsappMessage = async (
  countryCode,
  whatsappPhoneNumber,
  merchantId
) => {
  try {
    let data = JSON.stringify({
      countryCode: "+91",
      phoneNumber: whatsappPhoneNumber,
      type: "Template",
      callbackData: "some_callback_data",
      template: {
        name: "tech_format_hsbc_golf_app_social_req_sent_0013",
        languageCode: "en",
        bodyValues: ["HSBC Golf League Platform"],
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.interakt.ai/v1/public/message/",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic U0lHcUdVVkpxelhNZkJyTnlQdm9KZHYtYXFYQUZwNXJBRHhOLXNDckx1VTo=",
      },
      data: data,
    };

    await axios.request(config);
  } catch (error) {
    return error.message;
  }
};

export default sendWhatsappMessage;
