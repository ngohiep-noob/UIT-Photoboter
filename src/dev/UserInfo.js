import React, { useEffect, useRef, useState } from "react";
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
import SaveIcon from '@mui/icons-material/Save';
import TextEdit from "./TextEdit";

const UserInfo = (props) => {
  const nameRef = useRef(null);
  const [save, setSave] = useState(false)
  const HandleEditClick = () => {
    nameRef.current.toggleEdit(true);
    setSave(!save);
    
  }

  const SaveToDatabase = () => {
    setSave(!save);
    console.log("Thông tin mới là: ", nameRef.current.getData())
  }



  return (
    <>
      {props.userInfo && (
        <ListItem alignItems="flex-start">

              {/*AVATAR  */}
            <ListItemAvatar>
              <Avatar
                alt="Travis Howard"
                src="https://i.stack.imgur.com/l60Hf.png"
              />
            </ListItemAvatar>

          {/* INFOR */}
          <ListItemText

            primary={
              <React.Fragment>
                <TextEdit firstVal={props.userInfo.name} ref={nameRef}/>
              </React.Fragment>
            }
            
            // change here with text edit
            secondary={ 
              <Typography sx={{ display: "inline" }} component="span" variant="caption" color="text.primary">
                {props.userInfo.email}
              </Typography>
            }
          />

          {/* EDIT AND GMAIL */}
          <ListItemIcon>

              <IconButton color ="info" >
                {save ? <SaveIcon onClick={SaveToDatabase}/> : <EditIcon onClick={HandleEditClick}/> }
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
