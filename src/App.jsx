import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";

const OSC = require("osc-js")


let selectedModel;
let video, canvas, ctx, animation;
let dataToSend = [];
let message;

let isFace, modelKey, normData;


function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");

	const osc = new OSC();
	osc.open();

	useEffect(() => {
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			canvas            = document.getElementById("render");
			canvas.width      = video.videoWidth;
			canvas.height     = video.videoHeight;
			canvas.style.left = video.offsetLeft + "px";
			canvas.style.top  = video.offsetTop + "px";

			ctx         = canvas.getContext("2d");
			models.draw = new DrawingUtils(ctx);
		});
	}, []);

	const start = () => {
		selectedModel = models[modelName];

		runDetection();

		setIsDetecting(1);

		canvas.classList.remove("hidden");
	};

	const runDetection = () => {
		normData = [];

		setData();

		processData();

		/* TODO: Send data through OSC
		Example:
		const message = new OSC.Message("/model/landmark/coordinates", value);
		osc.send(message);
		*/
		sendMessage();

		displayData();

		// animation = window.requestAnimationFrame(runDetection);
	}

	const setData = () => {
		const startTimeMs = performance.now();
		let lastVideoTime = -1;

		if (lastVideoTime !== video.currentTime) {
			selectedModel.data = selectedModel.model.detectForVideo(video, startTimeMs);
			lastVideoTime      = video.currentTime;
		}
	};

	const processData = () => {
		const rawData = selectedModel.data;
		isFace        = "faceLandmarks" in rawData;
		modelKey      = isFace ? "faceLandmarks" : "landmarks";

		rawData[modelKey].forEach((landmarks, i) => {
			landmarks.forEach((coordinates, j) => {
				const landmarkData = {
					[modelName]: {},
				};

				const landmarkName = isFace ? "face" : selectedModel.namedLandmarks[j];
				const data         = {
					[landmarkName]: {
						"x": coordinates.x,
						"y": coordinates.y,
						"z": coordinates.z,
					},
				}

				if (modelName === "hand") {
					let handName                      = rawData.handedness[i][0].categoryName.toLowerCase();
					landmarkData[modelName][handName] = data;
				}
				else {
					landmarkData[modelName] = data
				}
				normData.push(landmarkData);
			})
		})
	}

	const sendMessage = () => {
		for (let i = 0; i < dataToSend.length; i++) {
			message = new OSC.Message("/model/landmark/coordinates", dataToSend[i]);
			osc.send(message);
		}
		dataToSend = [];
	}


	const displayData = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (const landmark of selectedModel.data[modelKey]) {
			for (let i = 0; i < selectedModel.categories.length; i++) {
				const category     = selectedModel.categories[i];
				const landmarkName = category.name;
				const color        = category.color;
				const lineWidth    = category.lineWidth;

				models.draw.drawConnectors(
						landmark,
						selectedModel.landmarks[landmarkName],
						{
							color    : color,
							lineWidth: lineWidth,
						},
				);

				if (!isFace) {
					models.draw.drawLandmarks(landmark);
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
