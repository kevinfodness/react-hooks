// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (key, initialValue) => {
  const [stateValue, setStateValue] = React.useState(() => JSON.parse(window.localStorage.getItem(key)) || initialValue);
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(stateValue));
  }, [key, stateValue]);
  return [stateValue, setStateValue];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('username', initialName);
  const [age, setAge] = useLocalStorageState('age', 0);

  function handleChangeName(event) {
    setName(event.target.value)
  }
  function handleChangeAge(event) {
    setAge(parseInt(event.target.value, 10))
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChangeName} id="name" />
        <label htmlFor="age">Age: </label>
        <input value={age} onChange={handleChangeAge} id="age" type="number" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
