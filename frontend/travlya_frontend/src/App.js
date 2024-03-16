import './App.css';
import { useState, useEffect } from "react"

import { UserSuggestions  } from './components/user_suggestions/UserSuggestions';
const API_URL = "http://192.168.3.3:8000"

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(API_URL + "/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err.message)
      });
  }, []);

  
  if (users) {
    let filteredUsers = users.filter(user => {
      // const sugs = user.suggestions.filter(sug => {
      //   let date = new Date(sug.timestamp);
      //   return is_today(date)
      // });
      // return sugs.length > 0
      return user.suggestions.length > 0
    }) 
    console.log(filteredUsers)
    const suggestions = filteredUsers.map((user, i) => <UserSuggestions user={user} key={i} />) 
    return (
      <div className='App'>
        <div className='App-header'>
            {suggestions}
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Sheeeesh</h1>
      </div>
    )
  }

}

function is_today(date) {
  let today = new Date();
  if (date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()){
    return true
  }
  return false
}

// function MyButton() {
//   const [count, setCount] = useState(0)

//   function handleClick() {
//     setCount(count + 1)
//   }

//   return (
//     <button onClick={handleClick}>
//       Clicked {count} times
//     </button>
//   )
// }

// function RateButton({ user, suggestion, type }) {
//   function rateUp() {
//     console.log("+rep!")
//   }

//   function rateDown() {
//     console.log("-rep!")
//   }

//   const text = type === "rateUp" ? "+rep" : "-rep"
//   const onClickFunction = type === "rateUp" ? rateUp : rateDown
//   return (
//     <button className='rate-button' onClick={onClickFunction}>
//       {text}
//     </button>
//   )
// }

export default App;

