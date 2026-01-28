import styles from './Menu.module.css'

export default function GameOver({children}) {
    return(
        <div className={styles.menuWrapper}>
            {children}
        </div>
    )
}