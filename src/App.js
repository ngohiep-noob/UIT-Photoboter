import "./App.css";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import { useRef, useEffect, useState, createContext } from "react";
import React from "react";
import { Hands } from "@mediapipe/hands";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import isFiveTipsUp from "./service/CheckFingersUp";
import Spinner from "./component/Spinner/index";
import CountDownScreen from "./component/CountDown/index";
import Toast from "./component/Toast/index";
import ModalToSendEmail from "./component/MailModal/index";
import { ClearSleepTime, SetSleepTime } from "./service/RedirectPage";

export const ProcessContextState = createContext();
export const ProcessContextDispatch = createContext();
const bootstrap = require("bootstrap");

function App() {
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);
  const fiveTipsUpRef = useRef(false);
  const inProcessRef = useRef(false);
  const isHandlingShooting = useRef(false);
  const finalImageRef = useRef("");
  const recogizedImageRef = useRef('');
  const firstDrawRef = useRef(true);
  const sleepIdRef = useRef(null);
  const userPredictionRef = useRef([]);
  const screenSize = useRef({
    width: 0,
    height: 0,
  });
  var camera = null;

  const [state, setState] = useState({
    isLoading: true,
    isCountingDown: false,
    toastMessage: "",
  });

  async function HandDetectionOnResults(results) {
    // console.log(screenSize.current)
    canvasRef.current.width = screenSize.current.width;
    canvasRef.current.height = screenSize.current.height;
    // console.log(webCamRef.current.video.videoWidth, webCamRef.current.video.videoHeight)
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    if (firstDrawRef.current) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        toastMessage: "👋 Welcome to UIT, I'm Photoboter🤖",
      }));
      firstDrawRef.current = false;
      console.log("first draw");
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

    if (
      fiveTipsUpRef.current &&
      !inProcessRef.current &&
      !isHandlingShooting.current
    ) {
      console.log(state);
      isHandlingShooting.current = true;
      setState((prevState) => ({
        ...prevState,
        isCountingDown: true,
      }));
    }

    // console.log("take photo: ", fiveTipsUp);

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
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
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
    console.log("sleeping...");

    camera.start();
  }, []);

  useEffect(() => {
    inProcessRef.current = state.isCountingDown;
    if (!firstDrawRef.current) {
      ClearSleepTime(sleepIdRef.current);
      console.log("wake up");
    }
  }, [state.isCountingDown]);

  useEffect(() => {
    if (state.toastMessage !== "") {
      const toastTrigger = new bootstrap.Toast("#liveToast");
      toastTrigger.show();
    }
  }, [state.toastMessage]);

  useEffect(() => {
    console.log("re-render app component!");
    // console.log(state);
  });

  const context = {
    ...state,
    isHandlingShooting,
    finalImageRef,
    sleepIdRef,
    webCamRef,
    userPredictionRef,
    recogizedImageRef
  };
  const dispatch = {
    setState,
    setIsHandlingShooting: (curVal) => {
      isHandlingShooting.current = curVal;
    },
    setFinalImageRef: (curVal) => {
      finalImageRef.current = curVal;
    },
    setRecogizedImageRef: (curVal) => {
      recogizedImageRef.current = curVal;
    },
    setSleepIdRef: (curVal) => {
      sleepIdRef.current = curVal;
    },
    setUserPredictionRef: (curVal) => {
      userPredictionRef.current = curVal;
    },
  };

  return (
    <ProcessContextState.Provider value={context}>
      <ProcessContextDispatch.Provider value={dispatch}>
        <div id="App" style={{ height: "100vh" }}>
          {/* <h1 className="text-center col-12 mb-3">
            <span role="img" aria-label='icon'>🤖</span>
            UIT - Photoboter
          </h1> */}

          {/* video input */}
          <Webcam
            ref={webCamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            style={{ visibility: "hidden" }}
            className="position-absolute"
          />

          {/* canvas output */}
          <canvas
            ref={canvasRef}
            className={
              screenSize.current.width ===
              Math.min(window.innerWidth, window.innerHeight)
                ? "position-fixed translate-middle-y top-50"
                : "position-fixed translate-middle-x start-50"
            }
          ></canvas>

          {state.isLoading && <Spinner />}

          {state.isCountingDown && <CountDownScreen times={5} />}

          {
            <Toast
              header={"Notifications"}
              body={state.toastMessage}
              since={"Just now"}
            />
          }
          {<ModalToSendEmail />}
        </div>
      </ProcessContextDispatch.Provider>
    </ProcessContextState.Provider>
  );
}

export default App;
