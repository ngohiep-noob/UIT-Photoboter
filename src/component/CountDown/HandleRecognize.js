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
      const header =
        userList.length === 0
          ? "Chúng ta làm quen nhé!"
          : "Dưới đây có tên của bạn không?";
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: userList,
        guestList: guestList,
        header: header,
      });
    })
    .catch((err) => {
      console.error("error", err);
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: [],
        header: "Có gì đó sai sai!",
      });
    });
};

export default HandleRecognize;
