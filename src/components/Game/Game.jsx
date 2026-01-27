import { useState, useEffect } from "react"
import Scoreboard from "../Scoreboard/Scoreboard"
import Gameboard from "../Gameboard/Gameboard"
import Card from "../Card/Card"

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
        setScore(score + 1);

        const shuffledCards = shuffleCards(pokemon);
        setPokemon(shuffledCards);
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
            {error && <div>{error}</div>}
            {loading && <div>Loading cards...</div>}
            {!loading && !error && (
                <Gameboard>
                    {pokemon.map((pokemon) => (
                            <Card key={pokemon.name} img={pokemon.image} text={pokemon.name} onClickCard={() => handleClick(pokemon.name)}/>
                        )
                    )}
                </Gameboard>
            )}
        </>
    )
}