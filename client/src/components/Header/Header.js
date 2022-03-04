import React from "react";
import { useSelector } from "react-redux";
import OnlineStatusRenderer from "../OnlineStatus/OnlineStatusIndicator";
import styles from './header.module.css'

export default function Header() {
  const onlineStatus = useSelector(state => state.game.onlineStatus)

  return (
    <header className={styles.header}>
      <h4>Pong Game Exercise</h4>
      <OnlineStatusRenderer onlineStatus={onlineStatus} />
    </header>
  )
}