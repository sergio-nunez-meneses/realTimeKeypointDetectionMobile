import faceLandmarker from "./faceLandmarker";
import poseLandmarker from "./poseLandmarker";
import handLandmarker from "./handLandmarker";
import {
	FaceLandmarker,
	DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";

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
		cancelAnimationFrame(animation);
		setIsDetecting(0);

		canvas.classList.add("hidden");
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
		blendShapes[0].categories.map((shape) => {
			htmlMaker += `
              <li class="blend-shapes-item">
                <span class="blend-shapes-label">${
					shape.displayName || shape.categoryName
			}</span>
                <span class="blend-shapes-value" style="width: calc(${
					+shape.score * 100
			}% - 120px)">${(+shape.score).toFixed(4)}</span>
              </li>
            `;
		});

		el.innerHTML = htmlMaker;
	}

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
				{!isDetecting ? (
						<button onClick={startDetection}>Start detection</button>
				) : (
						<button onClick={stopDetection}>Stop detection</button>
				)}

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
