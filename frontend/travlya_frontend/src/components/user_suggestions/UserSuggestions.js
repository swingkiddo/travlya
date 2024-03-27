import "./UserSuggestions.css";
// import "font-awesome/css/font-awesome.min.css";

import { Suggestion } from "../suggestion/Suggestion";
import { HideButton } from "../hide_button/HideButton";

import { useState, useEffect } from "react";
import React from "react";

function initSuggestions(user, index) {
  let sugs = document.getElementsByClassName("suggestions");
  if (sugs.length) {
    sugs = sugs[index];
    sugs.classList.toggle("hidden");
    console.log(sugs.classList);
    // sugs.classList.add(user.twitch_id);
  }
}

export function UserSuggestions({ user, type }) {
  // const [suggestions, setSuggestions] = useState(sugs.map((s, index) => <Suggestion user={user} key={index} suggestion={s} />))
  const [suggestions, setSuggestions] = useState([])


  function deleteSuggestion(id) {
    let sugs = suggestions.filter(sug => sug.id != id);
    setSuggestions(sugs);
  }

  useEffect(() => {
    const sugs = user.suggestions.filter(sug => {
      if (sug.url.includes(type)) {
         return true 
      }
    }).slice(-5).map((s, i) => <Suggestion user={user} suggestion={s} type={type} key={i}/>)
    setSuggestions(sugs);
    console.log("sugs")
    console.log(sugs)
  }, [])

  // useEffect(() => {
  //   setSuggestions(suggestions.map(s => <Suggestion user={user} suggestion={s} ))
  // })

  

  return (
    <div className="user-suggestions-wrapper">
      <div className="user-info">
        <div className="user-info-left">
          <div className="avatar">
            <img
              src={user.profile_image}
              className="user-profile-image"
            ></img>
          </div>
          <div className="username">{user.username}</div>
          <div className="hide-button-wrapper">
            <HideButton />
          </div>
        </div>
        <div className="user-info-right">
          <div className="rating">{user.rating}</div>
        </div>
      </div>
      <div className={"suggestions"}>{suggestions}</div>
    </div>
  );
}
