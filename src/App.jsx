import { useState } from "react";

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [timerLabel, setTimerLabel] = useState("Session");

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const handleDecrement = (type) => {
    if (type === "session" && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    } else if (type === "break" && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleIncrement = (type) => {
    if (type === "session" && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    } else if (type === "break" && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalId);
    } else {
      const newIntervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            const audio = document.getElementById("beep");
            audio.play();

            setIsSession((prevIsSession) => {
              const newSessionState = !prevIsSession;
              setTimerLabel(newSessionState ? "Session" : "Break");
              const newTime = newSessionState
                ? sessionLength * 60
                : breakLength * 60;
              setTimeLeft(newTime);
              return newSessionState;
            });

            return 0;
          }

          return prevTimeLeft - 1;
        });
      }, 1000);
      setIntervalId(newIntervalId);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setIsSession(true);
    setTimerLabel("Session");
    setIsRunning(false);

    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="container">
      <h1>25 + 5 Clock</h1>

      <div id="session-label">
        <h3>Session Length</h3>
        <button
          id="session-decrement"
          onClick={() => handleDecrement("session")}
        >
          -
        </button>
        <span id="session-length">{sessionLength}</span>
        <button
          id="session-increment"
          onClick={() => handleIncrement("session")}
        >
          +
        </button>
      </div>

      <div id="break-label">
        <h3>Break Length</h3>
        <button id="break-decrement" onClick={() => handleDecrement("break")}>
          -
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={() => handleIncrement("break")}>
          +
        </button>
      </div>

      <div id="timer-label">
        <h2>{timerLabel}</h2>

        <div id="time-left">
          <h1>{formatTime(timeLeft)}</h1>
        </div>

        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>

        <audio
          id="beep"
          src="https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3"
          preload="auto"
        ></audio>
      </div>
    </div>
  );
}

export default App;
