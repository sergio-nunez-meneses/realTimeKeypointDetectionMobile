import {FaceLandmarker} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import vision from "./vision";

const faceModel = await FaceLandmarker.createFromOptions(vision, {
	baseOptions          : {
		modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
		delegate      : "GPU",
	},
	outputFaceBlendshapes: true,
	runningMode          : "VIDEO",
	numFaces             : 1,
});

export {FaceLandmarker as faceLandmarks, faceModel};
