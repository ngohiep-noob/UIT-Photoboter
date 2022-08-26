import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { Fade } from "react-bootstrap";
import { Paper, List, Fab } from "@mui/material";
import UserInfo from "./UserInfoRow";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import Alert from "@mui/material/Alert";

const MessageBox = (props) => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;
  const [sentAllMail, setSentAllMail] = useState(false);
  const [sending, setSending] = useState(false);
  // status: default - 0 | info - 1 | success - 2 | error - 3 | warning - 4
  const [sendingStatus, setSendingStatus] = useState(0);
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
    dispatch.setShowMsgBox(false);
    dispatch.setAutoCloseMsgBoxRef(false); // close annually
  };

  const handleClickYesMode3 = () => {
    dispatch.setShowMsgBox(false); // mode 3 -> mode 1
    dispatch.setAutoCloseMsgBoxRef(true);
    dispatch.setBreakProcessRef(true);
  };

  const handleClickNoMode3 = () => {
    dispatch.setShowMsgBox(false);
    dispatch.setAutoCloseMsgBoxRef(false);
    setTimeout(() => {
      dispatch.setMessageOptions({
        // mode 3 -> mode 2.1
        ...context.messageOptions.current,
        mode: 2.1,
        header: "Mình tiếp tục nào!",
      });
      dispatch.setShowMsgBox(true);
    }, 550);
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
        } else {
          setSentAllMail(false);
          setSendingStatus(2);
        }
        setSending(false);
      });
    }
  }, [sending]);

  useEffect(() => {
    // console.log(
    //   "render msgBox mode",
    //   props.messageOptions.mode,
    //   "show",
    //   props.show
    // );
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
                    maxHeight: 150,
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
                      severity="info"
                      className="col-8"
                      style={{ width: "45%", marginRight: "200px" }}
                    >
                      Hãy xem lại thông tin nhé!
                    </Alert>
                  ) : sendingStatus === 1 ? (
                    <Alert
                      variant="filled"
                      severity="success"
                      className="col-8"
                      style={{ width: "45%", marginRight: "175px" }}
                    >
                      Nhớ check mail của mình nha!
                    </Alert>
                  ) : sendingStatus === 2 ? (
                    <Alert
                      variant="filled"
                      severity="error"
                      className="col-8"
                      style={{ width: "50%", marginRight: "170px" }}
                    >
                      Mình gửi mail cho bạn không được rồi!
                    </Alert>
                  ) : sendingStatus === 3 ? (
                    <Alert
                      variant="filled"
                      severity="warning"
                      className="col-8"
                      style={{ width: "50%", marginRight: "160px" }}
                    >
                      Gmail này chưa hợp lệ!
                    </Alert>
                  ) : sendingStatus === 4 ? (
                    <Alert
                      variant="filled"
                      severity="warning"
                      className="col-8"
                      style={{ width: "45%", marginRight: "200px" }}
                    >
                      Bạn chưa điền tên!
                    </Alert>
                  ) : (
                    <Alert
                      variant="filled"
                      severity="info"
                      className="col-8"
                      style={{ width: "50%", marginRight: "85px" }}
                    >
                      Mời bạn đăng kí người mới
                    </Alert>
                  )}

                  <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    className="col-4"
                    onClick={ToggleSendMail}
                    disabled={
                      sentAllMail ||
                      sending ||
                      props.messageOptions.userList.length === 0
                    }
                  >
                    send all
                    <SendIcon sx={{ ml: 1 }} />
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
            <p>{props.messageOptions.body}</p>
          )}
          {props.messageOptions.mode === 3 && (
            <div>
              <h3>{props.messageOptions.body}</h3>
              <div className="d-flex justify-content-evenly mt-2">
                <Fab
                  variant="extended"
                  size="medium"
                  color="success"
                  onClick={handleClickYesMode3}
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
