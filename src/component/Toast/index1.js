import React, { useEffect, useState, useContext, useRef } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

import { ProcessContextDispatch, ProcessContextState } from "../../App";

const ToastComp = () => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;

  const [show, setShowToast] = useState(false);
  const welcomeRef = useRef(true);
  const content = useRef({
    title: "Notifications",
    body: "",
    time: "Just now",
  });

  const HandleClose = () => {
    setShowToast(false);
  };

  useEffect(() => {
    const SetContentAndShowToast = ({
      title = "Notifications",
      body,
      time = "Just now",
    }) => {
      content.current = { title, body, time };
      setShowToast(true);
    };
    console.log("toast render!");
    dispatch.addContextDispatch(
      SetContentAndShowToast,
      "SetContentAndShowToast"
    );
  }, []);

  useEffect(() => {
    if (show === false) {
      content.current = {
        title: "Notifications",
        body: "",
        time: "Just now",
      };
    }
  }, [show]);

  useEffect(() => {
    console.log("toast re-render!");
  });

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        show={show}
        onClose={HandleClose}
        autohide={true}
        style={{ borderRadius: 25 }}
      >
        <Toast.Header closeButton={false} style={{ borderRadius: 25 }}>
          <img src={"./info-icon.png"} className="rounded me-2" alt="👀" />
          <strong className="me-auto">{content.current.title}</strong>
          <small>{content.current.time}</small>
        </Toast.Header>
        <Toast.Body>{content.current.body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComp;
