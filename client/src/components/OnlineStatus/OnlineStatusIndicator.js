import React from 'react'
import OnlineStatus from '../../enums/online-status'
import styles from './online-status.module.css'

export default function OnlineStatusIndicator({ onlineStatus }) {
  switch (onlineStatus) {
    case OnlineStatus.CONNECTING:
      return <div>Connecting...</div>
    case OnlineStatus.OFFLINE:
      return (
        <div className={styles.error}>
          <span className={styles.dot} />
          Offline
        </div>
      )
    case OnlineStatus.ONLINE:
      return (
        <div className={styles.success}>
          <span className={styles.dot} />
          Online
        </div>
      )
    case OnlineStatus.RECONNECTING:
      return (
        <div className={styles.warn}>
          <span className={styles.dot} />
          Reconnecting...
        </div>
      )
    default:
      return <></>
  }
}
