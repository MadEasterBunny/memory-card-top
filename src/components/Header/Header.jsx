import styles from './Header.module.css'

export default function Header({ children }) {
    return(
        <div className={styles.headerWrapper}>
            <div className={styles.headerItem}>
                <h1>Pokemon Memory Game</h1>
                <p>Score points by clicking on an image, but be careful not to click the same image twice!</p>
            </div>
            {children}
        </div>
    )
}