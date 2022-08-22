import React, { useEffect, useRef, useState } from "react";
import "./test.css";
import MessageBox from "./MessageBox";

const Test = () => {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(true);
  const messageOptions = useRef({
    header: "Xin chao",
    body: "Chao mung ban den voi UIT, minh la UIT-Photoboter!",
    closeInSecs: 60,
    userInfo: []
  });
  const msgTimeOutId = useRef(null);
  const ToggleToast = () => {
    setShow(!show);
  };

  useEffect(() => {
    canvasRef.current.height = 810;
    canvasRef.current.width = 1080;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let banner = new Image();
    banner.src = require("./image/Banner.png");
    banner.onload = () => {
      ctx.drawImage(banner, 0, 0, 1080, 810);
    };
  }, []);

  useEffect(() => {
    // if (show === true) {
    //   msgTimeOutId.current = setTimeout(() => {
    //     setShow(!show);
    //   }, 1000 * messageOptions.current.closeInSecs);
    // } else {
    //   setTimeout(() => {
    //     messageOptions.current = {
    //       ...messageOptions.current,
    //       header: "Xin chao",
    //       body: "Chao mung ban den voi UIT, minh la UIT-Photoboter!!!",
    //     };
    //     setShow(!show);
    //   }, 1000);
    //   if (msgTimeOutId.current !== null) {
    //     clearTimeout(msgTimeOutId.current);
    //     msgTimeOutId.current = null;
    //   }
    // }
  }, [show]);

  return (
    <div id="App">
      <button onClick={ToggleToast} style={{ position: "absolute", top: 0, left: 0 }}>
        Show
      </button>
      <div id='bot-message'>
        <img src={require("./image/robot.png")} id="robot" />

        <MessageBox
          show={show}
          header={messageOptions.current.header}
          ToggleToast={ToggleToast}
          body={messageOptions.current.body}
          userInfo={messageOptions.current.userInfo}
        />
      </div>
      <canvas
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default Test;
