import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Typography,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ProcessContextDispatch, ProcessContextState } from "../../App";
import GetNameById from "../../util/GetNameByID";

const AutoFillEmail = (props) => {
  // props = {getData, setData}
  const handleClick = async (e) => {
    props.setDefaultMsg(null);
    let currentText = props.getData();

    if (currentText !== "" && currentText.includes("@")) {
      currentText = currentText.split("@")[0];
    }

    if (e.target.innerText === "@uit") {
      try {
        const res = await GetNameById(currentText);
        if (res.code === 1 && res.data.hoten !== null) {
          props.setNameField(res.data.hoten);
        } else {
          props.setDefaultMsg(
            "Gmail UIT không tồn tại. Hãy kiểm tra lại thông tin!"
          );
          return;
        }
        if (/^[\d]*[\d*]$/.test(currentText)) {
          props.setData(currentText + "@gm.uit.edu.vn");
        }
        if (/^[\D]*[\D*]$/.test(currentText)) {
          props.setData(currentText + "@uit.edu.vn");
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (e.target.innerText === "@gmail") {
      if (/^\w/.test(currentText)) {
        props.setData(currentText + "@gmail.com");
      }
    }
  };
  return (
    <div
      style={{
        width: "100px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="caption"
        onClick={handleClick}
        sx={{ textDecoration: "underline", color: "#000", fontSize: "15px" }}
      >
        @uit
      </Typography>

      <Typography
        variant="caption"
        onClick={handleClick}
        sx={{ textDecoration: "underline", color: "#000", fontSize: "15px" }}
      >
        @gmail
      </Typography>
    </div>
  );
};

const TextEditor = (props, ref) => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;
  const [edit, toggleEdit] = useState(false);
  const [data, setData] = useState(props.firstVal || "");

  const UpdateData = (val) => {
    let dataList;
    if (props.isGuest === true) {
      dataList = context.messageOptions.current.guestList;
    } else {
      dataList = context.messageOptions.current.userList;
    }
    //update static data in `context.messageOptions`
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

  // on change edit mode, update data
  useEffect(() => {
    props.setDefaultMsg(null);
  }, [edit]);

  useImperativeHandle(ref, () => ({
    toggleEdit: (value) => toggleEdit(value),
    getData: () => data,
    setData: UpdateData,
  }));

  const HandleChange = async (e) => {
    const val = e.target.value;
    const lastChar = val[val.length - 1];
    props.setDefaultMsg(null);
    UpdateData(val);
    const isUitStudentMail = (addr) => /^\d{2}52\d{4,}$/.test(addr);
    if (val.includes("@")) {
      const mailDomain = val.split("@")[1];
      const mailAddress = val.split("@")[0];

      if (
        isUitStudentMail(mailAddress) &&
        "gm.uit.edu.vn".startsWith(mailDomain) === false
      ) {
        props.setDefaultMsg(
          "Định dạng gmail UIT chưa đúng. Click vào @uit để tự động điền!"
        );
        return;
      }
    }

    if (lastChar === "@") {
      const mailAddress = val.split("@")[0];

      const res = await GetNameById(mailAddress);
      if (res.code === 1 && res.data.hoten !== null) {
        props.setNameField(res.data.hoten);

        if (isUitStudentMail(mailAddress)) {
          setData(mailAddress + "@gm.uit.edu.vn");
        }
        if (/^[\D]*[\D*]$/.test(mailAddress)) {
          setData(mailAddress + "@uit.edu.vn");
        }
      } else {
        // if email starts with \d{2}52, then push messages
        if (isUitStudentMail(mailAddress)) {
          props.setDefaultMsg(
            "Có vẻ bạn đã nhập sai mã số sinh viên. Hãy kiểm tra lại!"
          );
        }
      }
    }
  };

  const HandleFocus = (type) => {
    if (type === "in") {
      dispatch.setShowKeyBoard(true);
      dispatch.setKeyBoardInputCallBack(UpdateData, data);
    }
    if (type === "out") {
      dispatch.setShowKeyBoard(false);
    }
  };

  return (
    <>
      {edit ? (
        props.label === "Name" ? (
          <FormControl sx={{ width: "370px" }}>
            <InputLabel htmlFor="name-input">{props.label}</InputLabel>
            <OutlinedInput
              id="name-input"
              label={props.label}
              onChange={HandleChange}
              onFocus={() => HandleFocus("in")}
              onBlur={() => HandleFocus("out")}
              size="small"
              value={data}
              sx={{ my: 1 }}
            />
          </FormControl>
        ) : (
          <FormControl sx={{ width: "370px" }}>
            <InputLabel htmlFor="email-input">{props.label}</InputLabel>
            <OutlinedInput
              id="email-input"
              label={props.label}
              onChange={HandleChange}
              onFocus={() => HandleFocus("in")}
              onBlur={() => HandleFocus("out")}
              size="small"
              value={data}
              sx={{ my: 1 }}
              autoFocus={true}
              endAdornment={
                <InputAdornment position="end">
                  <AutoFillEmail
                    setData={UpdateData}
                    getData={() => data}
                    setNameField={props.setNameField}
                    setDefaultMsg={props.setDefaultMsg}
                  />
                </InputAdornment>
              }
            />
          </FormControl>
        )
      ) : (
        <Typography
          variant={props.label === "Name" ? "body2" : "subtitle2"}
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
