import React from "react"
import styles from "./style.module.css"

export default function(props) {    
  return <div className={styles.root}>
    {props.message}
  </div>
}