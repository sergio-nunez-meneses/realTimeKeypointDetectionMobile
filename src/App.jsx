import {
  FaceDetector,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import React, { useEffect, useState } from "react";
import zidane from "./assets/zidane.jpg";
import kaamelott from "./assets/kaamelott.jpg";
import starwars from "./assets/starwars.jpg";

function App() {
      const [nameImages, setNameImages] = useState(zidane);
      const initializeFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
      const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
          },
          runningMode: "IMAGE",
        });
      const images = document.querySelectorAll(".image");
      
      images.forEach(async (image, index) => {
        const faceDetectorResult = await faceDetector.detect(image);
        const detections = faceDetectorResult.detections;
        // test terminé, ligne suivante test supplémentaire
        if (detections.length > 0) {
          detections.forEach((detection) => {
            const box = detection.boundingBox;
            const keypoints = detection.keypoints;
            const imageContainer = image.parentNode;

            const boundingBox = document.createElement("div");
            boundingBox.classList = "highlighter";
            boundingBox.style.left = box.originX + image.offsetLeft + "px";
            boundingBox.style.top = box.originY+image.offsetTop + "px";
            boundingBox.style.width = box.width + "px";
            boundingBox.style.height = box.height + "px";
            imageContainer.insertBefore(boundingBox, image);

            keypoints.forEach((keypoint) => {
              const keypointElement = document.createElement("div");
              keypointElement.className = "key-point";
              keypointElement.style.left =
                (keypoint.x * image.width) + image.offsetLeft - 3 + "px";
              keypointElement.style.top =
                (keypoint.y * image.height) + image.offsetTop - 3 + "px";
              keypointElement.style.width = "3px";
              imageContainer.appendChild(keypointElement);
            });
          });
        }
      });
    };

        const handleNameImagesChange = (event) => {
          setNameImages(event.target.value);
          const boundingBoxes = document.querySelectorAll(".highlighter");
          boundingBoxes.forEach((boundingBox)=>{
            boundingBox.remove();
          })
          const keypoints = document.querySelectorAll(".key-point")
          keypoints.forEach((keypoint)=>{
            keypoint.remove();
          })
        };

        const handleclick= ()=>{
          initializeFaceDetector();
        }

  return (
    <div className="App">
      <div>
        <label>Image :</label>
        <select onChange={handleNameImagesChange} value={nameImages}>
          <option value={zidane}>Zidane</option>
          <option value={kaamelott}>Kaamelott</option>
          <option value={starwars}>Star Wars</option>
        </select>
      </div>
      
        <div className="imageContainer" onClick={handleclick}>
          <img className="image" src={nameImages} />
        </div>
      
    </div>
  );
}

export default App;