import axios from "axios";
import dataURLtoFile from "../../util/DataURLtoFile";

const HandleRecognize = async (imgDataURL, dispatch, context) => {
  const formData = new FormData();
  const file = dataURLtoFile(imgDataURL, "image.jpeg");
  formData.append("files", file);
  try {
    const res = await axios.post(
      process.env.REACT_APP_RECOGNIZE_URL + "api/recognize",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const userList = [],
      guestList = [];
    res.data.forEach((e) => {
      if (e.name !== "") {
        userList.push({
          name: e.name.split(" - ")[0],
          email: e.name.split(" - ")[1],
          avatar: process.env.REACT_APP_RECOGNIZE_URL + e.path,
        });
      } else {
        guestList.push({
          name: "Bạn là khách!",
          email: "",
          avatar: process.env.REACT_APP_RECOGNIZE_URL + e.path,
        });
      }
    });
    
    console.log("user: ", userList);
    console.log("guest: ", guestList);

    dispatch.setMessageOptions({
      ...context.messageOptions.current,
      userList,
      guestList,
    });
    console.log("recognize: ", +new Date());
  } catch (error) {
    console.error("error", error);
    dispatch.setMessageOptions({
      ...context.messageOptions.current,
      userList: [],
      guestList: [],
    });
  }
};

export default HandleRecognize;
