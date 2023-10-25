import { faceModel, faceLandmarks } from "./models/faceLandmarker";
import { poseModel, poseLandmarks } from "./models/poseLandmarker";
import { handModel, handLandmarks } from "./models/handLandmarker";
import { DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const OSC = require("osc-js");

let video, canvas, ctx;
let animation, drawingUtils;

function App() {
  const [isDetecting, setIsDetecting] = useState(0);
  const [nameModel, setNameModel] = useState("face");
  const models = {
    face: {
      model: faceModel,
      landmarks: faceLandmarks,
      categories: [
        "FACE_LANDMARKS_TESSELATION",
        "FACE_LANDMARKS_RIGHT_EYE",
        "FACE_LANDMARKS_RIGHT_EYEBROW",
        "FACE_LANDMARKS_LEFT_EYE",
        "FACE_LANDMARKS_LEFT_EYEBROW",
        "FACE_LANDMARKS_FACE_OVAL",
        "FACE_LANDMARKS_LIPS",
        "FACE_LANDMARKS_RIGHT_IRIS",
        "FACE_LANDMARKS_LEFT_IRIS",
      ],
      color: "#C0C0C070",
    },
    pose: {
      model: poseModel,
      landmarks: poseLandmarks,
      categories: ["POSE_CONNECTIONS"],
      color: "#00FF00",
    },
    hand: {
      model: handModel,
      landmarks: handLandmarks,
      categories: ["HAND_CONNECTIONS"],
      color: "#0000FF",
    },
  };
  const selectedModel = models[nameModel];

  useEffect(() => {
    video = document.getElementById("video");
    video.addEventListener("loadeddata", () => {
      canvas = document.getElementById("render");
      ctx = canvas.getContext("2d");
      drawingUtils = new DrawingUtils(ctx);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.style.left = video.offsetLeft + "px";
      canvas.style.top = video.offsetTop + "px";
    });
  }, []);

  const processModelLandmarks= ()=> {
    for (const category of selectedModel["categories"]) {
      const landmarks = selectedModel["landmarks"][category];
      const color = selectedModel["color"];
	//   console.log(landmarks)
	//   console.log(color)

      // Send landmark data through OSC
      //   const message = new OSC.Message("/model/landmark/coordinates", value);
      //   osc.send(message);

      drawingUtils.drawConnectors(landmarks, color);
    }
  }
  const startDetection = () => {
    let startTimeMs = performance.now();
    let lastVideoTime = -1;
    let results;

    // console.log(nameModel);
    if (lastVideoTime !== video.currentTime) {
      results = selectedModel.model.detectForVideo(video, startTimeMs);
      lastVideoTime = video.currentTime;
    }
    console.log(results);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    processModelLandmarks(results, nameModel, drawingUtils);
    setIsDetecting(1);
    canvas.classList.remove("hidden");
    animation = window.requestAnimationFrame(startDetection);
  };

  const stopDetection = () => {
    canvas.classList.add("hidden");
    cancelAnimationFrame(animation);
    setIsDetecting(0);
  };

  const handleNameModelChange = (event) => {
    setNameModel(event.target.value);
  };

  //   const osc = new OSC({
  //     plugin: new OSC.WebsocketClientPlugin({ url: "ws://localhost:8080" }),
  //   });
  //   osc.open();
  //   osc.on("open", () => {
  //     console.log("Le client OSC est prêt à envoyer des messages.");
  //   });

  //   const testMessage = () => {
  //     const message = new OSC.Message("/test", Math.floor(Math.random() * 6));
  //     osc.send(message);
  //   };

  return (
    <div className="App">
      <div>
        <label>Model :</label>
        <select onChange={handleNameModelChange} value={nameModel}>
          <option value={"pose"}>Pose</option>
          <option value={"face"}>Face</option>
          <option value={"hand"}>Hand</option>
        </select>
      </div>
      {/* TODO: Add containers based on the element's function */}
      <button onClick={!isDetecting ? startDetection : stopDetection}>
        {!isDetecting ? "Start" : "Stop"} detection
      </button>

      <Webcam id="video" />
      <canvas id="render" className="hidden canvas" />
      {/* <button id="send" onClick={testMessage}>
        Send
      </button> */}
    </div>
  );
}

export default App;
