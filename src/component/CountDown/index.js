import React, {
  useContext,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import HandleRecognize from "./HandleRecognize";
import { ClearSleepTime } from "../../service/RedirectPage";
import { Backdrop } from "@mui/material";
import PlayAudio from "../../util/PlayAudio";

const CountDown = (props, ref) => {
  const [times, setTimes] = useState(props.times);
  const [show, setCountDownShow] = useState(false);
  const context = useContext(ProcessContextState).current;
  const dispatch = useContext(ProcessContextDispatch);

  const CanvasToFile = () => {
    const canvas = document.querySelector("canvas");
    // const imgFile = dataURLtoFile(canvas.toDataURL("image/jpeg"), "image.jpeg");
    return canvas.toDataURL("image/jpeg");
    // return imgFile;
  };

  useImperativeHandle(ref, () => ({
    setCountDownShow,
  }));

  useEffect(() => {
    if (times === 4) {
      console.log("capture 1");
      //call api recognize
      const imgDataURL = context.webCamRef.current.getScreenshot();
      dispatch.setRecogizedImageRef(imgDataURL);
      HandleRecognize(imgDataURL, dispatch, context);
    }

    if (times === 1) {
      console.log("capture 2");
      //send mail
      setTimeout(() => {
        dispatch.setShowMsgBox(false); // close notifications(from mode 1) ***
        dispatch.setFinalImageRef(CanvasToFile());
        let audio =
          context.messageOptions.current.userList.length === 0
            ? "makefriend"
            : "confirm";
        let header =
          context.messageOptions.current.userList.length === 0
            ? "Chúng ta làm quen nhé!"
            : "Dưới đây có tên của bạn không?";

        let mode = 2.1;
        if (
          context.messageOptions.current.userList.length === 0 &&
          context.messageOptions.current.guestList.length === 0
        ) {
          audio = "sorry";
          header = "Có gì đó sai sai!";
          mode = 2.2;
        }
        PlayAudio(audio);
        setTimeout(() => {
          dispatch.setMessageOptions({
            ...context.messageOptions.current,
            mode,
            header,
          });
          dispatch.setShowMsgBox(true); // re-show predictions(switch to mode 2)
        }, 550);
        setTimeout(() => {
          console.log('run hand tracking')
          dispatch.setStopCheckHand(false)
          dispatch.setBreakPermission(true);
        }, 2000);
      }, 1100);
    }
  }, [times]);

  useEffect(() => {
    if (show) {
      ClearSleepTime(context.sleepIdRef.current); // wake up
      let count = props.times - 1;
      var intervalId = setInterval(() => {
        if (count > 0) {
          setTimes(count); // start count down
          count--;
        } else {
          clearInterval(intervalId);
          setCountDownShow(false); // clear count down
          setTimeout(() => setTimes(props.times), 1000);
        }
      }, 1100);
    }
  }, [show]);

  return (
    <div>
      {
        <Backdrop
          open={show}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: "#00000099",
          }}
        >
          <p
            className="display-1 position-fixed top-50 start-50 translate-middle neonText"
            style={{ fontSize: 150 }}
          >
            {times}
          </p>
        </Backdrop>
      }
    </div>
  );
};

export default forwardRef(CountDown);
