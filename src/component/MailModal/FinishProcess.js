import { SetSleepTime } from "../../service/RedirectPage";

const FinishProcessWithToast = (
  dispatch,
  context,
  toastMsg = "Chờ trong giây lát cho lần sử dụng tiếp theo!"
) => {
  context.SetContentAndShowToast({
    body: toastMsg,
  });
  setTimeout(() => {
    dispatch.setIsHandlingShooting(false);
    console.log("finish session!");
  }, 7000);
  dispatch.setSleepIdRef(SetSleepTime(300));
  dispatch.setUserPredictionRef([]);
  console.log("clear predictions & sleeping...");
};

export default FinishProcessWithToast;
