import FinishProcessWithToast from "./FinishProcess";
import { HandleRegisterNewFace } from "./HandleRegister";
import SendMail from "./SendMail";

const HandleSubmit = async (dispatch, context, email, name = "") => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    dispatch.setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    SendMail({
      recipient: email,
      imgBase64: context.finalImageRef.current,
      title: "UIT photoboter send image",
      textContent: "Image from UIT photoboter🤖",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log("send mail: ", res);
        dispatch.setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        FinishProcessWithToast(
          dispatch,
          "Image sent, wait a moment for new session!"
        );
      })
      .catch((err) => {
        console.error(err);

        dispatch.setState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        FinishProcessWithToast(
          dispatch,
          "Cannot send email, wait a moment for new session!"
        );
      });
    if (name !== "") /// if name is provide, then register new user!
      HandleRegisterNewFace(context.recogizedImageRef.current, name);
  } else {
    FinishProcessWithToast(
      dispatch,
      "Invalid email, wait a moment for new session!"
    );
  }
};

export default HandleSubmit;
