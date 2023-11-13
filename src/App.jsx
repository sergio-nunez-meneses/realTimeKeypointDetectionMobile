import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import Model from "./model/Model";
import Osc from "./osc/Osc";


let video, canvas, ctx, animation;
let model;


function App() {
	const [isDetecting, setIsDetecting] = useState(0);
	const [modelName, setModelName]     = useState("face");

	// TODO: Replace with user data
	const userPort = 8000;
	const osc      = new Osc(userPort);

	useEffect(() => {
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			canvas            = document.getElementById("render");
			canvas.width      = video.videoWidth;
			canvas.height     = video.videoHeight;
			canvas.style.left = video.offsetLeft + "px";
			canvas.style.top  = video.offsetTop + "px";

			ctx = canvas.getContext("2d");

			model = new Model(video, ctx);
		});
	}, []);

	const start = () => {
		model.setModel(modelName);

		runDetection();

		setIsDetecting(1);

		canvas.classList.remove("hidden");
	};

	const runDetection = () => {
		const rawData  = model.getData();
		const normData = model.processData(rawData);

		model.setData(normData, osc);
		model.displayData(rawData);

		animation = window.requestAnimationFrame(runDetection);
	}

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
