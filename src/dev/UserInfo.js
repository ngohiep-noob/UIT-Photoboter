import React, { useRef } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import TextEdit from "./TextEdit";

const UserInfo = (props) => {
  const nameRef = useRef(null);
  // const emailRef = useRef(null);

  const HandleEditClick = () => {
    nameRef.current.toggleEdit(true);
  }

  return (
    <>
      {props.userInfo && (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt="Travis Howard"
              src="https://i.stack.imgur.com/l60Hf.png"
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <React.Fragment>
                <TextEdit firstVal={props.userInfo.name} ref={nameRef}/>
              </React.Fragment>
            }
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="caption"
                color="text.primary"
              >
                {props.userInfo.email}
              </Typography>
            }
          />
          <ListItemIcon>
            <IconButton color="info" onClick={HandleEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton>
              <EmailIcon color="warning" />
            </IconButton>
          </ListItemIcon>
        </ListItem>
      )}
    </>
  );
};

export default UserInfo;
