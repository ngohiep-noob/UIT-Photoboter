import axios from "axios";
import dataURLtoFile from "../../util/DataURLtoFile";

const HandleRecognize = (imgDataURL, dispatch) => {
  
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
      console.log(
        "recogized!!!",
        res.data.reduce((prev, curr) => [curr["name"], ...prev], [])
      );
      dispatch.setUserPredictionRef(
        res.data.reduce((prev, curr) => [curr["name"], ...prev], [])
      );
    })
    .catch((err) => {
      console.error(err);
    });
};

export default HandleRecognize;
