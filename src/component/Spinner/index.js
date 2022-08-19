import React, { useContext, useEffect, useState } from "react";
import { ProcessContextDispatch, ProcessContextState } from "../../App";

const Spinner = () => {
  const [show, setShowSpinner] = useState(true);
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;

  useEffect(() => {
    console.log('spinner render');
    dispatch.addContextDispatch(setShowSpinner, 'setShowSpinner');
  }, [])

  useEffect(() => {
    console.log('spinner re-render')
  })

  return (
    <>
      {show && (
        <div id="spinner-backdrop">
          <div className="text-center loading">
            <span className="spinner-border" role="status"></span>
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
