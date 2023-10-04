import {
  FaceDetector,
  FilesetResolver,
  Detection
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import { useEffect } from "react";
import zidane from "./assets/zidane.jpg"

let faceDetector = FaceDetector;
let runningMode = "IMAGE";


function App() {
    const initializefaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
          },
          runningMode: runningMode
        });

        const image = document.getElementById("image");
        const detections = faceDetector.detect(image).detections[0];
        const box = detections.boundingBox;
        const keypoints = detections.keypoints;

        let BoundingBox = document.createElement("div");
        BoundingBox.classList="highlighter";
        BoundingBox.style.left= box.originX+"px";
        BoundingBox.style.top= box.originY+"px";
        BoundingBox.style.width= box.width+"px";
        BoundingBox.style.height= box.height+"px";
        document.body.appendChild(BoundingBox);

        for(let i=0; i<keypoints.length; i++){
          let keypoint = document.createElement("div");
          keypoint.className = "key-point";
          keypoint.style.left = keypoints[i].x * box.width  - 3 + "px";
          keypoint.style.top = keypoints[i].y * box.height - 3 + "px";
          keypoint.style.width = "3px"
          BoundingBox.appendChild(keypoint);
          
        }
        console.log(keypoints);
        console.log(box);
        console.log(detections);
        // console.log(detections);
        // console.log(keypoints);

      }


        initializefaceDetector();


      


  return (
    <div className="App">
      
        <img id='image' src={zidane} />
      
    </div>
  );

}

export default App;
