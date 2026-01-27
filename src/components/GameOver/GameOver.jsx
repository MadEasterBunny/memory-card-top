import styles from './GameOver.module.css'

export default function GameOver({children}) {
    return(
        <div className={styles.gameOverWrapper}>
            {children}
        </div>
    )
}