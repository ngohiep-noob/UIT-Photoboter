import React from "react";
import { Fade } from "react-bootstrap";
import { IconButton, Button, Paper, List } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import UserInfo from "./UserInfo";
import SendIcon from "@mui/icons-material/Send";

// show / toggle / header body infor 
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

  ];


  return (
    <Fade in={props.show} appear={true}>
      <div className="speech-bubble">

        {/* HEADER */}
        <div className="msg-header row justify-content-between">
          <p className="h1 col-8">{props.header}</p>
          <IconButton
            color="error"
            size="large"
            className="col-1 close-msg"
            onClick={() => props.ToggleToast()}
          >
            <CancelIcon fontSize="30px" />
          </IconButton>
        </div>

        {/* BODY */}
        <div className="msg-body">
          {userList.length > 0 ? (
            <>
              {/* EACH PERSON */}
              <Paper elevation={0} style={{ maxHeight: 250, overflow: "auto", backgroundColor: "#e4fdffae",}}>
                <List sx={{ width: "100%", maxWidth: 450 }}>
                  {userList.map((e) => (<UserInfo userInfo={e} />))}
                </List>
              </Paper>

              {/* SEND ALL */}
              <div className="row justify-content-end" style={{ paddingRight: "10px", paddingTop: 20 }}>
                <Button className="col-5" variant="contained" endIcon={<SendIcon />}> Send all </Button>
              </div>
            </>

          ) : ( <p>{props.body}</p> )}
        </div>

      </div>
    </Fade>
  );
};

export default MessageBox;
