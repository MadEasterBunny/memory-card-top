import styles from './Scoreboard.module.css'

export default function Scoreboard({ score, highScore }) {
    return(
        <div className={styles.scoreboardWrapper}>
            <p>Score: {score}</p>
            <p>High score: {highScore}</p>
        </div>
    )
}