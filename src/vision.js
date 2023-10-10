import {FilesetResolver, DrawingUtils} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@latest";


const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  export default vision;