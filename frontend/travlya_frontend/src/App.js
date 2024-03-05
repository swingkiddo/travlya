import './App.css';
import { useState, useEffect } from "react"
const API_URL = "http://192.168.3.3:8000"


function MyButton() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  )
}

function UserSuggestions({ user }) {
  const suggestions = user.suggestions.map((s, index) => 
      <iframe
        className='suggestion-frame'
        key={index}
        width="560" 
        height="315" 
        src={s.url} 
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" >
      </iframe>


    )
  return (
    <>
      <div className='user-suggestions-wrapper'>
        <div className='user-info'>{user.username}</div>
        <div className='suggestions'>{suggestions}</div>
      </div>

    </>
  )
}

function App() {
  const [users, setUsers] = useState([])
  const [suggestion, setSuggestion] = useState()

  useEffect(() => {
    fetch(API_URL + "/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
        setSuggestion(data[0].suggestions[0]);
      })
      .catch((err) => {
        console.log(err.message)
      });
  }, []);

  
  if (users) {
    const suggestions = users.map((user, i) => <UserSuggestions user={user} key={i} />) 
    return (
      <div className='App'>
        <div className='App-header'>
            {suggestions}

          {/* <iframe 
            width="560" 
            height="315" 
            src={suggestion.url} 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          >

            </iframe> */}
        </div>
        {/* <iframe width="560" height="360" src=></iframe> */}
      </div>
    )
  } else {
    return (
      <div>
  
        <h1>Sheeeesh</h1>
        <MyButton />
      </div>
    )
  }

}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
