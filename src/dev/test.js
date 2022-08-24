import React, { useEffect, useRef, useState } from "react";
import "./test.css";
import MessageBox from "./MessageBox";

const Test = () => {
  const canvasRef = useRef(null);
  const [show, setShow] = useState(true);

  const messageOptions = useRef({
<<<<<<< HEAD
    header: "Xin chào",
    body: "Chào mừng bạn đến với UIT, mình là Photobter!",
=======
    header: "Xin chào",
    body: "Chào mừng bạn đến với UIT, Mình là UIT-Photoboter!",
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
    closeInSecs: 60,
    userList: [
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      {
        name: "Ngo Duc Hoang Hiep",
        email: "hoanghiephai@gmail.com",
        avatar: 'https://i.stack.imgur.com/l60Hf.png'
      },
      
    ]
  });

<<<<<<< HEAD
  const msgTimeOutId = useRef(null);

  const ToggleToast = () => {
=======
  const ToggleMessageBox = () => { // open or close
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
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
<<<<<<< HEAD

      <button onClick={ToggleToast} style={{ position: "absolute" }}> Show </button>

      {/* Robot */}
      <img src={require("./image/robot.png")} id="robot" />

      {/*Message box  */}
      <MessageBox
        show={show} // show
        header={messageOptions.current.header}
        ToggleToast={ToggleToast} // function
        body={messageOptions.current.body}
        userInfo={messageOptions.current.userInfo}
      />

      {/* Banner */}
=======
      <button onClick={ToggleMessageBox} style={{ position: "absolute", top: 0, left: 0 }}>
        Show
      </button>
      <div id='bot-message'>
        <img src={require("./image/robot.png")} id="robot" />

        <MessageBox
          show={show}
          header={messageOptions.current.header}
          ToggleToast={ToggleMessageBox}
          body={messageOptions.current.body}
          userList={messageOptions.current.userList}
        />
      </div>
>>>>>>> c47c620d0b6b1f4a7b570c8248ab81108865a2c6
      <canvas
        ref={canvasRef}
      ></canvas>

    </div>
  );
};

export default Test;
