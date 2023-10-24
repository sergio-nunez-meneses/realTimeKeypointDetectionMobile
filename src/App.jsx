import faceLandmarker from "./faceLandmarker";
import poseLandmarker from "./poseLandmarker";
import handLandmarker from "./handLandmarker";
import { // TODO: FaceLandmarker should also be imported from ./faceLandmarker
	FaceLandmarker,
	DrawingUtils, // TODO: Check if DrawingUtils is the same for all the models
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
const OSC = require("osc-js"); // Or var osc = new OSC();

const videoBlendShapes = document.getElementById("video-blend-shapes");
let video, canvas, ctx, animation;

function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [nameModel, setNameModel]     = useState("Face");

	useEffect(() => {
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			canvas            = document.getElementById("render");
			ctx               = canvas.getContext("2d");
			canvas.width      = video.videoWidth;
			canvas.height     = video.videoHeight;
			canvas.style.left = video.offsetLeft + "px";
			canvas.style.top  = video.offsetTop + "px";
		});
	}, []);

	const startDetection = () => {
		if (nameModel === "Pose") {
			poseDetect();
		}
		else if (nameModel === "Face") {
			faceDetect();
		}
		else {
			handDetect();
		}

		setIsDetecting(1);

		canvas.classList.remove("hidden");
	};
	const faceDetect     = () => {
		let startTimeMs   = performance.now();
		let lastVideoTime = -1;
		let results;

		if (lastVideoTime !== video.currentTime) {
			results       = faceLandmarker.detectForVideo(video, startTimeMs);
			lastVideoTime = video.currentTime;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw landmarks on canvas
		const drawingUtils = new DrawingUtils(ctx);

		for (const landmarks of results.faceLandmarks) {
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_TESSELATION,
					{color: "#C0C0C070", lineWidth: 1},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
					{color: "#FF3030"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
					{color: "#FF3030"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
					{color: "#30FF30"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
					{color: "#30FF30"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
					{color: "#E0E0E0"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LIPS,
					{color: "#E0E0E0"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
					{color: "#FF3030"},
			);
			drawingUtils.drawConnectors(
					landmarks,
					FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
					{color: "#30FF30"},
			);
		}
		drawBlendShapes(videoBlendShapes, results.faceBlendshapes);

		animation = window.requestAnimationFrame(faceDetect);
	};

	const stopDetection = () => {
		canvas.classList.add("hidden");

		cancelAnimationFrame(animation);
		setIsDetecting(0);
	};

	const poseDetect = () => {
		const poseLandmarkerResult = poseLandmarker.detect(video);
		console.log(poseLandmarkerResult);
	};

	const handDetect = () => {
		const handLandmarkerResult = handLandmarker.detect(video);
		console.log(handLandmarkerResult);
	};

	const handleNameModelChange = (event) => {
		setNameModel(event.target.value);
	};

	function drawBlendShapes(el, blendShapes) {
		el = document.getElementById("el");
		if (!blendShapes.length) {
			return;
		}

		let htmlMaker = "";
		blendShapes[0].categories.map((shape) => (
			htmlMaker += `
        <li class="blend-shapes-item">
          <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
          <span class="blend-shapes-value" style="width: calc(${+shape.score * 100}% - 120px)">
						${(+shape.score).toFixed(4)}</span>
        </li>
      `
		));
		el.innerHTML = htmlMaker;
	}
  const osc = new OSC({ plugin: new OSC.WebsocketClientPlugin({ url: 'ws://localhost:8080' }) });
  osc.open();
  osc.on('open', () => {
    console.log('Le client OSC est prêt à envoyer des messages.');
  });

  const testMessage = () => {
    const message = new OSC.Message('/test', Math.floor(Math.random() * 6));
    osc.send(message);
  };

	return (
			<div className="App">
				<div>
					<label>Model :</label>
					<select onChange={handleNameModelChange} value={nameModel}>
						<option value={"Pose"}>Pose</option>
						<option value={"Face"}>Face</option>
						<option value={"Hand"}>Hand</option>
					</select>
				</div>
				{/* TODO: Add containers based on the element's function */}
				<button onClick={!isDetecting ? startDetection : stopDetection}>
					{!isDetecting ? "Start" : "Stop"} detection</button>

				<Webcam id="video"/>
				<canvas id="render" className="hidden canvas"/>

				{nameModel === "Face" ? (
						<div className="blend-shapes">
							<ul className="blend-shapes-list" id="video-blend-shapes"></ul>
						</div>
				) : (
						<span></span>
				)}
				<span id="el"></span>
			</div>
	);
}

export default App;
