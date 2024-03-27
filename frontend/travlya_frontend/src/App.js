import './App.css';
import React, { useState, useEffect } from "react";
import { Outlet, Link } from 'react-router-dom';
import "./.env";

import { SuggestionList } from './components/suggestion_list/SuggestionList';
import { SuggestionSwitchButton } from "./components/buttons/SuggestionSwitchButton/SuggestionSwitchButton";
import { UserSuggestions  } from './components/user_suggestions/UserSuggestions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons"

const API_URL = process.env.REACT_APP_API_URL

function App() {
  const [users, setUsers] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const styles = {
    boxShadow: "10px 10px 5px #1b5f72"
  }

  useEffect(() => {
    fetch(API_URL + "/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        let filteredUsers = data.filter(user => {
          // const sugs = user.suggestions.filter(sug => {
          //   let date = new Date(sug.timestamp);
          //   return is_today(date)
          // });
          // return sugs.length > 0
          return user.suggestions.length > 0
        }) 

        setSuggestions(filteredUsers.map((user, i) => <UserSuggestions user={user} key={i} />)) 
      })
      .catch((err) => {
        console.log(err.message)
      });
  }, []);

  
  if (users) {
    // let filteredUsers = users.filter(user => {
    //   // const sugs = user.suggestions.filter(sug => {
    //   //   let date = new Date(sug.timestamp);
    //   //   return is_today(date)
    //   // });
    //   // return sugs.length > 0
    //   return user.suggestions.length > 0
    // }) 
    // console.log(filteredUsers)
    // let suggestions = filteredUsers.map((user, i) => <UserSuggestions user={user} type={suggestionsType} key={i} />) 
    return (
      <div className='App'>
        <header>
          <div className="suggestion-switch-buttons">
            <SuggestionSwitchButton type="twitch" />
            <SuggestionSwitchButton type="youtube" />
          </div>
        </header>
        <div className='App-header'>
          <SuggestionList users={users} />
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

export default App;

