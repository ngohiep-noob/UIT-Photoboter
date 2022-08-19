import React, { useContext, useEffect } from "react";
import { ProcessContextDispatch } from "../../App";

const bootstrap = require("bootstrap");

const Toast = ({header, body, since}) => {
  const dispatch = useContext(ProcessContextDispatch);

  useEffect(() => {
    document
      .getElementById("liveToast")
      .addEventListener("hidden.bs.toast", () => {
        dispatch.setState((prev) => ({
          ...prev,
          toastMessage: "",
        }));
      });
  }, []);

  useEffect(() => {
    if(body !== "") {
      const toastTrigger = new bootstrap.Toast("#liveToast");
      if(!toastTrigger.isShown()) {
        toastTrigger.show();
      }
    }
    console.log("toast render!");
  });

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      <div
        id="liveToast"
        className="toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{borderRadius: 25}}
      >
        <div className="toast-header" style={{borderRadius: 25}}>
          <img
            src={"./info-icon.png"}
            className="rounded me-2"
            alt="👀"
          />
          <strong className="me-auto">{header}</strong>
          <small>{since}</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{body}</div>
      </div>
    </div>
  );
};

export default Toast;
