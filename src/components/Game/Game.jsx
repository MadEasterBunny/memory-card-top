import { useState, useEffect } from "react"
import Header from "../Header/Header"
import Scoreboard from "../Scoreboard/Scoreboard"
import Gameboard from "../Gameboard/Gameboard"
import Card from "../Card/Card"
import Menu from "../Menu/Menu"

const getId = (url) => {
    return url.split('/').filter(Boolean).pop();
}

const shuffleCards = (arr) => {
    const arrCopy = [...arr];
    for(let i = arrCopy.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
    }
    return arrCopy;
}

export default function Game() {
    const [gameState, setGameState] = useState('start');
    const [initialPokemon, setInitialPokemon] = useState([]);
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prevClick, setPrevClick] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=18');

                if(!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const cleanedPokemon = data.results.map(pokemon => {
                    const id = getId(pokemon.url);
                    return {
                        name: pokemon.name,
                        id: id,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                    };
                });
                setInitialPokemon(cleanedPokemon);
                setPokemon(cleanedPokemon);
                setError(null);
            } catch (error) {
                setError(`Error fetching data: ${error.message}`);
                setPokemon([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemon();
    }, []);

    const handleCardClick = (data) => {
        if(prevClick.includes(data)) {
            console.log('game over');
            setGameState('gameOver');
            if(highScore < score) {
                setHighScore(score);
            }
            setPrevClick([]);
            setScore(0);
            return;
        }

        setPrevClick([...prevClick, data]);
        setScore(score + 1);

        const shuffledCards = shuffleCards(pokemon);
        setPokemon(shuffledCards);
    }

    const handlePlay = () => {
        setGameState('playing');
        setPokemon(initialPokemon);
    }

    return(
        <>
            <Header>
                <Scoreboard score={score} highScore={highScore} />
            </Header>
            {error && <div>{error}</div>}
            {loading && <div>Loading cards...</div>}
            {gameState === 'start' && (
                <Menu>
                    <h2>Start Game</h2>
                    <button onClick={handlePlay}>Play</button>
                </Menu>
            )}
            {gameState === 'gameOver' && (
                <Menu>
                    <h2>Game Over</h2>
                    <p>High score: {highScore}</p>
                    <button onClick={handlePlay}>Play again</button>
                </Menu>
            )}
            {!loading && !error && gameState === 'playing' && (
                <Gameboard>
                    {pokemon.map((pokemon) => (
                            <Card key={pokemon.name} img={pokemon.image} text={pokemon.name} onClickCard={() => handleCardClick(pokemon.name)}/>
                        )
                    )}
                </Gameboard>
            )}
        </>
    )
}