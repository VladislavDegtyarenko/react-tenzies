import React from "react";

export default function Die(props) {
   const styles = {
      backgroundColor: props.isHeld ? "#59E391" : "white",
   };

   return (
      <div className="die-face" style={styles} onClick={props.holdDice}>
         {/*  <h2 className="die-num">{props.value}</h2> */}
         {props.value === 1 && (
            <>
               <span className="die-dot mid"></span>
            </>
         )}
         {props.value === 2 && (
            <>
               <span className="die-dot bottom-left"></span>
               <span className="die-dot top-right"></span>
            </>
         )}
         {props.value === 3 && (
            <>
               <span className="die-dot bottom-left"></span>
               <span className="die-dot mid"></span>
               <span className="die-dot top-right"></span>
            </>
         )}
         {props.value === 4 && (
            <>
               <span className="die-dot top-left"></span>
               <span className="die-dot top-right"></span>
               <span className="die-dot bottom-left"></span>
               <span className="die-dot bottom-right"></span>
            </>
         )}
         {props.value === 5 && (
            <>
               <span className="die-dot top-left"></span>
               <span className="die-dot top-right"></span>
               <span className="die-dot mid"></span>
               <span className="die-dot bottom-left"></span>
               <span className="die-dot bottom-right"></span>
            </>
         )}
         {props.value === 6 && (
            <>
               <span className="die-dot top-left"></span>
               <span className="die-dot top-mid"></span>
               <span className="die-dot top-right"></span>
               <span className="die-dot bottom-left"></span>
               <span className="die-dot bottom-mid"></span>
               <span className="die-dot bottom-right"></span>
            </>
         )}
      </div>
   );
}
