import React from "react";
import { Fade } from "react-bootstrap";
import { IconButton, Button, Paper, List } from "@mui/material";
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
  return (
    <Fade in={props.show} appear={true}>
      <div className="speech-bubble">
        <div className="msg-header row justify-content-between">
          <p className="h1 col-8">{props.header}</p>
          {/* <div className="col-1 close-msg" onClick={() => props.ToggleToast()}>
            <img src={require("./image/cancel.png")} />
          </div> */}
          <IconButton
            color="error"
            size="large"
            className="col-1 close-msg"
            onClick={() => props.ToggleToast()}
          >
            <CancelIcon fontSize="30px" />
          </IconButton>
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
                }}
              >
                <List sx={{ width: "100%", maxWidth: 450 }}>
                  {userList.map((e) => (
                    <UserInfo userInfo={e} />
                  ))}
                </List>
              </Paper>
              <div
                className="row justify-content-end"
                style={{ paddingRight: "10px", paddingTop: 20 }}
              >
                <Button
                  className="col-5"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Send all
                </Button>
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
