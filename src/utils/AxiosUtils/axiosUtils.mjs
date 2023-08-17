export default class AxiosUtils {
  static axiosConfigConstructor = (
    method,
    endpoint,
    data,
    headers,
    country,
    params
  ) => {
    return {
      method: method,
      url: endpoint,
      headers: {
        "X-Thriwe-Comms-Key":
          country != "India"
            ? process.env.COMS_MIDDLE_EAST_KEY
            : process.env.COMS_INDIA_KEY,
        ...headers,
      },
      data: data,
      params: params,
    };
  };
}
