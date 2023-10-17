## RealTime Keypoint Detection Mobile

This React application provides a responsive user interface built in mobile first to perform real-time landmark detection using MediaPipe. It allows you to choose between three models for landmark detection: Pose, Face, and Hand. The application displays the detected landmarks on a video stream from your webcam.
[MediaPipe](https://developers.google.com/mediapipe): The project leverages the MediaPipe library for landmark detection.
[React](https://reactjs.org): The user interface is built using the React library.

## Acknowledgements

This application is built upon the work of Sergio Nunez Meneses, who created a similar real-time keypoint detection application in Python. You can find Sergio Nunez Meneses' Python application on GitHub: https://github.com/sergio-nunez-meneses/realTimeKeypointDetectionMobile.
We extend our gratitude [@sergio-nunez-meneses](https://www.github.com/sergio-nunez-meneses) for inspiring this project.
The idea here was to create a mobile version of his work, using JavaScript. This is still a work in progress.



## Installation

Before running the application, make sure you have Node.js and npm installed on your system. Follow these steps to set up and run the application:

- Clone the repository to your local machine.
- Navigate to the project directory in your terminal.
- Install the required dependencies by running the following command:

```bash
npm install
```

- Start the application with the following command:

```bash
npm start
```

- Open a web browser and visit http://localhost:3000 to access the application.
    
## Usage

- Select the model you want to use for landmark detection (Pose, Face, or Hand) from the dropdown menu.
- Click the "Start detection" button to begin the landmark detection on the live video stream from your webcam.
- The detected landmarks will be displayed on the video stream in real-time.
- If you want to stop the detection, click the "Stop detection" button.


## Contributing

Contributions to this project are welcome. If you'd like to improve or extend the functionality of this application, please consider submitting a pull request.


## Authors
This project was created by [@WhidanB](https://www.github.com/WhidanB) with the help and under the supervision of [@sergio-nunez-meneses](https://www.github.com/sergio-nunez-meneses).


