import { Clips } from "../clips/Clips";
import { Videos } from "../videos/Videos"
import { Outlet } from "react-router-dom";
import { SuggestionSwitchButton } from "../buttons/SuggestionSwitchButton/SuggestionSwitchButton";
import { useEffect, useState } from "react";

export function SuggestionList({ users }) {
  // const [suggestions, setSuggestions] = useState([])
  // useEffect(() => {
  //   if (suggestions == "undefined") {
  //     const API_URL = process.env.REACT_APP_API_URL
  //     fetch(API_URL + "/suggestions")
  //   }
  // })
  return (
    <div className="suggestion-list">
      <Outlet context={users}/>
    </div>
  )
}