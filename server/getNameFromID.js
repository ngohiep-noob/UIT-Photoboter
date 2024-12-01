const md5 = require("md5");
const axios = require("axios");

module.exports = {
  GetNameById: async (username) => {
    const $pkey = process.env.UIT_PKEY;
    const time = new Date().getTime();
    const data = JSON.stringify({
      time: time,
      hash: md5(username + time + $pkey),
    });
    const config = {
      method: "post",
      url: `https://apiservice.uit.edu.vn/iot/att/user-info/${username}.json`,
      headers: {
        "Content-Type": "application/json",
        Cookie: process.env.UIT_COOKIE,
      },
      data: data,
    };
    const res = await axios(config);
    console.log(res.data);
    return res.data;
  },
};
