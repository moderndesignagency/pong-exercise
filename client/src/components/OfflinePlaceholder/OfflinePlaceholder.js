import React from "react";
import styles from './offline-placeholder.module.css';

export default function OfflinePlaceholder() {
  return (
    <div className={styles['offline-placeholder']}>
      <h1>Connection failed</h1>
      <p>Conection to game server failed. Please check your internet connection or try to refresh this page</p>
      <button className={styles['offline-placeholder__button']} onClick={() => window.location.href = ''}>Refresh</button>
    </div>
  )
}