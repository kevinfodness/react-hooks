// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [error, setError] = React.useState(null);
  const [pokemon, setPokemon] = React.useState(null);
  const [status, setStatus] = React.useState('idle');

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      setStatus('idle');
      return;
    }
    // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    setPokemon(null);
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    (async () => {
      setStatus('pending');
      try {
        const pokemonData = await fetchPokemon(pokemonName);
        setPokemon(pokemonData);
        setStatus('resolved');
      } catch (e) {
        setError(e);
        setStatus('rejected');
      }
    })();
  }, [pokemonName]);

  switch (status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />;
    case 'rejected':
      return (
        <div role="alert">
          There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
        </div>
      );
    default:
      return 'Submit a pokemon';
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
