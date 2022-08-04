function KeyBoard({ outPut }) {
  return (
    <section className="keypad">
      <section>
        <div
          onClick={() => outPut(7)}
          className="keypad-button keypad-button--left keypad-button--one"
        >
          7
        </div>
        <div
          onClick={() => outPut(8)}
          className="keypad-button keypad-button--middle keypad-button--one"
        >
          8
        </div>
        <div
          onClick={() => outPut(9)}
          className="keypad-button keypad-button--right keypad-button--one"
        >
          9
        </div>
      </section>
      <section>
        <div
          onClick={() => outPut(4)}
          className="keypad-button keypad-button--left keypad-button--two"
        >
          4
        </div>
        <div
          onClick={() => outPut(5)}
          className="keypad-button keypad-button--middle keypad-button--two"
        >
          5
        </div>
        <div
          onClick={() => outPut(6)}
          className="keypad-button keypad-button--right keypad-button--two"
        >
          6
        </div>
      </section>
      <section>
        <div
          onClick={() => outPut(1)}
          className="keypad-button keypad-button--left keypad-button--three"
        >
          1
        </div>
        <div
          onClick={() => outPut(2)}
          className="keypad-button keypad-button--middle keypad-button--three"
        >
          2
        </div>
        <div
          onClick={() => outPut(3)}
          className="keypad-button keypad-button--right keypad-button--three"
        >
          3
        </div>
      </section>
      <section>
        <div
          onClick={() => outPut("clear")}
          className="keypad-button keypad-button--left keypad-button--four"
        >
          Clear
        </div>
        <div
          onClick={() => outPut(0)}
          className="keypad-button keypad-button--middle keypad-button--four"
        >
          0
        </div>
        <div
          onClick={() => outPut("back")}
          className="keypad-button keypad-button--right keypad-button--four"
        >
          Backspace
        </div>
      </section>
    </section>
  );
}

export default KeyBoard;
