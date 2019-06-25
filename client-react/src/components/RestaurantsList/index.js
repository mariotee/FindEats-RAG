import React from "react"
import styles from "./style.module.css"

export default function RestaurantsList(props) {
  return <div className={styles.root}>
    <h3 className={styles.title}>{props.title}</h3>
    <ul className={styles.listroot}>
    {
      props.places.map(
      ({ name, place_id, formatted_address: address, }) => <li key={place_id} className={styles.listitem}>
        <input          
          type="checkbox"
          checked={props.visited}
          onChange={() => props.onCheck(place_id)}
        />
        <b>{name}: </b>{address}
      </li>)
    }
    </ul>
  </div>
}