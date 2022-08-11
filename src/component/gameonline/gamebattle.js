import React, { useCallback, useEffect, useRef, useState } from "react";
import { InlineMath } from "react-katex";
import TimeCount from "../timecount";
import fetchApi, { sleep } from "../utilities";
import KeyBoard from "../game/keyboard";

let audio = new Audio("./sound/finish.mp3");
// let right = new Audio("/");
function GameBattle({ updatePage, socket, user, location }) {
  const [heart] = useState([1, 2, 3]);
  const [keyboard, setKeyboard] = useState(true);

  const [loading, setLoading] = useState(true);
  const [countTime, setCountTime] = useState(3);
  const [loadReady, setLoadReady] = useState(false);
  const [dataGame, setDataGame] = useState(false);
  const [question, setQuestion] = useState(false);
  const [update, setUpdate] = useState(true);
  const [friendId, setFriendId] = useState(false);
  const yourdapan = useRef("?");
  const status = useRef(true);
  const gameover = useRef(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [idright, setIdright] = useState(false);
  const dataUser = useRef({
    anser: "",
    currentQuestion2: 0,
  });
  const dataRooms = useRef({
    indexRoom: false,
    rooms: "",
  });

  const [firstUser, setFirstUser] = useState(false);

  const gameReadyStart = (data) => {
    let { id1, id2 } = data;
    if (id1 && id2) {
      if (user.id === id1) {
        setFriendId(id2);
      } else {
        setFriendId(id1);
      }
      setDataGame(data);
      setLoading(false);
      dataRooms.current = {
        indexRoom: data.indexRoom,
        rooms: data.rooms,
      };
    }
  };
  const timeCoutReady = useCallback((data) => {
    if (!loadReady) {
      setLoadReady(true);
    }
    setCountTime(data);
  }, []);
  const renderQuestion = useCallback(async (data) => {
    if (data.id === data.data.id1) {
      setIdright(data.id);
    }
    if (data.id === data.data.id2) {
      setIdright(data.id);
    }
    status.current = false;
    if (loadReady) {
      setLoadReady(false);
    }

    setDataGame(data.data);

    await sleep(1000);

    yourdapan.current = "?";
    dataUser.current = {
      anser: data.question.answer,
      currentQuestion2: data.data.currentQuestion,
    };
    status.current = true;
    setQuestion(data.question);
    setIdright(false);
  }, []);
  const handleAnswerChange = useCallback(async (event) => {
    if (event.key === " ") return;
    if (event.key === "Backspace" && yourdapan !== "?") {
      if (yourdapan.current.length === 1) {
        yourdapan.current = "?";
      } else {
        yourdapan.current = yourdapan.current.slice(0, -1);
      }
      setUpdate(({ update }) => ({ update: !update }));
    }

    if (isFinite(event.key) && status.current) {
      if (yourdapan.current === "?" || yourdapan.current == 0) {
        yourdapan.current = event.key;
      } else {
        yourdapan.current = yourdapan.current + event.key;
      }
      if (yourdapan.current == dataUser.current.anser) {
        // trả ;lời đúng
        socket.emit("anser-correct", {
          id: user.id,
          anser: yourdapan.current,
          indexRoom: dataRooms.current.indexRoom,
          rooms: dataRooms.current.rooms,
          currentQuestion2: dataUser.current.currentQuestion2,
        });
      }
      setUpdate(({ update }) => ({ update: !update }));
      // if (yourdapan.current == question.answer) {
      //   // trả ;lời đúng
      //   data.current = {
      //     ...data.current,
      //     status: false,
      //   };
      //   nextQuestion();
      // }
    }
  }, []);

  const createNewRooms = (data) => {
    setFirstUser(data);
  };
  const endGameAll = (data) => {
    audio.play();
    gameover.current = true;
    setGameEnd(true);
    setDataGame({
      ...dataGame,
      ...data.data,
    });
  };

  useEffect(() => {
    socket.on("new-game-create", gameReadyStart);
    socket.emit("create-game", {
      id: user.id,
      name: user.username,
      country: location.country,
      countryCode: location.countryCode,
    });
    socket.on("time-count-game", timeCoutReady);
    socket.on("update-game-online", renderQuestion);
    socket.on("new-rooms-create", createNewRooms);
    socket.on("send-end-game-all", endGameAll);
    window.addEventListener("keydown", handleAnswerChange);
    return () => {
      window.removeEventListener("keydown", handleAnswerChange);
      socket.off("new-game-create");
      socket.off("time-count-game");
      socket.off("update-game-online");
    };
  }, [handleAnswerChange]);
  const renderHeart = heart.map((myList, i) => {
    let { heart } = dataGame;
    if (myList <= heart) {
      return (
        <img
          key={i}
          src="./images/heart.png"
          width="30px"
          height="30px"
          alt="some"
        />
      );
    } else {
      return (
        <img
          key={i}
          src="./images/heart1.png"
          width="30px"
          height="30px"
          alt="some"
        />
      );
    }
  });
  const outGame = () => {
    if (gameover.current) {
      // đã xong game
    } else {
      if (firstUser && firstUser.rooms) {
        socket.emit("delete-rooms", {
          ...firstUser,
          id: user.id,
        });
      }
    }
    updatePage("home");
  };

  const outGame2 = () => {
    if (firstUser && firstUser.rooms) {
      socket.emit("delete-rooms", {
        ...firstUser,

        id: user.id,
      });
    }
    updatePage("home");
  };
  const TimeOut = () => {};

  const outPut = (dataOut) => {
    if (dataOut === "back") {
      if (yourdapan.current !== "?") {
        if (yourdapan.current.length === 1) {
          yourdapan.current = "?";
        } else {
          yourdapan.current = yourdapan.current.slice(0, -1);
        }
        setUpdate(({ update }) => ({ update: !update }));
      }
      return;
    }
    if (dataOut === "clear") {
      yourdapan.current = "?";
      setUpdate(({ update }) => ({ update: !update }));
      return;
    }
    if (yourdapan.current === "?" || yourdapan.current == 0) {
      yourdapan.current = dataOut.toString();
    } else {
      yourdapan.current = yourdapan.current + dataOut.toString();
    }

    if (yourdapan.current == dataUser.current.anser) {
      // trả ;lời đúng
      socket.emit("anser-correct", {
        id: user.id,
        anser: yourdapan.current,
        indexRoom: dataRooms.current.indexRoom,
        rooms: dataRooms.current.rooms,
        currentQuestion2: dataUser.current.currentQuestion2,
      });
    }
    setUpdate(({ update }) => ({ update: !update }));
  };
  return (
    <React.Fragment>
      <section className="math">
      <div className="very-tall-batt">
          <div className="setting" title="Use a touchscreen">
            <div className="setting-information">
              <div className="setting-title">Touchscreen</div>
            </div>
            <label className="setting-switch">
              <input
                onClick={() => setKeyboard(!keyboard)}
                name="touch"
                checked={keyboard}
                type="checkbox"
              />
              <span className="setting-slider"></span>
            </label>
          </div>
          <div
            className="setting"
            title="For touchscreens, flip the number pad vertically"
          >
            <div className="setting-information">
              <div className="setting-title"> Flip Keypad</div>
            </div>
            <label className="setting-switch">
              <input name="flip" type="checkbox" />
              <span class="setting-slider"></span>
            </label>
          </div>
        </div>
        <div className="gameinf gameheader">
          <TimeCount
            timeQuestion={question.time ?? 0}
            TimeOut={TimeOut}
            stop={gameover.current}
            question={question.id}
          />

          <div id="heart">{renderHeart}</div>
        </div>
        <section className="mathonline" id="gameonlinestart">
          <div className="name-wrapper-online" id="playerone">
            <span>{user.username} </span>
            <span className="countryinfor">
              <span>{location.country}</span>
              <span>
                <img src={`./images/flags/type=${location.countryCode}.png`} />
              </span>
            </span>
            {dataGame && dataGame.data[user.id] && (
              <span id="playeronepoint">
                <span className="scoretitle">Score</span>
                <span className="score">
                  {dataGame?.data[user.id]?.point
                    ? +dataGame?.data[user.id]?.point
                    : "0"}
                </span>
              </span>
            )}

            {idright == user.id && (
              <span>
                <img className="animation" src="./images/correct.png" />
              </span>
            )}
          </div>
          <section className="problem">
            {gameover.current && (
              <div onClick={outGame} className="done-btn" id="finishonline">
                Finish
              </div>
            )}
            {loading && (
              <div onClick={outGame2} className="done-btn" id="finishonline">
                Finish
              </div>
            )}
            {gameover.current ? (
              <span>
                <img src="./images/logo192.png" />
              </span>
            ) : question && question.question ? (
              <div className="question-wrapper">
                <div className="question">
                  <span>
                    <span id="cauhoi">
                      {question && question.question ? (
                        <InlineMath math={question.question} />
                      ) : (
                        <span>
                          <img src="./images/logo192.png" />
                        </span>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            ) : loadReady ? (
              <span>{countTime}</span>
            ) : (
              <span>
                {" "}
                <img src="./images/logo192.png" />
              </span>
            )}
            {question && question.question && !gameover.current && (
              <section className="answer-wrapper">
                <section
                  className={
                    yourdapan.current === question.answer
                      ? "right answer"
                      : yourdapan.current !== "?"
                      ? "answer"
                      : "answer opacity_05"
                  }
                >
                  {yourdapan.current}
                </section>
              </section>
            )}
          </section>

          {loading ? (
            <div className="name-wrapper-online" id="playertwo">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <div className="name-wrapper-online" id="playertwo">
              <span>{dataGame?.data[friendId]?.name} </span>
              <span className="countryinfor">
                <span>{dataGame?.data[friendId]?.country} </span>
                <span>
                  <img
                    src={`./images/flags/type=${dataGame?.data[friendId].countryCode}.png`}
                  />
                </span>
              </span>
              <span id="playertwopoint">
                <span className="scoretitle">Score</span>
                <span className="score">
                  {dataGame?.data[friendId]?.point ?? 0}
                </span>
              </span>
              {idright == friendId && (
                <span>
                  <img className="animation" src="./images/correct.png" />
                </span>
              )}
            </div>
          )}
        </section>
      </section>
      {keyboard && <KeyBoard outPut={outPut} />}
    </React.Fragment>
  );
}
export default GameBattle;
