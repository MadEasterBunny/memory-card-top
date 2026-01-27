import styles from './Gameboard.module.css'

export default function Gameboard({ children }) {
    return(
        <div className={styles.gameboardWrapper}>
            {children}
        </div>
    )
}