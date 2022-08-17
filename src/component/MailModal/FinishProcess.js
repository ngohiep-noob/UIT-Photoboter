import { SetSleepTime } from "../../service/RedirectPage";

const FinishProcess = (
  dispatch,
  toastMsg = "Wait a moment for new session!"
) => {
  dispatch.setState((prev) => ({
    ...prev,
    toastMessage: toastMsg,
  }));
  setTimeout(() => {
    dispatch.setIsHandlingShooting(false);
    console.log("finish session!");
  }, 7000);
  dispatch.setSleepIdRef(SetSleepTime(300));
  dispatch.setUserPredictionRef([]);
  console.log("clear predictions & sleeping...");
};

export default FinishProcess;
