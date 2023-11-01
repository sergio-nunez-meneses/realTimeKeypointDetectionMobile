import {faceLandmarks, faceModel} from "./faceLandmarker";
import {poseLandmarks, poseModel} from "./poseLandmarker";
import {handLandmarks, handModel} from "./handLandmarker";

const models = {
	face: {
		model     : faceModel,
		landmarks : faceLandmarks,
		categories: [
			{
				name     : "FACE_LANDMARKS_TESSELATION",
				color    : "#ffffff",
				lineWidth: 0.5,
			},
			{
				name     : "FACE_LANDMARKS_RIGHT_EYE",
				color    : "#00ff00",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_RIGHT_EYEBROW",
				color    : "#00ff00",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_LEFT_EYE",
				color    : "#ff0000",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_LEFT_EYEBROW",
				color    : "#ff0000",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_FACE_OVAL",
				color    : "#ffffff",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_LIPS",
				color    : "#0000ff",
				lineWidth: 4,
			},
			{
				name     : "FACE_LANDMARKS_RIGHT_IRIS",
				color    : "#00ff00",
				lineWidth: 1,
			},
			{
				name     : "FACE_LANDMARKS_LEFT_IRIS",
				color    : "#ff0000",
				lineWidth: 1,
			},

		],
	},
	pose: {
		model     : poseModel,
		landmarks : poseLandmarks,
		categories: [
			{
				name     : "POSE_CONNECTIONS",
				color    : "#ff0000",
				lineWidth: 4,
			},
		],
	},
	hand: {
		model     : handModel,
		landmarks : handLandmarks,
		categories: [
			{
				name     : "HAND_CONNECTIONS",
				color    : "#ff0000",
				lineWidth: 4,
			},
		],
	},
	data: null,
	draw: null,
};

export default models
