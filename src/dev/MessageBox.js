import React, { useState } from "react";
import { Fade } from "react-bootstrap";
import { Button, Paper, List, Fab } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import UserInfo from "./UserInfo";
import SendIcon from "@mui/icons-material/Send";
const MessageBox = (props) => {
  const userList = [
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
    {
      name: "Ngo Duc Hoang Hiep",
      email: "hoanghiephai@gmail.com",
    },
  ];
  const [sendingAllMail, setSendingAllMail] = useState(false);

  const ToggleSendMail = () => {
    if (!sendingAllMail) {
      setSendingAllMail(true);
      window.setTimeout(() => {
        setSendingAllMail(false);
      }, 3000);
    }
  };

  return (
    <Fade in={props.show} appear={true}>
      <div className="speech-bubble">
        <div className="msg-header row justify-content-between">
          <p className="h1 col-8">{props.header}</p>
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
          {userList.length > 0 ? (
            <>
              <Paper
                elevation={0}
                style={{
                  maxHeight: 250,
                  overflow: "auto",
                  backgroundColor: "#e4fdffae",
                  position: "relative",
                }}
              >
                <List sx={{ width: "100%", maxWidth: 650 }}>
                  {userList.map((e) => (
                    <UserInfo userInfo={e} />
                  ))}
                </List>
              </Paper>

              <List sx={{ width: "100%", maxWidth: 650 }}>
                <UserInfo userInfo={{ name: "Khong co ten toi!", email: "" }} />
              </List>

              <div
                className="row justify-content-end"
                style={{ paddingRight: "10px", paddingTop: 20 }}
              >
                <LoadingButton
                  className="col-3"
                  onClick={ToggleSendMail}
                  endIcon={<SendIcon />}
                  loading={sendingAllMail}
                  loadingPosition="end"
                  variant="contained"
                  sx={{
                    borderRadius: "15px",
                  }}
                >
                  Send All
                </LoadingButton>
              </div>
            </>
          ) : (
            <p>{props.body}</p>
          )}
        </div>
      </div>
    </Fade>
  );
};

export default MessageBox;
