import FinishProcessWithToast from "./FinishProcess";
import { HandleRegisterNewFace } from "./HandleRegister";
import SendMail from "./SendMail";

const HandleSubmit = async (dispatch, context, email, name = "") => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    context.setShowSpinner(true);
    SendMail({
      recipient: email,
      imgBase64: context.finalImageRef.current,
      title: "🤖 UIT photoboter xin tặng bạn một tấm hình",
      textContent: "Người trong hình thật xinh đẹp 🥰",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        console.log("send mail: ", res);
        context.setShowSpinner(false);
        if(res.status === 'success')
          FinishProcessWithToast(
            dispatch,
            context,
            "Đã gửi email, chờ trong giây lát cho lần sử dụng tiếp theo nhé!"
          );
        else 
          FinishProcessWithToast(
            dispatch,
            context,
            "Không thể gửi email, chờ trong giây lát và thử lại nhé!"
          );
      })
      .catch((err) => {
        console.error(err);
        context.setShowSpinner(false);
        FinishProcessWithToast(
          dispatch,
          context,
          "Không thể gửi email, chờ trong giây lát và thử lại nhé!"
        );
      });
    if (name !== "")
      /// if name is provide, then register new user!
      HandleRegisterNewFace(
        context.recogizedImageRef.current,
        name + " - " + email
      );
  } else {
    FinishProcessWithToast(
      dispatch,
      context,
      "email không hợp lệ, chờ trong giây lát và thử lại nhé!"
    );
  }
};

export default HandleSubmit;
