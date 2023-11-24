import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import Model from "./model/Model";
import Osc from "./osc/Osc";
import {ajax} from "./tool/functions";


let video, canvas, modal, ctx, animation;
let model;
let osc;


function App() {
	const [modelName, setModelName]     = useState("face");
	const [isDetecting, setIsDetecting] = useState(false);
	const [modalExists, setModalExists] = useState(false);
	const [isOscOn, setIsOscOn]         = useState(false);
	const [userPort, setUserPort]       = useState(8000);
	const [ipAddress, setIpAddress]     = useState()
	const size                          = useWindowSize();

	if (isOscOn && !osc) {
		osc = new Osc();
	}

	useEffect(() => {
		ajax("get", "https://api.ipify.org?format=json")
				.then(res => setIpAddress(res.ip));

		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			modal  = document.getElementById("modal");
			canvas = document.getElementById("render");
			setCanvas(canvas, video);

			window.addEventListener("resize", () => {
				setCanvas(canvas, video);
			})

			ctx = canvas.getContext("2d");

			model = new Model(video, ctx);
		});
	}, []);

	const start = () => {
		model.setModel(modelName);
		runDetection();

		setIsDetecting(true);

		handleModal();
		canvas.classList.remove("hidden");
	};

	const runDetection = () => {
		const rawData = model.getData();

		if (isOscOn) {
			const normData = model.processData(rawData);
			model.sendData(normData, osc);
		}
		model.displayData(rawData);

		animation = window.requestAnimationFrame(runDetection);
	}

	const stop = () => {
		canvas.classList.add("hidden");

		if (isOscOn && osc) {
			osc.stop();
			osc = undefined;
		}

		cancelAnimationFrame(animation);
		setIsDetecting(false);
	};

	const handleModal = () => {
		if (!modalExists) {
			modal.classList.remove("hidden");
			modal.classList.add("flex");
			setModalExists(true);
		}
		else {
			modal.classList.remove("flex")
			modal.classList.add("hidden");
			setModalExists(false);
		}
	}

	const isLandscape = size.height <= size.width;
	const ratio       = isLandscape ? size.width / size.height : size.height /
			size.width;

	// Hook
	function useWindowSize() {
		const [windowSize, setWindowSize] = useState({
			width : undefined,
			height: undefined,
		});

		useEffect(() => {
			function handleResize() {
				setWindowSize({
					width : window.innerWidth,
					height: window.innerHeight,
				});
			}

			window.addEventListener("resize", handleResize);

			handleResize();

			return () => window.removeEventListener("resize", handleResize);
		}, []);

		return windowSize;
	}

	const setCanvas = (canvas, video) => {
		canvas.width      = video.width;
		canvas.height     = video.height;
		canvas.style.left = video.offsetLeft + "px";
		canvas.style.top  = video.offsetTop + "px";
	}


	return (
			<div className="App">

				<div id="burger-menu" onClick={handleModal}>
					<span className={`burger ${modalExists ? "cross" : "line"}`}></span>
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
					<div className="port_container">
						<label>UDP Port:</label>
						<input value={userPort}/>
					</div>
					<div id="toggle">
						<label htmlFor={"toggle-osc"}>Send
							<input className="check" type={"checkbox"} name={"toggle-osc"} id={"toggle-osc"}
							       onChange={e => setIsOscOn(e.target.checked)}/>
						</label>
					</div>
					<div className="landmarks_container">
						<p>Landmarks</p>
						<div className="landmarks">
							<div>
								<input className="check" type="checkbox"/>
								<label>Right Eye</label>
							</div>
							<div>
								<input className="check" type="checkbox"/>
								<label>Left Eye</label>
							</div>
							<div>
								<input className="check" type="checkbox"/>
								<label>Lips</label>
							</div>
						</div>
					</div>
					<div className="warning">
						<p>Press the button below to start detection. Press it again to stop the
							detection.</p>
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
					<Webcam
							id="video"
							height={size.height}
							width={size.width}
							videoConstraints={{facingMode: "user", aspectRatio: ratio}}
							audio={false}
							ref={camera => window.camera = camera}/>
					<canvas id="render" className="hidden canvas"/>
				</div>

				<div className="button">
					<button onClick={!isDetecting ? start : stop}
					        style={{backgroundColor: !isDetecting ? "red" : "#23E95A"}}>
					</button>
				</div>

				<div className="infos">
					<div className="IP">
						<p>IP :</p>
						<p>{ipAddress}</p>
					</div>
					<div className="UDP">
						<p>UDP Port :</p>
						<p>{userPort}</p>
					</div>
				</div>
			</div>
	);
}

export default App;
