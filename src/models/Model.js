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
}
