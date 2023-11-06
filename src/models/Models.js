import {faceLandmarks, faceModel} from "./faceLandmarker";
import {poseLandmarks, poseModel} from "./poseLandmarker";
import {handLandmarks, handModel} from "./handLandmarker";

const models = {
	face: {
		model         : faceModel,
		landmarks     : faceLandmarks,
		namedLandmarks: {
			lips         : [0, 13, 14, 17, 37, 39, 40, 61, 78, 80, 81, 82, 84, 87, 88, 91, 95, 146, 178,
			                181, 185, 191, 267, 269, 270, 291, 308, 310, 311, 312, 314, 317, 318, 321, 324,
			                375, 402, 405, 409, 415],
			left_eye     : [249, 263, 362, 373, 374, 380, 381, 382, 384, 385, 386, 387, 388, 390, 398,
			                466],
			left_iris    : [474, 475, 476, 477],
			left_eyebrow : [276, 282, 283, 285, 293, 295, 296, 300, 334, 336],
			right_eye    : [7, 33, 133, 144, 145, 153, 154, 155, 157, 158, 159, 160, 161, 163, 173, 246],
			right_eyebrow: [46, 52, 53, 55, 63, 65, 66, 70, 105, 107],
			right_iris   : [469, 470, 471, 472],
			face_oval    : [10, 21, 54, 58, 67, 93, 103, 109, 127, 132, 136, 148, 149, 150, 152, 162, 172,
			                176, 234, 251, 284, 288, 297, 323, 332, 338, 356, 361, 365, 377, 378, 379, 389,
			                397, 400, 454],
			nose         : [1, 2, 4, 5, 6, 19, 45, 48, 64, 94, 97, 98, 115, 168, 195, 197, 220, 275, 278,
			                294, 326, 327, 344, 440],
		},
		connectorInfo : [
			{
				name : "FACE_LANDMARKS_TESSELATION",
				style: {
					color    : "#ffffff",
					lineWidth: 0.5,
				},
			},
			{
				name : "FACE_LANDMARKS_RIGHT_EYE",
				style: {
					color    : "#00ff00",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_RIGHT_EYEBROW",
				style: {
					color    : "#00ff00",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_LEFT_EYE",
				style: {
					color    : "#ff0000",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_LEFT_EYEBROW",
				style: {
					color    : "#ff0000",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_FACE_OVAL",
				style: {
					color    : "#ffffff",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_LIPS",
				style: {
					color    : "#0000ff",
					lineWidth: 4,
				},
			},
			{
				name : "FACE_LANDMARKS_RIGHT_IRIS",
				style: {
					color    : "#00ff00",
					lineWidth: 1,
				},
			},
			{
				name : "FACE_LANDMARKS_LEFT_IRIS",
				style: {
					color    : "#ff0000",
					lineWidth: 1,
				},
			},
		],
	},
	pose: {
		model         : poseModel,
		landmarks     : poseLandmarks,
		namedLandmarks: [
			"nose", "left_eye(inner)", "left_eye", "left_eye(outer)", "right_eye(inner)", "right_eye",
			"right_eye(outer)", "left_ear", "right_ear", "mouth(left)", "mouth(right)", "left_shoulder",
			"right_shoulder", "left_elbow", "right_elbow", "left_wrist", "right_wrist", "left_pinky",
			"right_pinky", "left_index", "right_index", "left_thumb", "right_thumb", "left_hip",
			"right_hip", "left_knee", "right_knee", "left_ankle", "right_ankle", "left_heel",
			"right_heel", "left_foot_index", "right_foot_index",
		],
		connectorInfo : [
			{
				name : "POSE_CONNECTIONS",
				style: {
					color    : "#ff0000",
					lineWidth: 4,
				},
			},
		],
	},
	hand: {
		model         : handModel,
		landmarks     : handLandmarks,
		namedLandmarks: [
			"wrist", "thumb_cmc", "thumb_mcp", "thumb_ip", "thumb_tip", "index_finger_mcp",
			"index_finger_pip", "index_finger_dip", "index_finger_tip", "middle_finger_mcp",
			"middle_finger_pip", "middle_finger_dip", "middle_finger_tip", "ring_finger_mcp",
			"ring_finger_pip", "ring_finger_dip", "ring_finger_tip", "pinky_mcp", "pinky_pip",
			"pinky_dip", "pinky_tip",
		],
		connectorInfo : [
			{
				name : "HAND_CONNECTIONS",
				style: {
					color    : "#ff0000",
					lineWidth: 4,
				},
			},
		],
	},
	draw: null,
};

export default models
