import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";
import OSC from "osc-js";


let video, canvas, ctx, animation;
let model, modelKey, isFace;


function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");

	const osc = new OSC({plugin: new OSC.WebsocketClientPlugin()});
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
		model = models[modelName];

		runDetection(model);

		setIsDetecting(1);

		canvas.classList.remove("hidden");
	};

	const runDetection = (model) => {
		const rawData = getData(model.model);
		const data    = processData(rawData);

		sendData(data);

		displayData(rawData);

		animation = window.requestAnimationFrame(runDetection);
	}

	const getData = () => {
		const startTimeMs = performance.now();
		let lastVideoTime = -1;
		let rawData;

		if (lastVideoTime !== video.currentTime) {
			rawData       = model.model.detectForVideo(video, startTimeMs);
			lastVideoTime = video.currentTime;
		}
		return rawData;
	};

	const processData = (rawData) => {
		const landmarkNameIndexes = Object.entries(model.namedLandmarks);
		let normData              = [];
		isFace                    = "faceLandmarks" in rawData;
		modelKey                  = isFace ? "faceLandmarks" : "landmarks";


		rawData[modelKey].forEach((landmarks, i) => {
			landmarks.forEach((coordinates, j) => {
				let modelNameKey, handName, landmarkData, landmarkName;

				if (modelName === "hand") {
					handName = rawData.handedness[i][0].categoryName.toLowerCase();
				}
				modelNameKey = modelName === "hand" ? `${handName}_${modelName}` : modelName;

				const landmarkInfo = landmarkNameIndexes.filter(
						nameIndexes => nameIndexes[1].includes(j));

				if (landmarkInfo.length > 0) {
					landmarkData = {
						[modelNameKey]: {},
					};

					landmarkInfo.forEach(info => {
						const name                 = info[0];
						const index                = info[1].indexOf(j);
						landmarkName               = isFace ? `${name}_${index}` : name;
						landmarkData[modelNameKey] = {
							[landmarkName]: {
								"x": coordinates.x,
								"y": coordinates.y,
								"z": coordinates.z,
							},
						}
					});
					normData.push(landmarkData);
				}
			})
		})
		return normData;
	}

	const sendData = (data) => {
		data.forEach(obj => {
			const objKey       = Object.keys(obj)[0];
			const modelNameKey = objKey.includes("hand") ? objKey.substring(0) : modelName;
			const landmark     = obj[modelNameKey];
			const landmarkName = Object.keys(landmark);
			const coordinates  = Object.values(landmark[landmarkName]).join(", ");
			const address      = `/${modelNameKey}/${landmarkName}/xyz`;
			const message      = new OSC.Message(address, coordinates);
			osc.send(message);
		})
	}


	const displayData = (data) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		data[modelKey].forEach(landmark => {
			model.connectorInfo.forEach(connector => {
				models.draw.drawConnectors(
						landmark,
						model.landmarks[connector.name],
						connector.style,
				);

				if (!isFace) {
					models.draw.drawLandmarks(landmark);
				}
			})
		})
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
