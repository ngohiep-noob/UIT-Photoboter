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
import Toast from "./component/Toast/index1";
import ModalToSendEmail from "./component/MailModal/index1";
import { ClearSleepTime, SetSleepTime } from "./service/RedirectPage";

export const ProcessContextState = createContext();
export const ProcessContextDispatch = createContext();

function App() {
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);
  const fiveTipsUpRef = useRef(false);
  const isHandlingShooting = useRef(false);
  const finalImageRef = useRef("");
  const recogizedImageRef = useRef("");
  const firstDrawRef = useRef(true);
  const sleepIdRef = useRef(null);
  const userPredictionRef = useRef([]);
  const screenSize = useRef({
    width: 0,
    height: 0,
  });
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
      context.current.setShowSpinner(false);
      context.current.SetContentAndShowToast({
        title: "Notifications",
        body: "👋 Welcome to UIT, I'm Photoboter🤖",
        time: "Just now",
      });
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
      context.current.setCountDownShow(true);
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
    console.log("app render!");
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
    console.log("sleeping...");
    camera.start();
  }, []);

  useEffect(() => {
    console.log("app re-render!");
  });

  const context = useRef({
    isHandlingShooting,
    finalImageRef,
    sleepIdRef,
    webCamRef,
    userPredictionRef,
    recogizedImageRef,
    firstDrawRef,
  });
  const dispatch = {
    addContextDispatch: (funct, fieldName) => {
      context.current[fieldName] = funct;
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
    setUserPredictionRef: (curVal) => {
      context.current.userPredictionRef.current = curVal;
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
            className={"position-fixed translate-middle top-50 start-50"}
          ></canvas>

          {<Spinner />}

          {<CountDownScreen times={5} />}

          {<Toast />}
          {<ModalToSendEmail />}
        </div>
      </ProcessContextDispatch.Provider>
    </ProcessContextState.Provider>
  );
}

export default App;
