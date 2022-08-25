import axios from "axios";
import dataURLtoFile from "../../util/DataURLtoFile";

const HandleRecognize = (imgDataURL, dispatch, context) => {
  const formData = new FormData();
  const file = dataURLtoFile(imgDataURL, "image.jpeg");
  formData.append("files", file);
  axios
    .post(process.env.REACT_APP_RECOGNIZE_URL + "api/recognize", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
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
      console.log("recogized!!!");
      console.log("user: ", userList);
      console.log("guest: ", guestList);

      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList,
        guestList,
      });
    })
    .catch((err) => {
      console.error("error", err);
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: [],
        guestList: [],
      });
    });
};

export default HandleRecognize;
