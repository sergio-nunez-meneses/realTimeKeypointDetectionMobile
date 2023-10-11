// import faceDetector from "./faceDetector";
// import faceLandmarker from "./faceLandmarker";
import poseLandmarker from "./poseLandmarker";
import handLandmarker from "./handLandmarker";
import vision from "./vision";
import { FaceLandmarker, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";
import React, { useEffect, useState } from "react";
import kaamelott from "./assets/kaamelott.jpg";
import Webcam from "react-webcam";

let runningMode = "IMAGE";

const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    delegate: "GPU"
  },
  outputFaceBlendshapes: true,
  runningMode : runningMode,
  numFaces: 6
});
const imageBlendShapes = document.getElementById("image-blend-shapes");
const canvas = document.createElement("canvas");
canvas.id = "render"
document.body.appendChild(canvas);
let image = document.getElementById("image");
let lastVideoTime = -1;
let results = undefined;

function App() {
      const [source, setSource] = useState("webcam");
      const [nameModel, setNameModel] = useState("FaceLandmarker");
      if(source === "webcam"){
        runningMode = "VIDEO"
      }
      
      
      const initializeFaceLandmarker = ()=>{
        if(source === "webcam"){
          faceLandmarker.setOptions({ runningMode: runningMode });
          let startTimeMs = performance.now();
          if (lastVideoTime !== image.currentTime) {
              lastVideoTime = image.currentTime;
              results = faceLandmarker.detectForVideo(image, startTimeMs);
  }
  console.log(image.currentTime)

        }else{

          results = faceLandmarker.detect(image);
        }
        
        // draw landmarks on canvas
        const ctx = canvas.getContext("2d");
        ctx.clearRect(image.offsetLeft, image.offsetTop, canvas.width, canvas.height);
        const drawingUtils = new DrawingUtils(ctx);

        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
            color: "#E0E0E0"
          });
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30" }
          );
        }
        drawBlendShapes(imageBlendShapes, results.faceBlendshapes);
        

        }


      const initializePoseLandmarker = ()=>{
        const poseLandmarkerResult = poseLandmarker.detect(image);
        console.log(poseLandmarkerResult);
      } 
      
      const initializeHandLandmaker = ()=>{       
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

          // if(document.getElementById("data")){
          //   document.getElementById("data").remove()
          // }
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
          image = document.getElementById("image");
          // console.log(faceLandmarkerResult);
          window.requestAnimationFrame(initializeFaceLandmarker);
          canvas.setAttribute("class", "canvas");
          canvas.style.left = image.offsetLeft+"px";
          canvas.style.top = image.offsetTop+"px";

          if(source === "webcam"){
            canvas.setAttribute("width", image.videoWidth + "px");
            canvas.setAttribute("height", image.videoHeight + "px");
          }else{
            canvas.setAttribute("width", image.width + "px");
            canvas.setAttribute("height", image.height + "px");
          }
            
            
          
          if(nameModel === "PoseLandmarker"){
            initializePoseLandmarker();
          }else if (nameModel === "FaceLandmarker"){
            
            initializeFaceLandmarker();
          }else{
            initializeHandLandmaker();
            // initializeFaceDetector();
          }
          
        }
        
        function drawBlendShapes(el, blendShapes) {
          el = document.getElementById("el");
          if (!blendShapes.length) {
            return;
          }
        
          
          
          let htmlMaker = "";
          blendShapes[0].categories.map((shape) => {
            htmlMaker += `
              <li class="blend-shapes-item">
                <span class="blend-shapes-label">${
                  shape.displayName || shape.categoryName
                }</span>
                <span class="blend-shapes-value" style="width: calc(${
                  +shape.score * 100
                }% - 120px)">${(+shape.score).toFixed(4)}</span>
              </li>
            `;
          });
        
          el.innerHTML = htmlMaker;
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
          <img id="image" className="image" src={kaamelott} />
          :
          <Webcam id="image"/>
        }

        {
          nameModel==="FaceLandmarker" ? <div className="blend-shapes">
          <ul className="blend-shapes-list" id="video-blend-shapes"></ul>
        </div> : <span></span>
        }
        <span id="el"></span>
      
    </div>
  );
}

export default App;