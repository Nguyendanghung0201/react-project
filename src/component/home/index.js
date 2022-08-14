import React, { useEffect, useState, useRef } from "react";
import fetchApi from "../utilities";
import Rank from "./rank";

let audio = new Audio("./sound/lobby.mp3");
function Home({ updatePage, updateUser, user, player, location }) {
  const [currentValue, setCurrentValue] = useState("");
  const [statusSound, setStatusSound] = useState(true);
  const [rank, setRank] = useState(false);
  const ref = useRef();
  function handleChange(evt) {
    setCurrentValue(evt.currentTarget.value);
  }

  const playerReady = (data) => {
    if (!user || !user.id) {
      ref.current.focus();
    } else {
      updatePage(data);
    }
  };

  // const handleCredentialResponse = async (data) => {
  //   if (data.credential) {
  //     let userObject = jwt_decode(data.credential);
  //     var now = new Date().getTime();
  //     localStorage.setItem("setupTime", now);
  //     localStorage.setItem("decode", data.credential);
  //     updateUser({
  //       id: userObject.sub,
  //       email: userObject.email,
  //       username: userObject.name,
  //       avt: userObject.picture,
  //       type: 3,
  //     });
  //     if (userObject.email) {
  //       userObject.location = location;
  //       let response = await fetchApi(
  //         "POST",
  //         "/api/logingoogle",
  //         userObject,
  //         ""
  //       );
  //     }
  //   }
  // };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && currentValue) {
      event.target.blur();
    }
  };
  const saveUser = () => {
    fetchApi(
      "POST",
      "/api/loginplayer",
      {
        id: player,
        username: currentValue ?? "GUEST",
        location,
      },
      ""
    );
  };
  const hander = (event) => {
    if (currentValue) {
      localStorage.setItem("playerset", currentValue);
      saveUser();
      updateUser({
        id: player,
        username: currentValue,
        type: 1,
      });
    }
  };
  useEffect(() => {
    //  global google
    // if (window.CrazyGames) {
    //   const crazysdk = window.CrazyGames.CrazySDK.getInstance(); // getting the SDK
    //   crazysdk.init();
    //   crazysdk.requestAd("midgame");
    // }
    // if (window.google) {
    //   window.google.accounts.id.initialize({
    //     client_id:
    //       "153120626106-kmpt0qrs1f1dv3tglknij3ebibp42nbb.apps.googleusercontent.com",
    //     callback: handleCredentialResponse,
    //   });
    //   window.google.accounts.id.renderButton(
    //     document.getElementById("signinDiv"),
    //     {
    //       theme: "outline",
    //       size: "large",
    //       logo_alignment: "center",
    //       width: "300px",
    //     }
    //   );
    // }
  }, [user]);

  useEffect(() => {

    // audio.play()
  }, []);

  return (
    <React.Fragment>
      <div className="intro">
        <div className="rank-setting">
          <div>
            <img onClick={() => setRank(!rank)} src="./images/rank.png" />
          </div>
        </div>
        <div className="game-logo">
              <img src="./images/add.png" />
        </div>
        <div className="game-logo-right">
              <img src="./images/add.png" />
        </div>
        <div className="setting-sound">
          <div className="">
            {statusSound ? (
              <img
                onClick={() => {
                  audio.pause();
                  setStatusSound(false);
                }}
                src="./images/sound4.png"
              />
            ) : (
              <img
                onClick={() => {
                  audio.play();
                  setStatusSound(true);
                }}
                src="./images/soundmute.png"
              />
            )}
          </div>
        </div>
        {user && user.id ? (
          <React.Fragment>
            <div className="identity">
              <div className="authentication-data">
                <div
                  className="portrait"
                  title="danghung020195@gmail.com"
                  style={{
                    backgroundImage: `url(
                   ${user.avt && false ? user.avt : "./images/defual.png"}
                  )`,
                  }}
                ></div>
                <div className="authentication-details">
                  <div className="authentication-detail">
                    <div>Signed in as</div>
                    {user.type == 1 && user.id && <div>{user.id}</div>}
                    {user.username && <div> {user.username}</div>}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() => {
                        localStorage.removeItem("playerset");
                        setCurrentValue("");

                        updateUser(false);
                      }}
                      className="signout-btn"
                    >
                      Sign Out
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="identity">
            <div className="name-wrapper wrapper" id="name-wrapper">
              <input
                className="name-input"
                id="name"
                name="name"
                value={currentValue}
                onChange={(evt) => handleChange(evt)}
                title="Preferred name"
                onBlur={hander}
                onKeyPress={handleKeyPress}
                placeholder={currentValue ? currentValue : "Enter your name"}
                ref={ref}
              />
            </div>
          </div>
        )}
        <section>
          <div className="buttonplay">
            <button onClick={() => playerReady("game")}>Train</button>
            <button onClick={() => playerReady("gamebattle")}>1 vs 1</button>
          </div>
        </section>
    
       <Rank status={rank} />
      </div>

      {/* <section className="start-wrapper2">
       <div>
        Train
       </div>
       <div>
       Battlefield
       </div>
      </section> */}
    </React.Fragment>
  );
}

export default Home;
// gg id 153120626106-tqmfv8jcu7g91ut9sp3oth14c8kf6vdc.apps.googleusercontent.com
//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
