import React, { useRef, useEffect, useState } from "react";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";
import face from "./assets/face2.png";

const CameraFeed = () => {
  const [faceDetector, setFaceDetector] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const initFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      const detector = await FaceDetector.createFromModelPath(
        vision,
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
      );
      setFaceDetector(detector);
    };

    initFaceDetector();
  }, []);

  useEffect(() => {
    if (!faceDetector) return;

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    startCamera();
  }, [faceDetector]);

  useEffect(() => {
    let animationFrameId;

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const image = canvasRef.current;
      const detections = await faceDetector.detect(image);

      // For demo purposes, let's just log detections
      console.log(detections);

      // You can process detections here and update state if needed

      // Call detectFace on the next animation frame
      animationFrameId = requestAnimationFrame(detectFace);
    };

    detectFace();

    return () => cancelAnimationFrame(animationFrameId);
  }, [faceDetector]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !faceDetector) return;

    const ctx = canvasRef.current.getContext("2d");
    const { videoWidth, videoHeight } = videoRef.current;
    const size = Math.min(videoWidth, videoHeight); // Use the smaller dimension for the square

    canvasRef.current.width = size;
    canvasRef.current.height = size;

    ctx.save();
    ctx.scale(-1, 1); // Mirror the image
    ctx.translate(-size, 0); // Adjust the x-axis
    ctx.drawImage(
      videoRef.current,
      (videoWidth - size) / 2,
      (videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );
    ctx.restore();
    const image = canvasRef.current;
    const detections = await faceDetector.detect(image);

    if (detections.detections?.length === 0) {
      alert("No face detected. Please try again.");
    } else if (detections.detections?.length > 1) {
      alert("Multiple faces detected. Please try again.");
    } else {
      const dataURL = canvasRef.current.toDataURL("image/png");
      setCapturedImage(dataURL);
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = "captured_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <div
        style={{
          width: "500px",
          height: "auto",
          backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={face}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            zIndex: "1",
          }}
        />
        <video ref={videoRef} style={{ width: "100%", height: "100%" }}></video>
      </div>
      <canvas
        ref={canvasRef}
        width="540px"
        height="480px"
        style={{ display: "none" }}
      ></canvas>
      <button onClick={captureImage}>Capture Image</button>
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
