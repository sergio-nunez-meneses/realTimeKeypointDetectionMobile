import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";

let selectedModel;
let video, canvas, ctx, animation;
let dataToSend = []


function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");

	// const osc = new OSC();
	// osc.open();

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
		setData();

		// TODO: Process data
		if (modelName === "hand") {
			processHandData();
		}
		else if (modelName === "pose") {
			processPoseData();
		}
		else if (modelName === "face") {
			processFaceData()
		}
		/* TODO: Send data through OSC
		Example:
		const message = new OSC.Message("/model/landmark/coordinates", value);
		osc.send(message);
		*/

		// displayData();

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

	const processHandData = () => {
		const unprocessedData = selectedModel.data;
		const landmarks       = unprocessedData.landmarks;
		landmarks.forEach((hand, i) => {
			hand.forEach((coordinates, j) => {
				let processedData          = {};
				processedData.handName     = unprocessedData.handedness[i][0].displayName;
				processedData.landmarkName = selectedModel.landmarkName[j];
				processedData.coords       = "xyz" + " " + [hand[j].x, hand[j].y, hand[j].z];
				// console.log(processedData);
				dataToSend.push(processedData);
			})
			console.log(dataToSend);
		})
		// console.log(dataToSend);
	}

	const processPoseData = () => {
		let dataToSend        = [];
		const unprocessedData = selectedModel.data;
		const landmarks       = unprocessedData.landmarks[0];
		for (let i = 0; i < landmarks.length; i++) {
			let processedData          = {}
			processedData.landmarkName = selectedModel.landmarkName[i];
			processedData.coords       = [landmarks[i].x, landmarks[i].y, landmarks[i].z]
			dataToSend.push(processedData);
		}

		console.log(dataToSend);
	};

	const processFaceData = () => {
		let dataToSend = [];
		const unprocessedData = selectedModel.data;
		console.log(unprocessedData);

	}


	const displayData = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const isFace  = "faceLandmarks" in selectedModel.data;
		const dataKey = isFace ? "faceLandmarks" : "landmarks";

		for (const landmark of selectedModel.data[dataKey]) {
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
