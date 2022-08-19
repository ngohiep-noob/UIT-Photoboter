import React, { useContext, useEffect, useRef, useState } from "react";
import { ProcessContextState, ProcessContextDispatch } from "../../App";
import HandleSubmit from "./HandleSubmit";
import FinishProcessWithToast from "./FinishProcess";
import { HandleSelectGuest } from "./HandleRegister";
import { ListGroup, Button, Modal, Form, FormGroup, CloseButton } from "react-bootstrap";

const MailModal = ({ title = "Xin chào", footerBtn = "Gửi email" }) => {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const context = useContext(ProcessContextState).current;
  const dispatch = useContext(ProcessContextDispatch);

  function HandleClose(finish = false) {
    setShowModal(false);
    if(finish) FinishProcessWithToast(dispatch, context);
    if (
      emailRef.current !== null &&
      nameRef.current !== null &&
      context.userPredictionRef.current.length === 0
    ) {
      emailRef.current.value = "";
      nameRef.current.value = "";
    }
  }

  useEffect(() => {
    const ToggleModal = (status = false) => {
      setShowModal(status);
    };
    dispatch.addContextDispatch(ToggleModal, 'ToggleModal')
    console.log("modal render!");
  }, []);

  useEffect(() => {
    console.log("modal re-render!");
  });

  return (
    <Modal
      show={showModal}
      backdrop="static"
      onHide={HandleClose}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <CloseButton onClick={() => HandleClose(true)}/>
      </Modal.Header>
      <Modal.Body>
        {context.userPredictionRef.current.length > 0 ? (
          <ListGroup>
            <ListGroup.Item className="h4" active>
              Hãy chọn tên của bạn
            </ListGroup.Item>
            {context.userPredictionRef.current.map((e, index) => (
              <ListGroup.Item
                action
                onClick={() => {
                //   const email = e.includes("2152")
                //     ? e.split(" - ")[1] + "@gm.uit.edu.vn"
                //     : e.split(" - ")[1];
                    const email = 'hoanghiephai@gmail.com'
                  HandleSubmit(dispatch, context, email);
                  HandleClose();
                }}
                href={`#x`}
                key={`#${index}`}
              >
                {e.split(" - ")[0]}
              </ListGroup.Item>
            ))}
            <ListGroup.Item
              href="#unknown"
              action
              onClick={() => {
                HandleClose();
                HandleSelectGuest(context, dispatch);
              }}
            >
              Không có tên của tôi.
            </ListGroup.Item>
          </ListGroup>
        ) : (
          <Form>
            <FormGroup>
              <Form.Label htmlFor="name-input" >Nhập tên của bạn</Form.Label>
              <Form.Control
                id="name-input"
                placeholder="Ngô Đức Hoàng Hiệp"
                type="text"
                ref={nameRef}
              ></Form.Control>
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor="email-input" >Nhập email của bạn</Form.Label>
              <Form.Control
                id="email-input"
                placeholder="example@gmail.com"
                type="email"
                ref={emailRef}
              ></Form.Control>
            </FormGroup>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {context.userPredictionRef.current.length === 0 && (
          <Button
            variant="primary"
            onClick={() => {
              HandleSubmit(
                dispatch,
                context,
                emailRef.current.value,
                nameRef.current.value
              );
              HandleClose();
            }}
          >
            {footerBtn}
          </Button>
        )}

        <Button variant="danger" onClick={() => HandleClose(true)}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MailModal;
