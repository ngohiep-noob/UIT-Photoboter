import React, { useContext, useEffect, useState } from "react";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import HandleRecognize from "./HandleRecognize";

const SnapShot = (props) => {
  const [times, setTimes] = useState(props.times);

  const context = useContext(ProcessContextState);
  const dispatch = useContext(ProcessContextDispatch);

  const CanvasToFile = () => {
    const canvas = document.querySelector("canvas");
    // const imgFile = dataURLtoFile(canvas.toDataURL("image/jpeg"), "image.jpeg");
    return canvas.toDataURL("image/jpeg");
    // return imgFile;
  };

  useEffect(() => {
    // countdown before shotting.
    let count = props.times - 1;
    var intervalId = setInterval(() => {
      if (count > 0) {
        setTimes(count);
        count--;
      } else {
        dispatch.setState((prev) => ({
          ...prev,
          isCountingDown: false,
        }));
        clearInterval(intervalId);
      }
    }, 1100);
  }, []);

  useEffect(() => {
    if (times === 1) {
      //send mail
      setTimeout(() => {
        dispatch.setFinalImageRef(CanvasToFile());
        context.modalTrigger.show();
      }, 1100);
    } else if (times === 4) {
      //call api recognize
      const imgDataURL = context.webCamRef.current.getScreenshot();
      dispatch.setRecogizedImageRef(imgDataURL);
      HandleRecognize(imgDataURL, dispatch);
    }
  }, [times]);

  useEffect(() => {
    console.log("re-render countdown component!");
  });

  return (
    <div id="countdown-backdrop">
      <p
        className="display-1 position-fixed top-50 start-50 translate-middle neonText"
        style={{ fontSize: 150 }}
      >
        {times}
      </p>
    </div>
  );
};

export default SnapShot;
