import React from "react"
import styles from "./style.module.css"

export default function (props) {
  return <div className={styles.root}>
    <label className={styles.label}>Zipcode</label>
    <input
      className={styles.searchbox}
      type="text"
      placeholder="enter 5-digit zipcode"
      onKeyPress={({key}) => key === "Enter" ? props.fetchPlaces() : ()=>{}}
      onChange={props.changedSearch}
      value={props.buffer}
    />
    <button 
      className={styles.button}
      onClick={props.fetchPlaces}
    >
      Find Eats!
    </button>
    <button
      disabled={!props.hasNextPage}
      className={styles.button}
      onClick={props.nextPage}
    >
      Get More
    </button>
  </div>
}