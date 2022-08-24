const SetSleepTime = (sec = 60, url = "http://map.mmlab.uit.edu.vn/") => {
  console.log('sleep');
  const id = window.setTimeout(() => {
    window.location.replace(url);
  }, sec*1000);
  return id;
};

const ClearSleepTime = (id) => {
  console.log('wake up');
  window.clearTimeout(id);
};

export {SetSleepTime, ClearSleepTime}