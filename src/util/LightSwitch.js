const axios = require("axios");

const LightSwitch = async (mode) => {
  const lightSwitchUrl = "https://api.mmlab.uit.edu.vn/iot";

  const config = {
    method: "get",
    url: lightSwitchUrl + `/turn-${mode}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return await axios(config);
};

export default LightSwitch;
