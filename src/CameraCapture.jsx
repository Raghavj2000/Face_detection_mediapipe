// CameraCapture.js
import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import face from "../src/assets/face.png";

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const toggleWebcam = () => {
    setIsWebcamOpen(!isWebcamOpen);
  };

  return (
    <div>
      <button onClick={toggleWebcam}>
        {isWebcamOpen ? "Close Camera" : "Open Camera"}
      </button>
      {isWebcamOpen && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "red",
          }}
        >
          <div
            style={{
              width: "512px",
              height: "512px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: "blue",
            }}
          >
            <img
              src={face}
              alt="face"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                zIndex: "1",
              }}
            />
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              width={"100%"}
            />
          </div>
          <button onClick={capture}>Capture Photo</button>
        </div>
      )}
      {imageSrc && (
        <div
          style={{
            backgroundColor: "green",
          }}
        >
          <h3>Captured Image:</h3>
          <img src={imageSrc} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
