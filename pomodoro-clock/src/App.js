import React, { useState, useEffect } from "react";
import "./App.css";

function SetTimer(props) {
  var count = props.count;

  function increaseCount() {
    const MAX = 60;
    props.update(count + 1 >= MAX ? MAX : count + 1);
  }

  function decreaseCount() {
    const MIN = 1;
    props.update(count - 1 <= MIN ? MIN : count - 1);
  }

  return (
    <div className="timer-container">
      <h2 id={props.id}>{props.title}</h2>
      <div className="flex actions-wrapper">
        <button id={props.idd} onClick={decreaseCount}>
          <i className="fas fa-minus" />
        </button>
        <span id={props.idl}>{count}</span>
        <button id={props.idi} onClick={increaseCount}>
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [breakCount, setBreakCount] = useState(5);
  const [sessionCount, setSessionCount] = useState(25);
  const [clockCount, setClockCount] = useState(1500);
  const [currentTimer, setCurrentTimer] = useState("Session");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBeep, setAudioBeep] = useState();

  const breakProps = {
    id: "break-label",
    title: "Break Length",
    idd: "break-decrement",
    idi: "break-increment",
    idl: "break-length",
    count: breakCount,
    update: (num) => (isPlaying ? null : setBreakCount(num)),
  };

  const sessionProps = {
    id: "session-label",
    title: "Session Length",
    idd: "session-decrement",
    idi: "session-increment",
    idl: "session-length",
    count: sessionCount,
    update: (num) =>
      isPlaying ? null : (setSessionCount(num), setClockCount(num * 60)),
  };

  function convertToTime(count) {
    let minutes =
      ("" + Math.floor(clockCount / 60)).length === 1
        ? "0" + Math.floor(clockCount / 60)
        : "" + Math.floor(clockCount / 60);
    let seconds =
      ("" + (clockCount % 60)).length === 1
        ? "0" + (clockCount % 60)
        : "" + (clockCount % 60);
    return `${minutes}:${seconds}`;
  }

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
  }

  function handleReset() {
    setBreakCount(5);
    setSessionCount(25);
    setClockCount(1500);
    setCurrentTimer("Session");
    setIsPlaying(false);
    audioBeep.pause();
    audioBeep.currentTime = 0;
  }

  useEffect(() => {
    let interval = null;
    if (isPlaying && clockCount >= 0) {
      interval = setInterval(() => {
        setClockCount((clockCount) => clockCount - 1);
      }, 1000);
    } else if (isPlaying && clockCount < 0) {
      audioBeep.play();
      setCurrentTimer("Break");
      setClockCount((clockCount) =>
        currentTimer === "Session" ? breakCount * 60 : sessionCount * 60
      );
      setCurrentTimer(currentTimer === "Session" ? "Break" : "Session");
    }
    // returned function will be called on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [
    isPlaying,
    clockCount,
    currentTimer,
    sessionCount,
    breakCount,
    audioBeep,
  ]);

  return (
    <div>
      <h1>POMODO CLOCK</h1>
      <div className="flex">
        <SetTimer {...breakProps} />
        <SetTimer {...sessionProps} />
      </div>
      <div className="clock-container">
        <h1 id="timer-label">{currentTimer}</h1>
        <span id="time-left">{convertToTime()}</span>
        <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ref={(audio) => {
            setAudioBeep(audio);
          }}
        />
        <div className="flex">
          <button className="button" id="start_stop" onClick={handlePlayPause}>
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`} />
          </button>
          <button className="button" id="reset" onClick={handleReset}>
            <i className="fas fa-sync" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
