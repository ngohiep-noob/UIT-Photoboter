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
      const userList = res.data.reduce((prev, curr) => {
        if (curr.sim >= 0.7) {
          return [
            ...prev,
            {
              name: curr.name.split(" - ")[0],
              email: curr.name.includes("2152")
                ? curr.name.split(" - ")[1] + "@gm.uit.edu.vn"
                : curr.name.split(" - ")[1],
              avatar: process.env.REACT_APP_RECOGNIZE_URL + curr.path,
            },
          ];
        }
      }, []);
      console.log("recogized!!!", userList);

      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList,
        header:
          userList.length === 0
            ? "Chúng ta làm quen nhé!"
            : "Dưới đây có tên của bạn không?",
      });
    })
    .catch((err) => {
      console.error('error', err);
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: [],
        header: "Chúng ta làm quen nhé!",
      });
    });
};

export default HandleRecognize;
