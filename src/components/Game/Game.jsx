
import { useState } from "react"
import Gameboard from "../Gameboard/Gameboard"
import Scoreboard from "../Scoreboard/Scoreboard"

export default function Game() {
    const [prevClick, setPrevClick] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const handleClick = (data) => {
        if(prevClick.includes(data)) {
            console.log('game over');
            if(highScore < score) {
                setHighScore(score);
            }
            setPrevClick([]);
            setScore(0);
            return;
        }

        setPrevClick([...prevClick, data]);
        console.log('Prev click ' + prevClick);
        console.log('Curr click ' + data);
        setScore(score + 1);
    }

    return(
        <>
            <div>
                <div>
                    <h1>Memory Game</h1>
                    <p>Score points by clicking on an image, but be careful not to click the same image twice!</p>
                </div>
                <Scoreboard score={score} highScore={highScore} />
            </div>
            <Gameboard onClickCard={handleClick} />
        </>
    )
}