import { useState, useEffect } from "react"
import Header from "../Header/Header"
import Scoreboard from "../Scoreboard/Scoreboard"
import Gameboard from "../Gameboard/Gameboard"
import Card from "../Card/Card"
import Menu from "../Menu/Menu"

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
    const [difficulty, setDifficulty] = useState('');
    const [initialPokemon, setInitialPokemon] = useState([]);
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prevClick, setPrevClick] = useState([]);
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState({
        '6': 0,
        '12': 0,
        '18': 0
    });

    useEffect(() => {
        if(gameState === 'loading') {
            setLoading(true);
            const fetchPokemon = async () => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${difficulty}`);
    
                    if(!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
    
                    const data = await response.json();
                    const details = await Promise.all(
                        data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
                    )
                    const cleanedPokemon = details.map(pokemon => {
                        return {
                            name: pokemon.name,
                            id: pokemon.id,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                            type: pokemon.types?.[0]?.type?.name
                        };
                    });

                    const imagePromises = cleanedPokemon.map(pokemon => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = pokemon.image;
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    });

                    await Promise.all(imagePromises);

                    setInitialPokemon(cleanedPokemon);
                    setPokemon(cleanedPokemon);
                    setError(null);
                    setGameState('playing');
                } catch (error) {
                    setError(`Error fetching data: ${error.message}`);
                    setPokemon([]);
                } finally {
                    setLoading(false);
                }
            }
            fetchPokemon();
        }

    }, [gameState, difficulty]);

    const handleCardClick = (data) => {
        const nextScore = score + 1
        const lost = prevClick.includes(data);
        const won = nextScore === pokemon.length;
        
        if(lost || won) {
            const finalScore = won ? nextScore : score;
            if(finalScore > highScores[difficulty]) {
                setHighScores(prev => ({
                    ...prev,
                    [difficulty]: finalScore
                }));
            }
            setGameState(won ? 'win' : 'gameOver');
            setPrevClick([]);
            return;
        }
        
        setPrevClick([...prevClick, data]);
        setScore(nextScore);
        setPokemon(shuffleCards(pokemon));
    }

    const handleMainMenu = () => {
        setGameState('start');
        setScore(0);
    }

    const handleGameOver = () => {
        setGameState('playing');
        setScore(0);
        setPokemon(initialPokemon);
    }

    const handleGameStart = (e) => {
        const target = e.target.value;
        const difficulties = {
            easy: '6',
            medium: '12',
            hard: '18',
        }

        setDifficulty(difficulties[target]);
        setGameState('loading');
    }

    return(
        <>
            <Header>
                {gameState === 'playing' && (
                    <Scoreboard score={score} highScore={highScores[difficulty]} />
                )}
            </Header>
            {error && <div>{error}</div>}
            {gameState === 'start' && (
                <Menu>
                    <h2>Start Game</h2>
                    <div>
                        <button onClick={handleGameStart} value='easy'>Easy</button>
                        <button onClick={handleGameStart} value='medium'>Medium</button>
                        <button onClick={handleGameStart} value='hard'>Hard</button>
                    </div>
                </Menu>
            )}
            {gameState === 'win' && (
                <Menu>
                    <h2>You Win!</h2>
                    <p>High score: {highScores[difficulty]}</p>
                    <div>
                        <button onClick={handleMainMenu}>Main Menu</button>
                    </div>
                </Menu>
            )}
            {gameState === 'gameOver' && (
                <Menu>
                    <h2>Game Over</h2>
                    <p>Score: {score}</p>
                    <p>High score: {highScores[difficulty]}</p>
                    <div>
                        <button onClick={handleGameOver}>Play again</button>
                        <button onClick={handleMainMenu}>Main Menu</button>
                    </div>
                </Menu>
            )}
            {!error && gameState === 'playing' && (
                <Gameboard>
                    {loading && <div>Loading cards...</div>}
                    {pokemon.map((pokemon) => (
                            <Card key={pokemon.name} img={pokemon.image} text={pokemon.name} type={pokemon.type} onClickCard={() => handleCardClick(pokemon.name)}/>
                        )
                    )}
                </Gameboard>
            )}
        </>
    )
}