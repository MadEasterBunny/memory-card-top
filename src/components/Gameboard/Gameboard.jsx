import { useEffect, useState } from "react"
import styles from './Gameboard.module.css'
import Card from "../Card/Card"

export default function Gameboard() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=18');

                if(!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setPokemon(data.results);
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

    if(loading) return <div>Loading cards...</div>

    if(error) return <div>{error}</div>

    console.log(pokemon);

    return(
        <div className={styles.gameboardWrapper}>
            {pokemon.map((pokemon, index) => {
                const pokemonId = index + 1;
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
                return(
                    <Card key={pokemon.name} img={imageUrl} text={pokemon.name}/>
                )
            })}
        </div>
    )
}