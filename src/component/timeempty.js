import React, { useEffect, useState } from "react";
const FULL_DASH_ARRAY = 283;
function TimeEmpty({timeQuestion}) {
  let [time, setTime] = useState(timeQuestion);
  const [time_limit] = useState(timeQuestion);
  const [color] = useState({
    info: {
      color: "green",
    },
    warning: {
      color: "orange",
      threshold: 10, //WARNING_THRESHOLD
    },
    alert: {
      color: "red",
      threshold: 5, //ALERT_THRESHOLD
    },
  });
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  };


  return (
    <div className="base-timer">
      <svg
        className="base-timer__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="base-timer__circle">
          <circle
            className="base-timer__path-elapsed"
            cx="50"
            cy="50"
            r="45"
          ></circle>
          <path
            id="base-timer-path-remaining"
            strokeDasharray="283 283"
            className= "base-timer__path-remaining green"
            d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" className="base-timer__label">
       {formatTime(timeQuestion)}
      </span>
    </div>
  );
}

export default TimeEmpty;
