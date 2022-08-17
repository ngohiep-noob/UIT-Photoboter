import React from "react";

const Spinner = () => {
  return (
    <div id="spinner-backdrop">
      <div className="text-center loading">
        <span className="spinner-border" role="status"></span>
      </div>
    </div>
  );
};

export default Spinner