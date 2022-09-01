import "./App.css";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import { useRef, useEffect, useState, createContext } from "react";
import React from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import isFiveTipsUp from "./service/CheckFingersUp";
import Spinner from "./component/Spinner/index";
import CountDownScreen from "./component/CountDown/index";
import MessageBox from "./component/MessageBox";
import { SetSleepTime } from "./service/RedirectPage";
import PlayAudio from "./util/PlayAudio";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Fab } from "@mui/material";
import CustomStepper from "./component/Stepper";

export const ProcessContextState = createContext();
export const ProcessContextDispatch = createContext();
const steps = [
  "1. Đưa bàn tay lên để chụp hình.",
  "2. Tạo dáng để chụp hình.",
  "3. Xem trước ảnh chụp.",
  "4. Xác nhận thông tin của bạn.",
  "5. Nhấn nút gửi mail.",
];
function App() {
  // DOM ref
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);
  const spinnerRef = useRef(null);
  const CountDownRef = useRef(null);
  // global variables
  const fiveTipsUpRef = useRef(false);
  const isHandlingShooting = useRef(false);
  const finalImageRef = useRef("");
  const recogizedImageRef = useRef("");
  const firstDrawRef = useRef(true);
  const sleepIdRef = useRef(null);
  const screenSize = useRef({
    width: 0,
    height: 0,
  });
  const stopCheckHandRef = useRef(false);
  const AutoCloseMsgBoxRef = useRef(true);
  const breakProcessRef = useRef(false);
  const messageOptions = useRef({
    header: "Xin chào",
    body:
      "Mình là UIT-Photoboter! Hãy lại gần camera và giơ bàn tay lên để  chụp hình nhé!",
    // mode 1: show notification | mode 2: show predictions list | mode 3: handle interception
    mode: 1,
    userList: [],
    guestList: [],
  });
  const breakPermission = useRef(true);
  const [showMsgBox, setShowMsgBox] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const SetMsgBoxAndShow = (msgOptions, delay = 400) => {
    if (showMsgBox === false) {
      messageOptions.current = msgOptions;
      setTimeout(() => {
        setShowMsgBox(true);
      }, delay);
    }
  };
  var camera = null;

  async function HandDetectionOnResults(results) {
    // console.log(screenSize.current)
    canvasRef.current.width = screenSize.current.width;
    canvasRef.current.height = screenSize.current.height;
    // console.log(webCamRef.current.video.videoWidth, webCamRef.current.video.videoHeight)
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    if (firstDrawRef.current) {
      firstDrawRef.current = false;
      console.log("first draw");
      PlayAudio("welcome");
      spinnerRef.current.toggleSpinner();
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    let img = results.image;
    if (finalImageRef.current !== "") {
      let finalImg = new Image();
      finalImg.src = finalImageRef.current;
      img = finalImg;
    }

    canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

    if (finalImageRef.current === "") {
      canvasCtx.drawImage(
        document.getElementById("img-frame"),
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }
    }

    if (stopCheckHandRef.current === false) {
      fiveTipsUpRef.current = isFiveTipsUp(
        results.multiHandLandmarks,
        canvasRef.current.width,
        canvasRef.current.height
      );
      // fiveTipsUpRef.current = true;
    } else {
      fiveTipsUpRef.current = false;
    }
    //process entry point
    if (fiveTipsUpRef.current && !isHandlingShooting.current) {
      isHandlingShooting.current = true;
      console.log("stop hand tracking");
      stopCheckHandRef.current = true;
      setActiveStep(1);
      CountDownRef.current.setCountDownShow(true);
    }

    if (
      showMsgBox === true &&
      fiveTipsUpRef.current &&
      isHandlingShooting.current &&
      messageOptions.current.mode === 2.1 &&
      breakPermission.current === true
    ) {
      console.log("interception!");
      AutoCloseMsgBoxRef.current = true;
      setShowMsgBox(false);
      breakPermission.current = false;
      // setTimeout(() => {
      //   console.log('close for interception')
      // }, 1000)
    }

    canvasCtx.restore();
  }

  useEffect(() => {
    const { innerWidth: w, innerHeight: h } = window;
    const minSize = Math.min(w, h);

    if (minSize === w) {
      screenSize.current.width = w;
      screenSize.current.height = (3 / 4) * w;
    } else {
      screenSize.current.height = h;
      screenSize.current.width = h * (4 / 3);
    }
    console.log("run hand tracking");
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(HandDetectionOnResults);

    if (
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null
    ) {
      camera = new cam.Camera(webCamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webCamRef.current.video });
        },
        width: 640,
        height: 480,
      });
    }
    sleepIdRef.current = SetSleepTime(300);
    camera.start();
  }, []);

  const FinishSession = (delay = 5000) => {
    // finish session ==> ready for new session in N(s)
    setActiveStep(0)
    setTimeout(() => {
      isHandlingShooting.current = false;
      console.log("refresh session");
      AutoCloseMsgBoxRef.current = true;
      finalImageRef.current = "";
      setShowMsgBox(false);
    }, delay);
  };

  useEffect(() => {
    if (showMsgBox === false) {
      // close by click X button
      // console.log(messageOptions.current.mode, AutoCloseMsgBoxRef.current)
      if (messageOptions.current.mode === 2.1 && !AutoCloseMsgBoxRef.current) {
        sleepIdRef.current = SetSleepTime(300);
        console.log("1");
        PlayAudio("thankyou");
        setActiveStep(0);
        SetMsgBoxAndShow(
          {
            header: "Cảm ơn bạn nhé!",
            body: "Hãy chờ trong giây lát cho lần sử  dụng tiếp theo nhé!",
            mode: 1,
            userList: [],
            guestList: [],
          },
          550
        );
        return;
      }
      // close automatically
      if (messageOptions.current.mode === 2.1 && AutoCloseMsgBoxRef.current) {
        PlayAudio("question");
        SetMsgBoxAndShow(
          {
            ...messageOptions.current,
            mode: 3,
            header: "Xin chào",
            body: "Có vẻ bạn muốn chụp hình lại phải hong?",
          },
          550
        );
      }
      // show welcome statement
      if (
        (messageOptions.current.mode === 1 &&
          isHandlingShooting.current === false) ||
        messageOptions.current.mode === 2.2
      ) {
        PlayAudio("welcome");
        SetMsgBoxAndShow(
          {
            ...messageOptions.current,
            header: "Xin chào!",
            body:
              "Mình là UIT-Photoboter! Hãy lại gần camera và giơ bàn tay lên để  chụp hình nhé!",
            mode: 1,
          },
          550
        );
        return;
      }
      if (messageOptions.current.mode === 3 && breakProcessRef.current) {
        sleepIdRef.current = SetSleepTime(300);
        breakProcessRef.current = false;
        setTimeout(() => {
          console.log("refresh session");
          AutoCloseMsgBoxRef.current = false;
          finalImageRef.current = "";
          isHandlingShooting.current = false;
        }, 2000);
        PlayAudio("instruction");
        setActiveStep(0);
        SetMsgBoxAndShow(
          {
            ...messageOptions.current,
            header: "Hãy vào vị trí!",
            body: "Giơ bàn tay lên để  chụp hình nhé!",
            mode: 1,
          },
          550
        );
      }
    }

    if (showMsgBox === true) {
      if (
        (messageOptions.current.mode === 1 &&
          messageOptions.current.header === "Cảm ơn bạn nhé!") ||
        messageOptions.current.mode === 2.2
      ) {
        FinishSession();
      }
      // if (
      //   // prevent auto close after cancel interception
      //   messageOptions.current.mode === 2.1 &&
      //   AutoCloseMsgBoxRef.current === false
      // ) {
      //   setTimeout(() => {
      //     AutoCloseMsgBoxRef.current = true;
      //   }, 10000);
      // }
    }
  }, [showMsgBox]);

  const context = useRef({
    isHandlingShooting,
    finalImageRef,
    sleepIdRef,
    webCamRef,
    recogizedImageRef,
    firstDrawRef,
    messageOptions,
    breakProcessRef,
    AutoCloseMsgBoxRef,
    stopCheckHandRef,
    breakPermission,
  });
  const dispatch = {
    setBreakPermission: (cur) => {
      context.current.breakPermission.current = cur;
    },
    setStopCheckHand: (cur) => {
      context.current.stopCheckHandRef.current = cur;
    },
    setIsHandlingShooting: (curVal) => {
      context.current.isHandlingShooting.current = curVal;
    },
    setFinalImageRef: (curVal) => {
      context.current.finalImageRef.current = curVal;
    },
    setRecogizedImageRef: (curVal) => {
      context.current.recogizedImageRef.current = curVal;
    },
    setSleepIdRef: (curVal) => {
      context.current.sleepIdRef.current = curVal;
    },
    setMessageOptions: (newVal) => {
      context.current.messageOptions.current = newVal;
    },
    setShowMsgBox: (val) => {
      setShowMsgBox(val);
    },
    FinishSessionAndNotification: FinishSession,
    setBreakProcessRef: (val) => {
      breakProcessRef.current = val;
    },
    setAutoCloseMsgBoxRef: (val) => {
      AutoCloseMsgBoxRef.current = val;
    },
    setActiveStep,
  };

  return (
    <ProcessContextState.Provider value={context}>
      <ProcessContextDispatch.Provider value={dispatch}>
        <div id="App">
          <CustomStepper steps={steps} activeStep={activeStep} />
          {/* video input */}
          <Webcam
            ref={webCamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            style={{ visibility: "hidden", position: "absolute" }}
          />
          <Fab
            variant="extended"
            color="primary"
            sx={{
              position: "absolute",
              top: "10px",
              left: "10px",
            }}
            href="http://map.mmlab.uit.edu.vn"
          >
            <ArrowBackIosNewIcon sx={{ mr: 1 }} />
            Quay lại
          </Fab>
          {/* canvas output */}
          <canvas ref={canvasRef}></canvas>
          <div id="bot-message">
            <img
              src={require("./dev/image/robot.png")}
              id="robot"
              alt="robot"
            />
            <MessageBox
              show={showMsgBox}
              SetMsgBoxAndShow={SetMsgBoxAndShow}
              messageOptions={messageOptions.current}
            />
          </div>
          {<Spinner ref={spinnerRef} />}

          {<CountDownScreen times={5} ref={CountDownRef} />}
        </div>
      </ProcessContextDispatch.Provider>
    </ProcessContextState.Provider>
  );
}

export default App;
