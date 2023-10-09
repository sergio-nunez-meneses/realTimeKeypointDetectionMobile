import faceDetector from "./faceDetector";
import faceLandmarker from "./faceLandmarker";
import poseLandmarker from "./poseLandmarker";
import handLandmarker from "./handLandmarker";
import React, { useEffect, useState } from "react";
import zidane from "./assets/zidane.jpg";
import kaamelott from "./assets/kaamelott.jpg";
import starwars from "./assets/starwars.jpg";
import Webcam from "react-webcam";

function App() {
      const [source, setSource] = useState("image");
      const [nameModel, setNameModel] = useState("PoseLandmarker");
      console.log(handLandmarker);
      
      const initializeFaceLandmarker = ()=>{
        const image = document.getElementById("image");
          const faceLandmarkerResult = faceLandmarker.detect(image);
          console.log(faceLandmarkerResult);
        }

      const initializePoseLandmarker = ()=>{
        const image = document.getElementById("image");
        const poseLandmarkerResult = poseLandmarker.detect(image);
        console.log(poseLandmarkerResult);
      } 
      
      const initializeHandLandmaker = ()=>{
        const image = document.getElementById("image");        
        const handLandmarkerResult = handLandmarker.detect(image);
        console.log(handLandmarkerResult);
      }
        
    //     const initializeFaceDetector = async () => {
    //       const image = document.getElementById("image");   
      
    //       const faceDetectorResult = await faceDetector.detect(image);
    //       const detections = faceDetectorResult.detections;
    //       // test terminé, ligne suivante test supplémentaire
    //       if (detections.length > 0) {
    //         const detectionData = document.createElement("div");
    //         detectionData.id = "data";
    //         document.body.appendChild(detectionData);
    //         detections.forEach((detection) => {
    //           const box = detection.boundingBox;
    //           const keypoints = detection.keypoints;
    //           const imageContainer = image.parentNode;

    //           const boundingBox = document.createElement("div");
    //           boundingBox.classList = "highlighter";
    //           boundingBox.style.left = box.originX + image.offsetLeft + "px";
    //           boundingBox.style.top = box.originY+image.offsetTop + "px";
    //           boundingBox.style.width = box.width + "px";
    //           boundingBox.style.height = box.height + "px";
    //           // imageContainer.insertBefore(boundingBox, image);
    //           detectionData.appendChild(boundingBox);

    //           keypoints.forEach((keypoint) => {
    //             const keypointElement = document.createElement("div");
    //             keypointElement.className = "key-point";
    //             keypointElement.style.left = (keypoint.x * image.width) + image.offsetLeft - 3 + "px";
    //             keypointElement.style.top = (keypoint.y * image.height) + image.offsetTop - 3 + "px";
    //             keypointElement.style.width = "3px";
    //             detectionData.appendChild(keypointElement);
    //           });
    //         });
    //     }
      
    // };

        const handleNameImagesChange = (event) => {
          setSource(event.target.value);

          if(document.getElementById("data")){
            document.getElementById("data").remove()
          }
          // const boundingBoxes = document.querySelectorAll(".highlighter");
          // boundingBoxes.forEach((boundingBox)=>{
          //   boundingBox.remove();
          // })
          // const keypoints = document.querySelectorAll(".key-point")
          // keypoints.forEach((keypoint)=>{
          //   keypoint.remove();
          // })
        };

        const handleNameModelChange = (event) =>{
          setNameModel(event.target.value);
        }

        const handleclick= ()=>{
          if(nameModel === "PoseLandmarker"){
            initializePoseLandmarker();
          }else if (nameModel === "FaceLandmarker"){
            initializeFaceLandmarker();
          }else{
            initializeHandLandmaker();
            // initializeFaceDetector();
          }
          
        }

  return (
    <div className="App">
      <div>
        <label>Source :</label>
        <select onChange={handleNameImagesChange} value={source}>
          <option value={"image"}>Image</option>
          <option value={"webcam"}>Webcam</option>
        </select>
      </div>
      <div>
        <label>Model :</label>
        <select onChange={handleNameModelChange} value={nameModel}>
          <option value={"PoseLandmarker"}>Pose</option>
          <option value={"FaceLandmarker"}>Face</option>
          <option value={"HandLandmarker"}>Hand</option>
        </select>
      </div>
      
        <button onClick={handleclick}>Start detection</button>
        {
          source === "image"?
          <img id="image" className="image" src={kaamelott} />:
          <Webcam id="image"/>
        }

      
    </div>
  );
}

export default App;