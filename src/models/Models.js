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
		model         : poseModel,
		landmarks     : poseLandmarks,
		categories    : [
			{
				name     : "POSE_CONNECTIONS",
				color    : "#ff0000",
				lineWidth: 4,
			},
		],
		namedLandmarks: [
			"nose", "left_eye(inner)", "left_eye", "left_eye(outer)", "right_eye(inner)", "right_eye",
			"right_eye(outer)", "left_ear", "right_ear", "mouth(left)", "mouth(right)", "left_shoulder",
			"right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_pinky",
			"right_pinky", "left_index", "right_index", "left_thumb", "right_thumb", "left_hip",
			"right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel",
			"right_heel", "left_foot_index", "right_foot_index",
		],
	},
	hand: {
		model         : handModel,
		landmarks     : handLandmarks,
		categories    : [
			{
				name     : "HAND_CONNECTIONS",
				color    : "#ff0000",
				lineWidth: 4,
			},
		],
		namedLandmarks: [
			"wrist", "thumb_cmc", "thumb_mcp", "thumb_ip", "thumb_tip", "index_finger_mcp",
			"index_finger_pip", "index_finger_dip", "index_finger_tip", "middle_finger_mcp",
			"middle_finger_pip", "middle_finger_dip", "middle_finger_tip", "ring_finger_mcp",
			"ring_finger_pip", "ring_finger_dip", "ring_finger_tip", "pinky_mcp", "pinky_pip",
			"pinky_dip", "pinky_tip",
		],
	},
	data: null,
	draw: null,
};

export default models
