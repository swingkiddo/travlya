import { useState, useEffect, useMemo } from "react"
import { UserSuggestions } from "../user_suggestions/UserSuggestions"
import { useLoaderData, useOutletContext } from "react-router-dom"
import { SuggestionSwitchButton } from "../buttons/SuggestionSwitchButton/SuggestionSwitchButton"
import { UserCard } from "../user_card/UserCard"

export function Videos() {
    // const [suggestions, setSuggestions] = useState(useLoaderData())
    const users = useOutletContext();
    const cards = users.map(user => <UserCard user={user} type="youtube" key={user.twitch_id} />)
    console.log(cards)
    // useEffect(() => {
    //   setSuggestions(users.map(user => <UserSuggestions user={user} type="youtube" />))
    // }, [])

    // useEffect(() => {
    //   if (users != "undefined") {
    //     setSuggestions(users.map(user => <UserSuggestions user={user} type="youtube" />))
    //   }
    // }, [users])

    // if (users && users.length > 0) {
    //   setSuggestions(users.map())
    // }
    // const navigate = useNavigate()

    // useEffect(() => {
    //   const API_URL = process.env.REACT_APP_API_URL
    //   fetch(API_URL + "/users")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const suggestions = data.map(user => <UserSuggestions user={user} type="youtube" />);
    //       setSuggestions(suggestions)
    //     })
    //     .catch((err) => console.log(err.message))
    // })
    
  
    return (
      <div className="suggestion-list">
        { cards }
      </div>
    )
  }

export const dataLoader = async () => {
  // const API_URL = process.env.REACT_APP_API_URL
  // const res = await fetch(API_URL + "/suggestions?platform=Y");
  // console.log(res)
  // const jsonRes = await res.json();
  // return jsonRes.map(user => <UserSuggestions user={user} type="youtube" />);
  return []
  };