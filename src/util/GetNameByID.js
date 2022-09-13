const axios = require("axios");

const GetNameById = async (username) => {
  const url =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : process.env.PUBLIC_URL;
  const data = JSON.stringify({
    username,
  });
  const config = {
    method: "post",
    url: url + "/get-name",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const res = await axios(config);
  console.log(res.data);
  return res.data;
};

export default GetNameById;
