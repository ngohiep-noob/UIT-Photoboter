import React, { useState, useRef, useEffect } from "react";
import { Fade } from "react-bootstrap";
import { Paper, List, Fab } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import UserInfo from "./UserInfoRow";
import SendIcon from "@mui/icons-material/Send";

import Alert from '@mui/material/Alert';

const MessageBox = (props) => {
  const [sentAllMail, setSentAllMail] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingStatus, setSendingStatus] = useState(0);
  const userInfoListRef = useRef(new Array(props.userList.length).fill(null));
  const newUserRef = useRef(null);

  const ToggleSendMail = () => {
    if (!sentAllMail && !sending) {
      setSending(true);
    }
  };

  useEffect(() => {
    if (!props.show && sentAllMail) {
      setSentAllMail(false);
    }
  });

  useEffect(() => {
    if (sending === true) {
      Promise.all(
        userInfoListRef.current.map((e) => {
          return e.handleSendMail();
        })
      ).then((res) => {
        const status = {
          success: 0,
          fail: 0,
        };
        res.forEach((r) => {
          if (r === true) status.success++;
          if (r === false) status.fail++;
        });
        console.log("send all status:", status);
        if (status.success === props.userList.length) {
          setSentAllMail(true);
          setSendingStatus(1);
        } else {
          setSentAllMail(false);
        }
        setSending(false);
      });
    }
  }, [sending]);

  useEffect(() => {
    if(props.userList.length > 0){ // render default status
        
        setSendingStatus(0);
    }
    // reder status for register
    if(props.header === "Chúng ta làm quen nhé!" && props.userList.length === 0){
        setSendingStatus(5);
    }
  }, [props.show])

  return (
    <Fade in={props.show} appear={true} unmountOnExit={!props.show}>
      
      <div className="speech-bubble">
        <div className="msg-header row justify-content-between">
          <h1 className="col-10" style={{ width: "fit-content" }}>
            {props.header}
          </h1>
          <Fab
            color="error"
            size="medium"
            className="col-1 close-msg"
            onClick={() => props.ToggleToast()}
          >
            <CancelIcon />
          </Fab>
        </div>
        <div className="msg-body">

          {props.mode === 2 ? (
            <>
              {/* predictions */}
              {props.userList.length > 0 && (
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
                  <List sx={{ width: "100%", maxWidth: 650 }}>
                    {props.userList.map((e, i) => (
                      <UserInfo
                        setSendingStatus = {setSendingStatus} // toggle status
                        userInfo={e}
                        key={i}
                        ref={(el) => {
                          userInfoListRef.current[i] = el;
                        }}
                      />
                    ))}
                  </List>
                </Paper>
              )}

              {/* register new user */}
              <List
                sx={{
                  width: "100%",
                  maxWidth: 650,
                  backgroundColor: "#fefefe80",
                  p: 0,
                  my: 1,
                  borderRadius: "10px",
                }}
              >
                <UserInfo userInfo={{ name: "Tôi là người mới!", email: "" }} />
              </List>

              {/* button send all mail */}
              <div className="row justify-content-around" style={{ paddingRight: "2px", paddingTop: "3px" }} >

                {sendingStatus == 0 ? <Alert variant="filled" severity="info" className="col-8" style={{width: "45%", marginRight: "130px"}}>Hãy xem lại thông tin nhé!</Alert>
              : (sendingStatus == 1 ? <Alert variant="filled" severity="success" className="col-8" style={{width: "45%", marginRight: "175px"}} >Nhớ check mail của mình nha!</Alert>
              : (sendingStatus == 2 ? <Alert variant="filled" severity="error" className="col-8" style={{width: "50%", marginRight: "150px"}} >Mình gửi mail cho bạn không được rồi!</Alert>
              : (sendingStatus == 3 ? <Alert variant="filled" severity="warning" className="col-8" style={{width: "50%", marginRight: "150px"}} >Gmail này chưa hợp lệ rồi!</Alert> 
              : (sendingStatus == 4 ? <Alert variant="filled" severity="warning" className="col-8" style={{width: "40%", marginRight: "240px"}} >Bạn chưa điền tên!</Alert> 
              : <Alert variant="filled" severity="info" className="col-8" style={{width: "50%", marginRight: "85px"}} >Mời bạn đăng kí người mới</Alert> ))))}
                
                <Fab
                  variant="extended"
                  size="medium"
                  color="primary"
                  className="col-3 mt-1"
                  onClick={ToggleSendMail}
                  disabled={
                    sentAllMail || sending || props.userList.length === 0
                  }
                >
                  
                  send all
                  <SendIcon sx={{ ml: 1 }} ref={newUserRef} />

                  
                </Fab>
              </div>
            </>
          ) : (
            // mode 2: show notifications
            <p>{props.body}</p>
          )}
        </div>
      </div>
    </Fade>
  );
};

export default MessageBox;
