import { useState } from "react";

import { HideButton } from "../hide_button/HideButton";
import { Suggestion } from "../suggestion/Suggestion";
import { YoutubeSuggestion } from "../suggestion/YoutubeSuggestion";
import { TwitchSuggestion } from "../suggestion/TwitchSuggestion";


export function UserCard({ user, type }) {
  let suggestions;
  if (user != undefined && user.suggestions.length > 0) { 
    suggestions = user.suggestions.filter(sug => {
      if (sug.url.includes(type)) { return true }
    }).slice(-4).map((s, i) => {
      return <Suggestion user={user} suggestion={s} type={type }/>
      // if (type == "youtube") {
      //    return <YoutubeSuggestion url={s.embed_url}/>
      // } else if (type == "twitch") {
      //   return <TwitchSuggestion url={s.embed_url} />
      // }
    })  
  }
  console.log(suggestions)
  if (suggestions.length < 1) {
    return (<></>)
  }
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
      <div className={"suggestions"}>
        { suggestions }
      </div>
    </div>
  );
}