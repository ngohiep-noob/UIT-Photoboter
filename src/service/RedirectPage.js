const SetSleepTime = (sec = 30, url = "http://map.mmlab.uit.edu.vn/") => {
  const id = window.setTimeout(() => {
    window.location.replace(url);
  }, sec*1000);
  return id;
};

const ClearSleepTime = (id) => {
  window.clearTimeout(id);
};

export {SetSleepTime, ClearSleepTime}