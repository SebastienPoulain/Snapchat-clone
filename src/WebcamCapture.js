import React, { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import Webcam from "react-webcam";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { setCameraImage } from "./features/cameraSlice";
import { useHistory } from "react-router-dom";
import "./WebcamCapture.css";

const videoConstraints = {
  width: 250,
  height: 400,
  facingMode: "user",
};

function WebcamCapture() {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    dispatch(setCameraImage(imageSrc));
    history.push("/preview");
  }, [webcamRef]);

  const back = () => {
    history.replace("/");
  };

  return (
    <div className="webcamCapture">
      <Webcam
        audio={false}
        height={videoConstraints.height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={videoConstraints.width}
        videoConstraints={videoConstraints}
      />
      <ArrowBackIcon
        fontSize="large"
        className="webcamCapture__back"
        onClick={back}
      />
      <AddAPhotoIcon
        className="webcamCapture__button"
        onClick={capture}
        fontSize="large"
      />
    </div>
  );
}

export default WebcamCapture;
