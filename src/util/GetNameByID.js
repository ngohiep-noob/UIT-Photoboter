const axios = require("axios");
const md5 = require("md5");

const $pkey = "IL@_};uE7<kUitt!";

const GetNameById = async(username) => {
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
      Cookie:
        "SSESSbb01d9a0f90d4363b1d5ca1a35c4c20b=DTQtRsJXMHj0Dku_7e68uDDViP356KMi65DGmaYpzoo",
    },
    data: data,
  };
  //   axios(config)
  //     .then((response) => {
  //       console.log(response.data);
  //       return new Promise((resolve, reject) => {
  //         if (response.data.code === 1) resolve(data.hoten);
  //         else resolve("");
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //       return new Promise((res, rej) => res(""));
  //     });
  return await axios(config);
};

export default GetNameById;
