import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
  } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@latest";
  import vision from "./vision";


  const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
      delegate: "GPU"
    },
    runningMode: "IMAGE",
    numPoses: 2
  });

  export default poseLandmarker;