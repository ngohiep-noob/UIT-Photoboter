import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { TextField, Typography } from "@mui/material";
import { ProcessContextDispatch, ProcessContextState } from "../../App";

const TextEditor = (props, ref) => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;
  const [edit, toggleEdit] = useState(false);
  const [data, setData] = useState(props.firstVal);

  const UpdateData = (val) => {
    let dataList;
    if (props.isGuest === true) {
      dataList = context.messageOptions.current.guestList;
    } else {
      dataList = context.messageOptions.current.userList;
    }
    // console.log(dataList[props.index]);
    if (props.label === "Name") {
      dataList[props.index].name = val;
    } else {
      dataList[props.index].email = val;
    }
    if (props.isGuest === true) {
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        guestList: dataList,
      });
    } else {
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: dataList,
      });
    }
    setData(val);
  };
  useImperativeHandle(ref, () => ({
    toggleEdit: (value) => toggleEdit(value),
    getData: () => data,
    setData: UpdateData,
  }));

  const HandleChange = (e) => {
    UpdateData(e.target.value);
  };

  return (
    <>
      {edit ? (
        <TextField
          label={props.label}
          onChange={HandleChange}
          size="small"
          value={data}
          sx={{ my: 1 }}
        />
      ) : (
        <Typography
          variant={props.label === "Name" ? "h6" : "caption"}
          color={props.label === "Name" ? "text.primary" : "text.secondary"}
          sx={{ maxWidth: "400px" }}
        >
          {data}
        </Typography>
      )}
    </>
  );
};

export default forwardRef(TextEditor);
