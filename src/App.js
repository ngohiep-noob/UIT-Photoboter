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
import Toast from "./component/Toast";
import MessageBox from "./component/MessageBox";
import { SetSleepTime } from "./service/RedirectPage";

export const ProcessContextState = createContext();
export const ProcessContextDispatch = createContext();

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
  const messageOptions = useRef({
    header: "Xin chào",
    body:
      "Mình là UIT-Photoboter! Hãy lại gần camera và giơ bàn tay lên để  chụp hình nhé!",
    mode: 1, // mode 1: show notification(Ex. hello world) | mode 2: show predictions list
    closeInSecs: 60,
    userList: [],
  });

  const [showMsgBox, setShowMsgBox] = useState(true);
  const ToggleMessageBox = () => {
    // open or close
    setShowMsgBox(!showMsgBox);
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
      spinnerRef.current.toggleSpinner();
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasCtx.drawImage(
      document.getElementById("img-frame"),
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    fiveTipsUpRef.current = isFiveTipsUp(
      results.multiHandLandmarks,
      canvasRef.current.width,
      canvasRef.current.height
    );

    if (fiveTipsUpRef.current && !isHandlingShooting.current) {
      isHandlingShooting.current = true;
      CountDownRef.current.setCountDownShow(true);
    }

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }
    }
    canvasCtx.restore();
  }

  const SetMsgBoxAndShow = (msgOptions, delay) => {
    if (showMsgBox === false) {
      messageOptions.current = msgOptions;
      setTimeout(() => {
        setShowMsgBox(true);
      }, delay);
    }
  };

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

  useEffect(() => {
    if (showMsgBox === false) {
      if (messageOptions.current.mode === 2) {
        sleepIdRef.current = SetSleepTime(300);
        // close from mode 2(predictions) ==> refresh session
        SetMsgBoxAndShow(
          {
            header: "Cảm ơn bạn nhé!",
            body: "Hãy chờ trong giây lát cho lần sử  dụng tiếp theo nhé!",
            mode: 1,
            closeInSecs: 60,
            userList: [],
          },
          650
        );
      }
      // user close welcome statement
      if (
        messageOptions.current.mode === 1 &&
        isHandlingShooting.current === false
      ) {
        SetMsgBoxAndShow(
          {
            ...messageOptions.current,
            header: "Xin chào!",
            body:
              "Mình là UIT-Photoboter! Hãy lại gần camera và giơ bàn tay lên để  chụp hình nhé!",
          },
          550
        );
      }
    }

    if (showMsgBox === true) {
      if (
        messageOptions.current.mode === 1 &&
        messageOptions.current.header === "Cảm ơn bạn nhé!"
      ) {
        // finish session ==> ready for new session in 5s
        setTimeout(() => {
          isHandlingShooting.current = false;
          console.log("refresh session");
          setShowMsgBox(false);
        }, 5000);

        // re-show welcome statement after complete session
        SetMsgBoxAndShow(
          {
            ...messageOptions.current,
            header: "Xin chào!",
            body:
              "Mình là UIT-Photoboter! Hãy lại gần camera và giơ bàn tay lên để  chụp hình nhé!",
            userList: [],
            mode: 1,
          },
          5000 + 650
        );
      }
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
  });
  const dispatch = {
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
  };

  return (
    <ProcessContextState.Provider value={context}>
      <ProcessContextDispatch.Provider value={dispatch}>
        <div id="App">
          {/* video input */}
          <Webcam
            ref={webCamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            style={{ visibility: "hidden", position: "absolute" }}
          />
          <div id="bot-message">
            <img src={require("./dev/image/robot.png")} id="robot" />

            <MessageBox
              show={showMsgBox}
              header={messageOptions.current.header}
              ToggleToast={ToggleMessageBox}
              body={messageOptions.current.body}
              mode={messageOptions.current.mode}
              userList={messageOptions.current.userList}
            />
          </div>
          {/* canvas output */}
          <canvas ref={canvasRef}></canvas>

          {<Spinner ref={spinnerRef} />}

          {<CountDownScreen times={5} ref={CountDownRef} />}

          {<Toast />}
        </div>
      </ProcessContextDispatch.Provider>
    </ProcessContextState.Provider>
  );
}

export default App;
