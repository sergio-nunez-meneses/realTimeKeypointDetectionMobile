import {PoseLandmarker} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@latest";
import vision from "./vision";

const poseModel = await PoseLandmarker.createFromOptions(vision, {
	baseOptions: {
		modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
		delegate      : "GPU",
	},
	runningMode: "VIDEO",
	numPoses   : 1,
});

export {poseModel, PoseLandmarker as poseLandmarks};
