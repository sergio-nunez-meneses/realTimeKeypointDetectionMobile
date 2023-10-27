import { faceModel, faceLandmarks } from "./faceLandmarker";
import { poseModel, poseLandmarks } from "./poseLandmarker";
import { handModel, handLandmarks } from "./handLandmarker";

const models = {
    face: {
      model: faceModel,
      landmarks: faceLandmarks,
      categories: [
        "FACE_LANDMARKS_TESSELATION",
        "FACE_LANDMARKS_RIGHT_EYE",
        "FACE_LANDMARKS_RIGHT_EYEBROW",
        "FACE_LANDMARKS_LEFT_EYE",
        "FACE_LANDMARKS_LEFT_EYEBROW",
        "FACE_LANDMARKS_FACE_OVAL",
        "FACE_LANDMARKS_LIPS",
        "FACE_LANDMARKS_RIGHT_IRIS",
        "FACE_LANDMARKS_LEFT_IRIS",
      ],
      color: "#edebeb",
    },
    pose: {
      model: poseModel,
      landmarks: poseLandmarks,
      categories: ["POSE_CONNECTIONS"],
      color: "#00FF00",
    },
    hand: {
      model: handModel,
      landmarks: handLandmarks,
      categories: ["HAND_CONNECTIONS"],
      color: "#0000FF",
    },
    results: null,
    draw: null,
  };

  export default models