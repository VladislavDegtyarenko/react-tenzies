import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

let timerInterval;

export default function App() {
   const [dice, setDice] = React.useState(allNewDice());
   const [tenzies, setTenzies] = React.useState(false);
   const [gameScore, setGameScore] = React.useState({
      isRunning: false,
      time: 0,
      rolls: 0,
   });
   const [bestScore, setBestScore] = React.useState({
      rolls: localStorage.getItem("bestRollsScore") || null,
      time: localStorage.getItem("bestTimeScore") || null,
      rollsRecordAlert: false,
      timeRecordAlert: false,
   });

   React.useEffect(() => {
      const allHeld = dice.every((die) => die.isHeld);
      const firstValue = dice[0].value;
      const allSameValue = dice.every((die) => die.value === firstValue);
      if (allHeld && allSameValue) {
         setTenzies(true);
         stopTimer();
         recordBestScore();
      }
   }, [dice]);

   React.useEffect(() => {
      localStorage.setItem("bestRollsScore", bestScore.rolls);
      localStorage.setItem("bestTimeScore", bestScore.time);
   }, [bestScore]);

   function generateNewDie() {
      return {
         value: Math.ceil(Math.random() * 6),
         isHeld: false,
         id: nanoid(),
      };
   }

   function allNewDice() {
      const newDice = [];
      for (let i = 0; i < 10; i++) {
         newDice.push(generateNewDie());
      }
      return newDice;
   }

   function rollDice() {
      if (!tenzies) {
         setDice((oldDice) =>
            oldDice.map((die) => {
               return die.isHeld ? die : generateNewDie();
            })
         );
         setGameScore((prevGameScore) => ({
            ...prevGameScore,
            score: prevGameScore.rolls++,
         }));
         startTimer();
      } else {
         setTenzies(false);
         setDice(allNewDice());
         setGameScore((prevGameScore) => ({
            ...prevGameScore,
            time: 0,
            rolls: 0,
         }));
         setBestScore((prevBestScore) => ({
            ...prevBestScore,
            rollsRecordAlert: false,
            timeRecordAlert: false,
         }));
      }
   }

   function holdDice(id) {
      if (tenzies) return;

      setDice((oldDice) =>
         oldDice.map((die) => {
            return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
         })
      );
      startTimer();
   }

   const diceElements = dice.map((die) => (
      <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
   ));

   const startTimer = () => {
      if (gameScore.isRunning) return;

      setGameScore((prevGameScore) => ({
         ...prevGameScore,
         isRunning: true,
      }));

      timerInterval = setInterval(() => tickTimer(), 1000);
   };

   const tickTimer = () => {
      setGameScore((prevGameScore) => ({
         ...prevGameScore,
         time: prevGameScore.time++,
      }));
   };

   const stopTimer = () => {
      clearInterval(timerInterval);
      timerInterval = null;

      setGameScore((prevGameScore) => ({
         ...prevGameScore,
         isRunning: false,
      }));
   };

   const formatGameTime = (time) => {
      return (
         <>
            {Math.floor(time / 60)}:{time % 60 < 10 ? "0" + (time % 60) : time % 60}
         </>
      );
   };

   const recordBestScore = () => {
      setBestScore((prevBestScore) => {
         let newNumberOfRolls = prevBestScore.rolls ? Math.min(prevBestScore.rolls, gameScore.rolls) : gameScore.rolls;
         let newGameTime = prevBestScore.time ? Math.min(prevBestScore.time, gameScore.time) : gameScore.time;

         let rollsAlert = prevBestScore.rolls ? prevBestScore.rolls > gameScore.rolls : true;
         let timeAlert = prevBestScore.time ? prevBestScore.time > gameScore.time : true;

         return {
            ...prevBestScore,
            rolls: newNumberOfRolls,
            time: newGameTime,
            rollsRecordAlert: rollsAlert,
            timeRecordAlert: timeAlert,
         };
      });
   };

   const handleKeyDown = e => console.log(e);

   return (
      <main>
         {tenzies && <Confetti />}
         <h1 className="title">Tenzies</h1>
         <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
         </p>
         <div className="dice-container">{diceElements}</div>
         <button className="roll-dice" onClick={rollDice} onKeyDown={handleKeyDown}>
            {tenzies ? "New Game" : "Roll"}
         </button>
         <div className="stats">
            <div className="stats-heading">Number of Rolls:</div>
            <div className="stats-score">{gameScore.rolls}</div>
            <div className="stats-heading">Game Time:</div>
            <div className="stats-score">{formatGameTime(gameScore.time)}</div>
            <div className="stats-heading">Best rolls score:</div>
            <div className="stats-score">
               {bestScore.rolls || "-"}{" "}
               {bestScore.rollsRecordAlert && <span className="record-alert">New Record!</span>}
            </div>
            <div className="stats-heading">Best game time:</div>
            <div className="stats-score">
               {bestScore.time ? formatGameTime(bestScore.time) : "-"}{" "}
               {bestScore.timeRecordAlert && <span className="record-alert">New Record!</span>}
            </div>
         </div>
      </main>
   );
}
