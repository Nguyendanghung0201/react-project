import React, { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import fetchApi from "../utilities";
import jwt_decode from "jwt-decode";
function Home({ updatePage, updateUser, user, player, location }) {
  const [currentValue, setCurrentValue] = useState("");

  function handleChange(evt) {
    setCurrentValue(evt.currentTarget.value);
  }
  const responseFacebook = async (response) => {
    if (response.error) return;
    //"EAALOKiRAMCUBAJ2rEbHZAJwEnqjrv9KEWkRmvO7lgoURySM8Nukg9Fv6yRIrxZBspj2sw8KKv4dJh8qPKnfrqwi79bdvjdyGAgwpQaWmhvcl4N0whItroWGCM2zIfjyuXTO9DWHBjJp4T4QGeEulQjQswgIKDQikqvPgxkm4YxRhdGZBKIi3gGiAku1s27A3XmZAKJZCucWoVx7VFbhzJ"
    if (response.accessToken) {
      localStorage.setItem("facebooktoken", JSON.stringify(response));
      var now = new Date().getTime();
      localStorage.setItem("setupTimefb", now);
    }
    if (response.id) {
      updateUser({
        id: response.id,
        email: response.email,
        username: response.name,
        avt: response.picture?.data?.url ?? "",
        type: 2,
      });
      response.location = location;
      let data = await fetchApi("POST", "/api/loginfacebook", response, "");
    }
  };
  const playerReady = (data) => {
    if (!user || !user.id) {
      localStorage.setItem("playerset", "GUEST");
      updateUser({
        id: player,
        username: "GUEST",
        type: 1,
      });
      saveUser();
      updatePage(data);
    } else {
      updatePage(data);
    }
  };
  const handleCredentialResponse = async (data) => {
    if (data.credential) {
      let userObject = jwt_decode(data.credential);
      var now = new Date().getTime();
      localStorage.setItem("setupTime", now);
      localStorage.setItem("decode", data.credential);
      updateUser({
        id: userObject.sub,
        email: userObject.email,
        username: userObject.name,
        avt: userObject.picture,
        type: 3,
      });
      if (userObject.email) {
        userObject.location = location;
        let response = await fetchApi(
          "POST",
          "/api/logingoogle",
          userObject,
          ""
        );
      }
    }
  };
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
        username: currentValue?? 'GUEST',
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
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "153120626106-kmpt0qrs1f1dv3tglknij3ebibp42nbb.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("signinDiv"),
        {
          theme: "outline",
          size: "large",
          logo_alignment: "center",
          width: "300px",
        }
      );
    }
  }, [user]);

  return (
    <React.Fragment>
      <div
        className="intro-top-options"
        style={{ justifyContent: "space-between" }} //"justify-content: space-between"
      ></div>
      <div className="intro">
        <h1 className="main-title stylized">Math Game</h1>
        <div className="main-subtitle stylized">Fluency in Mathematics</div>

        {user && user.id ? (
          <React.Fragment>
            <div className="identity">
              {" "}
              <div className="authentication-data">
                <div
                  className="portrait"
                  title="danghung020195@gmail.com"
                  style={{
                    backgroundImage: `url(
                   ${user.avt && false ? user.avt : "/images/defual.png"}
                  )`,
                  }}
                ></div>
                <div className="authentication-details">
                  <div className="authentication-detail">
                    <div>Signed in as</div>
                    {user.type == 1 && user.id && <div>{user.id}</div>}
                    {user.email && <div>{user.email}</div>}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() => {
                        if (user.type == 2) {
                          localStorage.removeItem("facebooktoken");
                        } else if (user.type == 3) {
                          localStorage.removeItem("decode");
                        } else if (user.type == 1) {
                          localStorage.removeItem("playerset");
                          setCurrentValue("");
                        }
                        updateUser(false);
                      }}
                      className="signout-btn"
                    >
                      Sign Out
                    </div>
                  </div>
                </div>
              </div>
              <div className="name-wrapper" id="name-wrapper">
                <input
                  className="name-input"
                  id="name"
                  name="name"
                  disabled
                  title="Preferred name"
                  placeholder={user.username}
                />
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
              />
            </div>

            <div id="signinDiv" className="wrapper"></div>
            <div className="facebook wrapper">
              <FacebookLogin
                icon="fa-facebook"
                appId="789630345556005"
                autoLoad={false}
                fields="name,email,picture"
                // onClick={componentClicked}
                callback={responseFacebook}
                textButton="Login with Facebook"
              />
            </div>
          </div>
        )}
      </div>
      <section className="start-wrapper">
        <nav
          onClick={() => playerReady("game")}
          id="gametrainer"
          className="start is-armed"
        >
          Train
        </nav>
        <nav
          onClick={() => playerReady("gamebattle")}
          id="gameonline"
          className="start is-armed"
        >
          Battlefield
        </nav>
      </section>
    </React.Fragment>
  );
}

export default Home;
// gg id 153120626106-tqmfv8jcu7g91ut9sp3oth14c8kf6vdc.apps.googleusercontent.com
//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
