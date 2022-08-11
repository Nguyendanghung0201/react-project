import React, { useEffect, useState } from "react";
import fetchApi from "../utilities";

function Rank({ close }) {
  const [list, setList] = useState([]);
  const [active, setActive] = useState(1);
  const [listTop, setListTOp] = useState([]);
  const getRank = async () => {
    let data = await fetchApi("GET", "/crazygame/leaderboard", "", "");
    if (data.status) {
      setList(data.data.listTOp);
      setListTOp(data.data.topPoint);
    }
  };
  useEffect(() => {
    getRank();
  }, []);

  const rank = list.map((e, index) => {
    return (
      <div key={index} className="topuser">
        <div className="member-rank">{index + 1}</div>
        <a className="member-name right">{e.username}</a>
        <img
          className="member-flag"
          src={`./images/flags/type=${e.countryCode}.png`}
        />
        <a className="member-location member-location--link">{e.country}</a>
        <div className="member-level">{e.point}</div>
      </div>
    );
  });

  const ranktop = listTop.map((e, index) => {
    return (
      <div key={index} className="topuser">
        <div className="member-rank">{index + 1}</div>
        <a className="member-name right">{e.username}</a>
        <img
          className="member-flag"
          src={`./images/flags/type=${e.countryCode}.png`}
        />
        <a className="member-location member-location--link">{e.country}</a>
        <div className="member-level">{e.point}</div>
      </div>
    );
  });
  return (
    <div className="Content">
      <div className="header-rank">
        <button onClick={()=> setActive(1)} className={active == 1 ? "activerank" : ""}>
          Top High Score
        </button>
        <button onClick={()=> setActive(2)} className={active == 2 ? "activerank" : ""}>Total Score</button>
      </div>
      {active == 1  && ranktop }
      {active == 2  && rank }
    </div>
  );
}

export default Rank;
