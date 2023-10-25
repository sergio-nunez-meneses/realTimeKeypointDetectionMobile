import { FaceLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import vision from "./vision";

let runningMode = "VIDEO";

const modelFace = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    delegate: "GPU",
  },
  outputFaceBlendshapes: true,
  runningMode: runningMode,
  numFaces: 2,
});

export { FaceLandmarker, modelFace };
