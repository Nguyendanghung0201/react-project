import React, { useState, Suspense, useEffect, useCallback } from "react";
import Home from "./component/home/index";
import "katex/dist/katex.min.css";
import jwt_decode from "jwt-decode";

import socketIOClient from "socket.io-client";
import fetchApi from "./component/utilities";
// const ENDPOINT = "http://139.59.238.195:8888";
const socket = socketIOClient();
const GameOne = React.lazy(() => import("./component/game/game"));
const GameBattle = React.lazy(() =>
  import("./component/gameonline/gamebattle")
);
function App() {
  const [page, setPage] = useState("home");
  const [player, setPlayer] = useState(false);
  const [user, setUser] = useState(false);
  const [location, setLocation] = useState(false);

  const initialize = useCallback(async () => {
    fetch("http://ip-api.com/json")
      .then((json) => json.json())
      .then((data) => {
        if (data.status === "success") {
          setLocation(data);
        }
      });
    let random = localStorage.getItem("player");
    if (!random) {
      let data = await fetchApi(
        "GET",
        "/number",
        {},
        ""
      );
      if (data.status) {
        localStorage.setItem("player", data.data);
        setPlayer(data.data);
      }
    } else {
      setPlayer(random);
    }
    let decode = localStorage.getItem("decode");
    let playerfb = localStorage.getItem("facebooktoken");
    if (decode) {
      let time = localStorage.getItem("setupTime");
      let timecount = new Date().getTime();
      if (time && timecount - parseInt(time) > 1000 * 60 * 60 * 24 * 7) {
        localStorage.removeItem("decode");
      } else {
        let userObject = jwt_decode(decode);
        updateUser({
          id: userObject.iat,
          email: userObject.email,
          username: userObject.name,
          avt: userObject.picture,
          type: 3,
        });
      }
    } else {
      if (playerfb) {
        let time = localStorage.getItem("setupTimefb");
        let timecount = new Date().getTime();
        if (time && timecount - parseInt(time) > 1000 * 60 * 60 * 24 * 7) {
          localStorage.removeItem("facebooktoken");
        } else {
          let response = JSON.parse(playerfb);
          updateUser({
            id: response.id,
            email: response.email,
            username: response.name,
            avt: response.picture?.data?.url ?? "",
            type: 2,
          });
        }
      } else {
        let token = localStorage.getItem("playerset");
        if (token && random) {
          updateUser({
            id: random,
            username: token,
            type: 1,
          });
        }
      }
    }
  }, []);
  function updatePage(data) {
    setPage(data);
  }
  function updateUser(data) {
    setUser(data);
  }
  useEffect(() => {
    initialize();
  }, []);

  return (
    <React.Fragment>
      {page === "home" ? (
        <Home
          location={location}
          player={player}
          updatePage={updatePage}
          updateUser={updateUser}
          user={user}
        />
      ) : page === "game" ? (
        <Suspense fallback={<div> </div>}>
          <GameOne
            location={location}
            updatePage={updatePage}
            user={user}
            player={player}
          />
        </Suspense>
      ) : (
        <Suspense fallback={<div> </div>}>
          <GameBattle
            location={location}
            player={player}
            user={user}
            socket={socket}
            updatePage={updatePage}
          />
        </Suspense>
      )}
    </React.Fragment>
  );
}

export default App;
