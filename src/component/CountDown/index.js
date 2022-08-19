import React, { useContext, useEffect, useState } from "react";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import HandleRecognize from "./HandleRecognize";
import { ClearSleepTime } from "../../service/RedirectPage";

const SnapShot = (props) => {
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

  useEffect(() => {
    console.log("countdown render!");
    // countdown before shotting.
    dispatch.addContextDispatch(setCountDownShow, "setCountDownShow");
  }, []);

  useEffect(() => {
    if (times === 1) {
      //send mail
      setTimeout(() => {
        dispatch.setFinalImageRef(CanvasToFile());
        context.ToggleModal(true);
      }, 1100);
    } else if (times === 4) {
      //call api recognize
      const imgDataURL = context.webCamRef.current.getScreenshot();
      dispatch.setRecogizedImageRef(imgDataURL);
      HandleRecognize(imgDataURL, dispatch);
    }
  }, [times]);

  useEffect(() => {
    if(show) {
      ClearSleepTime(context.sleepIdRef.current)
      let count = props.times - 1;
      var intervalId = setInterval(() => {
        if (count > 0) {
          setTimes(count);
          count--;
        } else {
          setCountDownShow(false);
          clearInterval(intervalId);
        }
      }, 1100)
    }
  }, [show]) 

  useEffect(() => {
    console.log("countdown re-render!");
  });

  return (
    <div>
      {show && (
        <div id="countdown-backdrop">
          <p
            className="display-1 position-fixed top-50 start-50 translate-middle neonText"
            style={{ fontSize: 150 }}
          >
            {times}
          </p>
        </div>
      )}
    </div>
  );
};

export default SnapShot;
