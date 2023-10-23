import { HandLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import vision from "./vision";

const handLandmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
    delegate: "GPU",
  },
  runningMode: "IMAGE",
  numHands: 6,
});
export default handLandmarker;
