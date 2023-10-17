README

Acknowledgment

This application is built upon the work of Sergio Nunez Meneses, who created a similar real-time keypoint detection application in Python. You can find Sergio Nunez Meneses' Python application on GitHub: https://github.com/sergio-nunez-meneses/realTimeKeypointDetectionMobile. We extend our gratitude @sergio-nunez-meneses for inspiring this project. The idea here was to create a mobile version of his work, using JavaScript. This is still a work in progress.


Overview

This React application provides a user interface to perform real-time landmark detection using MediaPipe. It allows you to choose between three models for landmark detection: Pose, Face, and Hand. The application displays the detected landmarks on a video stream from your webcam.

Installation

Before running the application, make sure you have Node.js and npm installed on your system. Follow these steps to set up and run the application:

    1.Clone the repository to your local machine.

    2.Navigate to the project directory in your terminal.

    3.Install the required dependencies by running the following command:

bash

npm install

4.Start the application with the following command:

bash

    npm start

    5.Open a web browser and visit http://localhost:3000 to access the application.

Usage

    1.Select the model you want to use for landmark detection (Pose, Face, or Hand) from the dropdown menu.

    2.Click the "Start detection" button to begin the landmark detection on the live video stream from your webcam.

    3.The detected landmarks will be displayed on the video stream in real-time.

    4.If you want to stop the detection, click the "Stop detection" button.

Contributions

Contributions to this project are welcome. If you'd like to improve or extend the functionality of this application, please consider submitting a pull request.

Author

This project was created by @WhidanB with the help and under the supervision of @sergio-nunez-meneses.
Acknowledgments

    MediaPipe: The project leverages the MediaPipe library for landmark detection.

    React: The user interface is built using the React library.

