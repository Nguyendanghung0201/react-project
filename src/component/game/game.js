import React, { useCallback, useEffect, useRef, useState } from "react";
import { InlineMath } from "react-katex";
import fetchApi, { sleep } from "../utilities";
import TimeCount from "../timecount";
import KeyBoard from "./keyboard";
function GameOne({ updatePage, location, user, player }) {
  const [keyboard, setKeyboard] = useState(true);
  const [flipkey, setFlipkey] = useState(true)
  const [heart] = useState([1, 2, 3]);
  const [gameover, setGameover] = useState(false);
  const data = useRef({
    point: 0,
    heart: 3,
    status: true,
    questionsCurrent: 0,
    level: 1,
  });
  const yourdapan = useRef("?");
  const [loading, setLoading] = useState(false);
  const listQuestions = useRef([]);
  const [update, setUpdate] = useState(true);

  const getListQuestion = useCallback(() => {
    let dataFetch = fetchApi(
      "POST",
      "/api/getquestions",
      { level: data.current.level },
      ""
    );
    dataFetch.then((data) => {
      if (data.status) {
        listQuestions.current = [...listQuestions.current, ...data.data];
        setUpdate(({ update }) => ({ update: !update }));
        setLoading(true);
      }
    });
  }, []);
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
    let question = listQuestions.current[data.current.questionsCurrent];
    if (yourdapan.current == question.answer) {
      // trả ;lời đúng
      data.current = {
        ...data.current,
        status: false,
      };
      nextQuestion();
    }
    setUpdate(({ update }) => ({ update: !update }));
  };
  const nextQuestion = useCallback(async () => {
    if (listQuestions.current.length < data.current.questionsCurrent + 3) {
      data.current = {
        ...data.current,
        level: data.current.level + 1,
        // heart: data.current.heart + 1,
      };
      getListQuestion();
    }
    await sleep(500);
    data.current = {
      ...data.current,
      point: data.current.point + 1,
      status: true,
      questionsCurrent: data.current.questionsCurrent + 1,
    };
    yourdapan.current = "?";
    setUpdate(({ update }) => ({ update: !update }));
  }, [getListQuestion]);
  const handleAnswerChange = useCallback(
    (event) => {
      if (event.key === " ") return;

      let question = listQuestions.current[data.current.questionsCurrent];
      if (!question) return;
      if (event.key === "Backspace" && yourdapan.current !== "?") {
        if (yourdapan.current.length === 1) {
          yourdapan.current = "?";
        } else {
          yourdapan.current = yourdapan.current.slice(0, -1);
        }
        setUpdate(({ update }) => ({ update: !update }));
      }
      if (isFinite(event.key) && data.current.status) {
        if (yourdapan.current === "?" || yourdapan.current == 0) {
          yourdapan.current = event.key;
        } else {
          yourdapan.current = yourdapan.current + event.key;
        }

        if (yourdapan.current == question.answer) {
          // trả ;lời đúng
          data.current = {
            ...data.current,
            status: false,
          };
          nextQuestion();
        }
        setUpdate(({ update }) => ({ update: !update }));
      }
    },
    [nextQuestion]
  );
  const GameOverEnd = async () => {
    await fetchApi(
      "POST",
      "/api/game",
      { a: data.current.point, b: user.id ? user.id : player, c: 1 },
      ""
    );
  };
  useEffect(() => {
    getListQuestion();
    window.addEventListener("keydown", handleAnswerChange);
    return () => {
      window.removeEventListener("keydown", handleAnswerChange);
    };
  }, [getListQuestion, handleAnswerChange]);
  const renderHeart = heart.map((myList, i) => {
    if (myList <= data.current.heart) {
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
  const TimeOut = async () => {
    if (data.current.endgame) return;
    if (data.current.heart <= 1 && !data.current.endgame) {
      data.current = {
        ...data.current,
        heart: data.current.heart - 1,
        status: false,
        endgame: true,
      };

      setGameover(true);
      return GameOverEnd();
    }
    if (listQuestions.current.length < data.current.questionsCurrent + 3) {
      getListQuestion();
    }
    data.current = {
      ...data.current,
      heart: data.current.heart - 1,
      status: true,
      questionsCurrent: data.current.questionsCurrent + 1,
    };
    await sleep(300);
    setUpdate(({ update }) => ({ update: !update }));
  };
  const playagain = () => {
    data.current = {
      point: 0,
      heart: 3,
      status: true,
      questionsCurrent: 0,
      level: 1,
    };
    yourdapan.current = "?";
    setLoading(false)
    setGameover(false);
    listQuestions.current =[]
    getListQuestion()
  };
  if (!loading) return <div>Loading</div>;
  return (
    <React.Fragment>
      <section className="math" id="gameone">
        <div className="very-tall">
          <div>
            <div className="setting" title="Use a touchscreen">
              <div className="setting-information">
                <div className="setting-title">Touchscreen</div>
              </div>
              <label className="setting-switch">
                <input
                  onChange={() => setKeyboard(!keyboard)}
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
                <input name="flip" type="checkbox" checked={flipkey} onChange={()=>setFlipkey(!flipkey)} />
                <span className="setting-slider"></span>
              </label>
            </div>
          </div>
          <div>
            <div className="setting-home" onClick={() => updatePage("home")}>
              <img src="./images/home.png" />
            </div>
            <div className="setting-home" onClick={() => playagain()}>
              <img src="./images/playagain.png" />
            </div>
          </div>
        </div>
        <div className="gameheader">
          <div id="heart">{renderHeart}</div>

          <TimeCount
            timeQuestion={
              listQuestions?.current[data.current.questionsCurrent]?.time ?? 0
            }
            TimeOut={TimeOut}
            stop={gameover}
            question={data.current.questionsCurrent}
          />

          <div className="base-timer">
            <span id="base-timer-label" className="base-timer__label pointgame">
              {data.current.point}
            </span>
          </div>

          {/* (
          <TimeEmpty
            timeQuestion={
              listQuestions?.current[data.current.questionsCurrent]?.time ?? 0
            }
          />
        ) */}
        </div>
        <section className="problem">
          <div className="question-wrapper">
            <div className="question">
              <span>
                <span id="cauhoi">
                  {listQuestions.current.length === 0 ? (
                    <InlineMath math="? - ?" />
                  ) : (
                    <InlineMath
                      math={
                        listQuestions?.current[data.current.questionsCurrent]
                          ?.question ?? "? - ?"
                      }
                    />
                  )}
                </span>
              </span>
            </div>
          </div>
          <section className="answer-wrapper">
            <section
              className={
                yourdapan.current ==
                listQuestions.current[data.current.questionsCurrent]?.answer
                  ? "right answer"
                  : yourdapan.current !== "?"
                  ? "answer"
                  : "answer opacity_05"
              }
            >
              {yourdapan.current}
            </section>
          </section>
        </section>
      </section>
      {keyboard && <KeyBoard outPut={outPut} />}
    </React.Fragment>
  );
}

export default GameOne;
