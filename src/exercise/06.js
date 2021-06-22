// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          There was an error: <pre style={{ whiteSpace: 'normal' }}>{this.state.error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({ status: 'idle' });

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      return;
    }
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    (async () => {
      setState({ status: 'pending' });
      try {
        const pokemon = await fetchPokemon(pokemonName);
        setState({
          pokemon,
          status: 'resolved',
        })
      } catch (e) {
        setState({
          error: e,
          status: 'rejected',
        })
      }
    })();
  }, [pokemonName]);

  switch (state.status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />;
    case 'rejected':
      throw state.error;
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
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
