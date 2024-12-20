import React, { useState, useRef, useEffect, useContext } from "react";
import { Fade } from "react-bootstrap";
import { Paper, List, Fab } from "@mui/material";
import UserInfo from "./UserInfoRow";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import Alert from "@mui/material/Alert";
import PlayAudio from "../../util/PlayAudio";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import { CanInterceptAfter } from "../../constant/constants";

const MessageBox = (props) => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;
  const [sentAllMail, setSentAllMail] = useState(false);
  const [sending, setSending] = useState(false);
  // status: default - 0 | info - 1 | success - 2 | error - 3 | warning - 4
  const [sendingStatus, setSendingStatus] = useState(0);
  const [defaultMsg, setDefaultMsg] = useState(null);
  const userInfoListRef = useRef(
    new Array(props.messageOptions.userList.length).fill(null)
  );
  const GuestInfoListRef = useRef(
    new Array(props.messageOptions.guestList.length).fill(null)
  );

  const ToggleSendMail = () => {
    if (!sentAllMail && !sending) {
      setSending(true);
    }
  };

  const handleCloseClick = () => {
    dispatch.setAutoCloseMsgBoxRef(false); // close annually
    dispatch.setShowMsgBox(false);
  };

  const screenShotAgain = () => {
    dispatch.setShowMsgBox(false); // mode 2.1 -> mode 1
    dispatch.setBreakProcessRef(true);
    dispatch.setAutoCloseMsgBoxRef(true);
    setTimeout(() => {
      dispatch.setBreakPermission(true);
    }, 3000);
  };

  const handleClickNoMode3 = () => {
    dispatch.setShowMsgBox(false);
    setTimeout(() => {
      PlayAudio("continue");
      dispatch.setMessageOptions({
        // mode 3 -> mode 2.1
        ...context.messageOptions.current,
        mode: 2.1,
        header: "Mình tiếp tục nào!",
      });
      dispatch.setShowMsgBox(true);
    }, 550);
    setTimeout(() => {
      dispatch.setBreakPermission(true);
    }, CanInterceptAfter * 1000);
  };

  useEffect(() => {
    if (!props.show && sentAllMail) {
      setSentAllMail(false);
    }
  });

  useEffect(() => {
    if (sending === true) {
      const promises = [];
      userInfoListRef.current.forEach((e) => {
        promises.push(e.handleSendMail());
      });
      GuestInfoListRef.current.forEach((e) => {
        promises.push(e.handleSendMail());
      });

      Promise.all([...promises]).then((res) => {
        const status = {
          success: 0,
          fail: 0,
        };
        res.forEach((r) => {
          if (r === true) status.success++;
          if (r === false) status.fail++;
        });
        console.log("send user:", status);
        if (
          status.success ===
          props.messageOptions.userList.length +
            props.messageOptions.guestList.length
        ) {
          setSentAllMail(true);
          setSendingStatus(1);
          setTimeout(() => {
            handleCloseClick();
          }, 1500);
        } else {
          setSentAllMail(false);
          setSendingStatus(2);
        }
        setSending(false);
      });
    }
  }, [sending]);

  useEffect(() => {
    if (
      props.messageOptions.mode === 2.1 &&
      props.show &&
      props.messageOptions.header !== "Mình tiếp tục nào!"
    ) {
      userInfoListRef.current = new Array(
        props.messageOptions.userList.length
      ).fill(null);
      GuestInfoListRef.current = new Array(
        props.messageOptions.guestList.length
      ).fill(null);
      console.log("reset userListRef and guestListRef");
    }
  });

  const handleHiddenCloseBtn = () => {
    if (
      props.messageOptions.header === "Cảm ơn bạn nhé!" ||
      props.messageOptions.mode === 2.2 ||
      props.messageOptions.mode === 3
    ) {
      return "none";
    }
    return "inline-flex";
  };

  useEffect(() => {
    if (props.messageOptions.userList.length > 0) {
      // render default status
      setSendingStatus(0);
    }
  }, [props.show]);

  return (
    <Fade in={props.show} appear={true}>
      <div className="speech-bubble">
        <div className="msg-header row justify-content-between">
          <h1 className="col-10" style={{ width: "fit-content" }}>
            {props.messageOptions.header}
          </h1>

          <Fab
            color="error"
            size="medium"
            className="col-1 close-msg"
            onClick={handleCloseClick}
            sx={{ display: handleHiddenCloseBtn() }}
          >
            <CancelIcon />
          </Fab>
        </div>
        <div className="msg-body">
          {props.messageOptions.mode === 2.1 && (
            // mode 2.1: render prediction
            <>
              {/* user List */}
              {props.messageOptions.userList.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    maxHeight: 250,
                    overflow: "auto",
                    backgroundColor: "#fefefe80",
                    borderRadius: "10px",
                    position: "relative",
                    margin: "0 0 15px",
                  }}
                >
                  <List sx={{ width: "100%", maxWidth: 650 }}>
                    {props.messageOptions.userList.map((e, index) => (
                      <UserInfo
                        isGuest={false}
                        userInfo={e}
                        key={index}
                        index={index}
                        setSendingStatus={setSendingStatus}
                        setDefaultMsg={setDefaultMsg}
                        ref={(el) => (userInfoListRef.current[index] = el)}
                      />
                    ))}
                  </List>
                </Paper>
              )}

              {/* guest List */}
              {props.messageOptions.guestList.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    maxHeight: 250,
                    overflow: "auto",
                    backgroundColor: "#fefefe80",
                    borderRadius: "10px",
                    position: "relative",
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 650,
                    }}
                  >
                    {props.messageOptions.guestList.map((current, index) => (
                      <UserInfo
                        isGuest={true}
                        userInfo={current}
                        key={index}
                        index={index}
                        setSendingStatus={setSendingStatus}
                        setDefaultMsg={setDefaultMsg}
                        ref={(el) => (GuestInfoListRef.current[index] = el)}
                      />
                    ))}
                  </List>
                </Paper>
              )}

              {/* button send all mail */}
              {
                <div
                  className="row justify-content-end"
                  style={{ paddingRight: "10px", paddingTop: "10px" }}
                >
                  {sendingStatus === 0 ? (
                    <Alert
                      variant="filled"
                      severity={defaultMsg ? "error" : "info"}
                      className="col-4"
                      style={{ width: "45%", marginRight: "60px" }}
                    >
                      {defaultMsg || "Hãy xem lại thông tin nhé!"}
                    </Alert>
                  ) : sendingStatus === 1 ? (
                    <Alert
                      variant="filled"
                      severity="success"
                      className="col-4"
                      style={{ width: "45%", marginRight: "60px" }}
                    >
                      Nhớ check mail của mình nha!
                    </Alert>
                  ) : sendingStatus === 2 ? (
                    <Alert
                      variant="filled"
                      severity="error"
                      className="col-4"
                      style={{ width: "50%", marginRight: "60px" }}
                    >
                      Mình gửi mail cho bạn không được rồi!
                    </Alert>
                  ) : sendingStatus === 3 ? (
                    <Alert
                      variant="filled"
                      severity="warning"
                      className="col-4"
                      style={{ width: "50%", marginRight: "60px" }}
                    >
                      Gmail này chưa hợp lệ!
                    </Alert>
                  ) : sendingStatus === 4 ? (
                    <Alert
                      variant="filled"
                      severity="warning"
                      className="col-4"
                      style={{ width: "45%", marginRight: "60px" }}
                    >
                      Bạn chưa điền tên!
                    </Alert>
                  ) : (
                    <Alert
                      variant="filled"
                      severity="info"
                      className="col-4"
                      style={{ width: "50%", marginRight: "60px" }}
                    >
                      Mời bạn đăng kí người mới
                    </Alert>
                  )}

                  <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    className="col-2"
                    onClick={ToggleSendMail}
                    disabled={
                      sentAllMail ||
                      sending ||
                      props.messageOptions.userList.length === 0
                    }
                    sx={{
                      marginRight: "15px",
                    }}
                  >
                    Gửi hết
                    <SendIcon sx={{ ml: 1 }} />
                  </Fab>

                  <Fab
                    variant="extended"
                    size="medium"
                    color="error"
                    className="col-2"
                    onClick={screenShotAgain}
                  >
                    Chụp lại
                    <CameraEnhanceIcon sx={{ ml: 1 }} />
                  </Fab>
                </div>
              }
            </>
          )}
          {props.messageOptions.mode === 2.2 && (
            <>
              <h3>Có lỗi xảy ra, hãy thử lại trong giây lát nhé!</h3>
            </>
          )}
          {props.messageOptions.mode === 1 && (
            // mode 1: show notifications
            <div className="d-flex flex-column align-items-center">
              <p>{props.messageOptions.body}</p>
              {props.messageOptions.body ===
                "Mình là UIT-Photoboter! Hãy lại gần camera và vẫy tay lên để chụp hình nhé!"}
            </div>
          )}
          {props.messageOptions.mode === 3 && (
            <div>
              <h3>{props.messageOptions.body}</h3>
              <div className="d-flex justify-content-evenly mt-2">
                <Fab
                  variant="extended"
                  size="medium"
                  color="success"
                  onClick={screenShotAgain}
                >
                  đúng vậy
                  <CheckCircleIcon sx={{ ml: 1 }} />
                </Fab>
                <Fab
                  variant="extended"
                  size="medium"
                  color="error"
                  onClick={handleClickNoMode3}
                >
                  quay lại
                  <CancelIcon sx={{ ml: 1 }} />
                </Fab>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
};

export default MessageBox;
