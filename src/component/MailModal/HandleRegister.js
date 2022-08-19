import axios from "axios";
import dataURLtoFile from "../../util/DataURLtoFile";

export const HandleSelectGuest = (context, dispatch) => {
  dispatch.setUserPredictionRef([]);
  setTimeout(() => {
    context.ToggleModal(true);
  }, 700);
};

export const HandleRegisterNewFace = (imgDataURL, name) => {
  const formData = new FormData();
  const file = dataURLtoFile(imgDataURL, "image.jpeg");
  formData.append("files", file);
  formData.append("name", name);
  axios
    .post(process.env.REACT_APP_RECOGNIZE_URL + "api/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log('registration done!', res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
