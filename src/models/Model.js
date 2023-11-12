import {DrawingUtils} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import {faceLandmarks, faceModel} from "./faceLandmarker";
import {poseLandmarks, poseModel} from "./poseLandmarker";
import {handLandmarks, handModel} from "./handLandmarker";


export default class Model {
	constructor(video, context) {
		this.video     = video;
		this.context   = context;
		this.draw      = new DrawingUtils(this.context);
		this.model     = null;
		this.modelName = null;
		this.isFace    = null;
		this.modelKey  = null;
	}

	setModel(name) {
		const modelInfo = {
			face: {
				model         : faceModel,
				landmarks     : faceLandmarks,
				namedLandmarks: {
					lips         : [0, 13, 14, 17, 37, 39, 40, 61, 78, 80, 81, 82, 84, 87, 88, 91, 95, 146,
					                178, 181, 185, 191, 267, 269, 270, 291, 308, 310, 311, 312, 314, 317, 318,
					                321, 324, 375, 402, 405, 409, 415],
					left_eye     : [249, 263, 362, 373, 374, 380, 381, 382, 384, 385, 386, 387, 388, 390, 398,
					                466],
					left_iris    : [474, 475, 476, 477],
					left_eyebrow : [276, 282, 283, 285, 293, 295, 296, 300, 334, 336],
					right_eye    : [7, 33, 133, 144, 145, 153, 154, 155, 157, 158, 159, 160, 161, 163, 173,
					                246],
					right_eyebrow: [46, 52, 53, 55, 63, 65, 66, 70, 105, 107],
					right_iris   : [469, 470, 471, 472],
					face_oval    : [10, 21, 54, 58, 67, 93, 103, 109, 127, 132, 136, 148, 149, 150, 152, 162,
					                172, 176, 234, 251, 284, 288, 297, 323, 332, 338, 356, 361, 365, 377, 378,
					                379, 389, 397, 400, 454],
					nose         : [1, 2, 4, 5, 6, 19, 45, 48, 64, 94, 97, 98, 115, 168, 195, 197, 220, 275,
					                278, 294, 326, 327, 344, 440],
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
				namedLandmarks: {
					nose           : [0], left_eye_inner: [1], left_eye: [2], left_eye_outer: [3],
					right_eye_inner: [4], right_eye: [5], right_eye_outer: [6], left_ear: [7], right_ear: [8],
					mouth_left     : [9], mouth_right: [10], left_shoulder: [11], right_shoulder: [12],
					left_elbow     : [13], right_elbow: [14], left_wrist: [15], right_wrist: [16],
					left_pinky     : [17], right_pinky: [18], left_index: [19], right_index: [20],
					left_thumb     : [21], right_thumb: [22], left_hip: [23], right_hip: [24],
					left_knee      : [25], right_knee: [26], left_ankle: [27], right_ankle: [28],
					left_heel      : [29], right_heel: [30], left_foot_index: [31], right_foot_index: [32],
				},
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
				namedLandmarks: {
					wrist            : [0], thumb_cmc: [1], thumb_mcp: [2], thumb_ip: [3], thumb_tip: [4],
					index_finger_mcp : [5], index_finger_pip: [6], index_finger_dip: [7],
					index_finger_tip : [8], middle_finger_mcp: [9], middle_finger_pip: [10],
					middle_finger_dip: [11], middle_finger_tip: [12], ring_finger_mcp: [13],
					ring_finger_pip  : [14], ring_finger_dip: [15], ring_finger_tip: [16], pinky_mcp: [17],
					pinky_pip        : [18], pinky_dip: [19], pinky_tip: [20],
				},
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
		};
		this.modelName  = name;
		this.model      = modelInfo[this.modelName];
	}

	getData() {
		const startTimeMs = performance.now();
		let lastVideoTime = -1;
		let rawData;

		if (lastVideoTime !== this.video.currentTime) {
			rawData       = this.model.model.detectForVideo(this.video, startTimeMs);
			this.isFace   = "faceLandmarks" in rawData;
			this.modelKey = this.isFace ? "faceLandmarks" : "landmarks";
			lastVideoTime = this.video.currentTime;
		}
		return rawData;
	}
}
