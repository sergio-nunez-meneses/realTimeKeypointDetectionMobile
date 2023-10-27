import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";
import OSC from "osc-js";

let selectedModel;
let video, canvas, ctx;
let animation, drawingUtils;

function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");

	// const osc = new OSC();
	// osc.open();

	useEffect(() => {
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			canvas            = document.getElementById("render");
			ctx               = canvas.getContext("2d");
			drawingUtils      = new DrawingUtils(ctx);
			canvas.width      = video.videoWidth;
			canvas.height     = video.videoHeight;
			canvas.style.left = video.offsetLeft + "px";
			canvas.style.top  = video.offsetTop + "px";
		});
	}, []);

	const start = () => {
		selectedModel = models[modelName];

		runDetection();

		setIsDetecting(1);

		canvas.classList.remove("hidden");
	};

	const runDetection = () => {
		const data = setData();

		// TODO: Process data

		/* TODO: Send data through OSC
		Example:
		const message = new OSC.Message("/model/landmark/coordinates", value);
		osc.send(message);
		*/

		displayData(data);

		animation = window.requestAnimationFrame(runDetection);
	}

	const setData = () => {
		let startTimeMs   = performance.now();
		let lastVideoTime = -1;
		let results;

		if (lastVideoTime !== video.currentTime) {
			results       = selectedModel.model.detectForVideo(video, startTimeMs);
			lastVideoTime = video.currentTime;
		}

		return results;
	};

	const displayData = (data) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let key = "landmarks" in data ? "landmarks" : "faceLandmarks";

		for (const landmark of data[key]) {
			const color = selectedModel["color"];

			for (let i = 0; i < selectedModel["categories"].length; i++) {
				let landmarkName = selectedModel["categories"][i];

				drawingUtils.drawConnectors(
						landmark,
						selectedModel.landmarks[landmarkName],
						{color, lineWidth: 0.5},
				);

				if (modelName !== "face") {
					drawingUtils.drawLandmarks(landmark);
				}
			}
		}
	};

	const stop = () => {
		canvas.classList.add("hidden");

		cancelAnimationFrame(animation);
		setIsDetecting(0);
	};

	return (
			<div className="App">
				<div>
					<label>Model :</label>
					<select onChange={(e) => {
						setModelName(e.target.value);
					}} value={modelName}>
						<option value={"pose"}>Pose</option>
						<option value={"face"}>Face</option>
						<option value={"hand"}>Hand</option>
					</select>
				</div>

				{/* TODO: Add containers based on the element's function */}
				<button onClick={!isDetecting ? start : stop}>
					{!isDetecting ? "Start" : "Stop"} detection
				</button>

				<Webcam id="video"/>
				<canvas id="render" className="hidden canvas"/>

				{/* <button id="send" onClick={testMessage}>Send</button> */}
			</div>
	);
}

export default App;
