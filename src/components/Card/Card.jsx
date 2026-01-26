import styles from './Card.module.css'

export default function Card({ img, text, onClickCard }) {
    const capitalize = (str) => {
        if(!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return(
        <div className={styles.cardWrapper} onClick={onClickCard}>
            <img src={img} alt="" />
            <p>{capitalize(text)}</p>
        </div>
    )
}