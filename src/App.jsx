import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import models from "./models/Models";
import OSC from "osc-js";


let video, canvas,modal, ctx, animation;
let model, modelKey, isFace;


function App() {
	const [isDetecting, setIsDetecting] = useState(false);
	const [modelName, setModelName]     = useState("face");
	const [showModal, setShowModal]     = useState(false);
	const osc = new OSC({plugin: new OSC.WebsocketClientPlugin()});
	osc.open();

	useEffect(() => {
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			modal             = document.getElementById("modal");
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
		modal.classList.remove("flex");
		modal.classList.add("hidden");
		setShowModal(false);
		selectedModel = models[modelName];

		runDetection(model);

		setIsDetecting(true);

		canvas.classList.remove("hidden");
	};

	const runDetection = (model) => {
		const rawData = getData(model.model);

		if (rawData[modelKey].length > 0) {
			const data = processData(rawData);

			sendData(data);
			displayData(rawData);
		}
		else {
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Keep landmarks off the canvas
		}

		animation = window.requestAnimationFrame(runDetection);
	}

	const getData = () => {
		const startTimeMs = performance.now();
		let lastVideoTime = -1;
		let rawData;

		if (lastVideoTime !== video.currentTime) {
			rawData       = model.model.detectForVideo(video, startTimeMs);
			isFace        = "faceLandmarks" in rawData;
			modelKey      = isFace ? "faceLandmarks" : "landmarks";
			lastVideoTime = video.currentTime;
		}
		return rawData;
	};

	const processData = (rawData) => {
		const landmarkNameIndexes = Object.entries(model.namedLandmarks);
		let normData              = [];

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
		setIsDetecting(false);
	};

	const modalShow = () => {
		if (showModal === false) {
			setShowModal(true)
			modal.classList.remove("hidden");
			modal.classList.add("flex")
		}
		else {
			setShowModal(false);
			modal.classList.remove("flex")
			modal.classList.add("hidden");
		}


	}

	const setBackground = () => {
		if (isDetecting === false) {
			return ("red");
		}
		else {
			return ("#23E95A");
		}
	};


	return (
			<div className="App">

				<div id="burger-menu" onClick={modalShow}>
					<span className={`burger ${showModal ? 'cross' : 'line'}`}></span>
				</div>

				<div id="modal" className="hidden">
					<div className="model_container">
						<label>Model :</label>
						<select onChange={(e) => {
							setModelName(e.target.value);
						}} value={modelName}>
							<option value={"pose"}>Pose</option>
							<option value={"face"}>Face</option>
							<option value={"hand"}>Hand</option>
						</select>
					</div>
					<div className="warning">
						<p>Press the button below to start detection. Press it again to stop the detection.</p>
						<svg width="70" height="28" viewBox="0 0 70 28" fill="none"
						     xmlns="http://www.w3.org/2000/svg">
							<line y1="-3" x2="41.5404" y2="-3"
							      transform="matrix(0.829259 0.558864 -0.829259 0.558864 0 4)" stroke="black"
							      strokeWidth="6"/>
							<line y1="-3" x2="41.5404" y2="-3"
							      transform="matrix(0.829259 -0.558864 0.829259 0.558864 35.5522 28)"
							      stroke="black" strokeWidth="6"/>
						</svg>
					</div>
				</div>


				<div className="webcam_container">
					<Webcam id="video" audio={false} />
					<canvas id="render" className="hidden canvas"/>
				</div>

				{/* TODO: Add containers based on the element's function */}
				<div className="button">
					<button onClick={!isDetecting ? start : stop} style={{backgroundColor: setBackground()}}>

					</button>
				</div>

				<div className="infos">
					<div className="IP">
						<p>IP :</p>
						<p>86.212.113.159</p>
					</div>
					<div className="UDP">
						<p>UDP Port :</p>
						<p>8000</p>
					</div>
				</div>
			</div>
	);
}

export default App;
