import React, { useEffect, useState, useRef } from "react";
const FULL_DASH_ARRAY = 283;
function TimeCount({ timeQuestion, TimeOut, question, stop }) {
  const [time_limit, setTimeLimit] = useState(timeQuestion);
  const timeStart = useRef(timeQuestion);
  const [update, setUpdate] = useState(true);
  const stopTime = useRef(false);

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
  const calculateTimeFraction = () => {
    const rawTimeFraction = timeStart.current / time_limit;
    return rawTimeFraction - (1 / time_limit) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    return circleDasharray;
  };

  // const CountTime = () => {
  //   if (timeStart.current <= 0) {
  //     timeStart.current = 0;

  //     TimeOut();
  //   }
  //   if (timeStart.current > 0) {
  //     timeStart.current = timeStart.current - 1;
  //   }
  //   setUpdate(({ update }) => ({ update: !update }));

  //   setTimeout(() => {
  //     // CountTime();
  //   }, 1000);
  // };

  useEffect(() => {
    const TimeCountDown = setInterval(() => {
      if (timeStart.current <= 0) {
        timeStart.current = 0;
        if (stopTime.current) {
          clearInterval(TimeCountDown);
        }
        TimeOut();
      }
      if (timeStart.current > 0) {
        timeStart.current = timeStart.current - 1;
      }
      setUpdate(({ update }) => ({ update: !update }));
    }, 1000);
    return () => {
      clearInterval(TimeCountDown);
    };
  }, []);
  useEffect(() => {
    // net question
    if (!stop) {
      setTimeLimit(timeQuestion);
      timeStart.current = timeQuestion;
    } else {
      stopTime.current = true;
    }
  }, [question, stop]);

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
            strokeDasharray={setCircleDasharray()}
            className={
              timeStart.current > time_limit / 2
                ? "base-timer__path-remaining green"
                : timeStart.current > time_limit / 4
                ? "base-timer__path-remaining orange"
                : "base-timer__path-remaining red"
            }
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
        {timeStart.current ? formatTime(timeStart.current) : formatTime(0)}
      </span>
    </div>
  );
}

export default TimeCount;
