import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextField, Typography } from "@mui/material";

const TextEditor = (props, ref) => {
  const [edit, toggleEdit] = useState(false);
  const [data, setData] = useState(props.firstVal);
  useImperativeHandle(ref, () => ({
    toggleEdit: (val) => toggleEdit(!edit),
    getData: () => data
  }));

  const HandleChange = (e) => {
    setData(e.target.value);
  }

  return (
    <>
      {edit ? (
        <TextField label="name" variant="standard" onChange={HandleChange} value={data}/>
      ) : (
        <Typography variant="body1">
            {data}
        </Typography>
      )}
    </>
  );
};

export default forwardRef(TextEditor);
