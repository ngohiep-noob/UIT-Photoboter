const SendMail = async (body) => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.PUBLIC_URL;
  const resp = await fetch(url + "/send-mail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return resp;
};

export default SendMail;
