const SendMail = async (body) => {
  const url = process.env.REACT_APP_URL;
  const resp = await fetch(`${url}send-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return resp;
};

export default SendMail;
