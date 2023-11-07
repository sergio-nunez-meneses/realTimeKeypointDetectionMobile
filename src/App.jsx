import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";

const OSC = require("osc-js")

let selectedModel;
let video, canvas, ctx, animation;
let dataToSend = [];
let message;

function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");
	const osc                           = new OSC({plugin: new OSC.WebsocketClientPlugin()});
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
		sendMessage();


		displayData();

		animation = window.requestAnimationFrame(runDetection);
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
				let processedData = {};
				processedData     = `${unprocessedData.handedness[i][0].displayName} ${selectedModel.landmarkName[j]} x: ${hand[j].x}, y: ${hand[j].y}, z: ${hand[j].z}`

				// console.log(processedData);
				dataToSend.push(processedData);
			})
			console.log(dataToSend);
		})
		// console.log(dataToSend);
	}

	const processPoseData = () => {
		const unprocessedData = selectedModel.data;
		if (unprocessedData.landmarks[0] !== undefined) {

			const landmarks = unprocessedData.landmarks[0];
			for (let i = 0; i < landmarks.length; i++) {
				let processedData = {}
				processedData     = `${selectedModel.landmarkName[i]} x: ${landmarks[i].x}, y: ${landmarks[i].y}, z: ${landmarks[i].z}`;

				dataToSend.push(processedData);
			}

			console.log(unprocessedData);
		}
	};

	const processFaceData = () => {
		let processedData     = {};
		const unprocessedData = selectedModel.data;
		if (unprocessedData.faceBlendshapes[0] !== undefined) {
			const blendShapes = unprocessedData.faceBlendshapes[0].categories;
			const landmarks   = unprocessedData.faceLandmarks[0];
			// const arrays = selectedModel.array;
			// console.log(unprocessedData)
			// console.log(blendShapes.categories);


			blendShapes.forEach((blendShape) => {
				processedData.blendshapes = `${blendShape.categoryName}, ${blendShape.score}`;
				dataToSend.push(processedData.blendshapes);

			})


			landmarks.forEach((landmark, index) => {
				processedData.coordinates = `${index}, x: ${landmark.x}, y: ${landmark.y}, z: ${landmark.z}`;

				dataToSend.push(processedData.coordinates);

			})
			console.log(dataToSend);
		}
	}

	const sendMessage = () => {
		for (let i = 0; i < dataToSend.length; i++) {
			message = new OSC.Message(`/model/landmark/xyz`, dataToSend[i]);
			osc.send(message);
		}
		dataToSend = [];
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

				<div className="modal">
					<div className="model">
						<label>Model :</label>
						<select onChange={(e) => {
							setModelName(e.target.value);
						}} value={modelName}>
							<option value={"pose"}>Pose</option>
							<option value={"face"}>Face</option>
							<option value={"hand"}>Hand</option>
						</select>
					</div>
				</div>


				<div className="webcam_container">
					<Webcam id="video"/>
					<canvas id="render" className="hidden canvas"/>
				</div>

				{/* TODO: Add containers based on the element's function */}
				<div className="button">
					<button onClick={!isDetecting ? start : stop}>
						{!isDetecting ? "Start" : "Stop"} detection
					</button>
				</div>
			</div>
	);
}

export default App;
