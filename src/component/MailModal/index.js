import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProcessContextState, ProcessContextDispatch } from "../../App";
import HandleSubmit from "./HandleSubmit";
import FinishProcessWithToast from "./FinishProcess";
import { HandleSelectGuest } from "./HandleRegister";
const bootstrap = require("bootstrap");

const Modal = ({ title = "Hello", footerBtn = "Send to my mail" }) => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const [, updateState] = useState();
  const forceRerender = useCallback(() => updateState({}), []);
  const context = useContext(ProcessContextState);
  const dispatch = useContext(ProcessContextDispatch);

  useEffect(() => {
    const modalTrigger = new bootstrap.Modal("#modal");
    document.getElementById("modal").addEventListener("hidden.bs.modal", () => {
      if (
        emailRef.current !== null &&
        nameRef.current !== null &&
        context.userPredictionRef.current.length === 0
      ) {
        emailRef.current.value = "";
        nameRef.current.value = "";
      }
    });

    dispatch.setState((prev) => ({
      ...prev,
      modalTrigger,
    }));
  }, []);

  useEffect(() => {
    console.log("modal render!");
  });

  return (
    <div
      className="modal fade"
      id="modal"
      tabIndex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <p className="modal-title display-6" id="exampleModalLabel">
              {title}
            </p>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                FinishProcessWithToast(dispatch);
              }}
            ></button>
          </div>
          <div className="modal-body py-3">
            {context.userPredictionRef.current.length > 0 ? (
              <div className="list-group">
                <h4
                  className="list-group-item list-group-item-action active"
                  aria-current="true"
                >
                  What's your name?
                </h4>
                {context.userPredictionRef.current.map((e, index) => (
                  <a
                    href="#x"
                    className="list-group-item list-group-item-action"
                    key={index}
                    data-bs-dismiss="modal"
                    onClick={() => {
                      const email = e.includes("2152")
                        ? e.split(" - ")[1]
                        : e.split(" - ")[1] + "@gm.uit.edu.vn";
                      HandleSubmit(dispatch, context, email);
                    }}
                  >
                    {e.split(" - ")[0]}
                  </a>
                ))}
                <a
                  href="#x"
                  className="list-group-item list-group-item-action"
                  key="unknown"
                  data-bs-dismiss="modal"
                  onClick={() =>
                    HandleSelectGuest(context, dispatch, forceRerender)
                  }
                >
                  I'm a guest!
                </a>
              </div>
            ) : (
              <div>
                <label htmlFor="FormControlInput" className="form-label h4">
                  Enter your name
                </label>
                <input
                  type="text"
                  className="form-control mb-5"
                  id="FormControlInput"
                  placeholder="this is your name"
                  ref={nameRef}
                />
                <label htmlFor="FormControlInput" className="form-label h4">
                  Enter your gmail address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="FormControlInput"
                  placeholder="name@example.com"
                  ref={emailRef}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            {context.userPredictionRef.current.length === 0 && (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() =>
                  HandleSubmit(
                    dispatch,
                    context,
                    emailRef.current.value,
                    nameRef.current.value
                  )
                }
              >
                {footerBtn}
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={() => {
                FinishProcessWithToast(dispatch);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
