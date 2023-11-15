import React, {useEffect, useState} from "react";
import Webcam from "react-webcam";
import Model from "./model/Model";
import Osc from "./osc/Osc";
import axios from 'axios';


let video, canvas, modal, ctx, animation;
let model;


function App() {
	const [isDetecting, setIsDetecting] = useState(false);
	const [modelName, setModelName]     = useState("face");
	const [showModal, setShowModal]     = useState(false);
	const [userPort, setUserPort]       = useState(8000);
	const [ipAddress, setIpAddress]     = useState()
	const size                          = useWindowSize();

	console.log(userPort)
	// TODO: Replace with user data
	const osc = new Osc(userPort);
	// osc.open();

	useEffect(() => {
		getIpClient();
		video = document.getElementById("video");
		video.addEventListener("loadeddata", () => {
			modal             = document.getElementById("modal");
			canvas            = document.getElementById("render");
			canvas.width      = video.width;
			canvas.height     = video.height;
			canvas.style.left = video.offsetLeft + "px";
			canvas.style.top  = video.offsetTop + "px";

			window.addEventListener("resize", () => {
				canvas.width      = video.width;
				canvas.height     = video.height;
				canvas.style.left = video.offsetLeft + "px";
				canvas.style.top  = video.offsetTop + "px";
			})

			ctx = canvas.getContext("2d");

			model = new Model(video, ctx);
		});
	}, []);

	const start = () => {
		model.setModel(modelName);
		modal.classList.remove("flex");
		modal.classList.add("hidden");
		setShowModal(false);


		runDetection();

		setIsDetecting(true);

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
	const isLandscape   = size.height <= size.width;
	const ratio         = isLandscape ? size.width / size.height : size.height /
			size.width;

	// Hook
	function useWindowSize() {
		// Initialize state with undefined width/height so server and client renders match
		// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
		const [windowSize, setWindowSize] = useState({
			width : undefined,
			height: undefined,
		});

		useEffect(() => {
			// Handler to call on window resize
			function handleResize() {
				// Set window width/height to state
				setWindowSize({
					width : window.innerWidth,
					height: window.innerHeight,
				});
			}

			// Add event listener
			window.addEventListener("resize", handleResize);

			// Call handler right away so state gets updated with initial window size
			handleResize();

			// Remove event listener on cleanup
			return () => window.removeEventListener("resize", handleResize);
		}, []); // Empty array ensures that effect is only run on mount

		return windowSize;
	}

	async function getIpClient() {
		try {
			const response = await axios.get('https://api.ipify.org?format=json');
			setIpAddress(response.data.ip);
		} catch (error) {
			console.error(error);
		}
	}


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
					<div className="port_container">
						<label>UDP Port:</label>
						<input value={userPort} onChange={(e) => {
							setUserPort(parseInt(e.target.value))
						}}/>
					</div>
					<div className="landmarks_container">
						<p>Landmarks</p>
						<div className="landmarks">
							<div>
								<input type="checkbox"/>
								<label>Right Eye</label>
							</div>
							<div>
								<input type="checkbox"/>
								<label>Left Eye</label>
							</div>
							<div>
								<input type="checkbox"/>
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
							videoConstraints={{facingMode: 'user', aspectRatio: ratio}}
							audio={false}
							ref={camera => window.camera = camera}/>
					<canvas id="render" className="hidden canvas"/>
				</div>

				{/* TODO: Add containers based on the element's function */}
				<div className="button">
					<button onClick={!isDetecting ? start : stop}
					        style={{backgroundColor: setBackground()}}>

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
