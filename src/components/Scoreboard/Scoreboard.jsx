export default function Scoreboard({ score, highScore }) {
    return(
        <div>
            <p>Score: {score}</p>
            <p>High score: {highScore}</p>
        </div>
    )
}