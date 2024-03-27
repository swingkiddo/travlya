import { UserCard } from "../user_card/UserCard";
import { useLoaderData, useOutletContext } from "react-router-dom";

export function Clips() {
  const users = useOutletContext();
  const cards = users.map(user => <UserCard user={user} type="twitch" key={user.twitch_id} />) 

  return (
    <div className="suggestion-list">
      { cards }
    </div>
  )
}

export const dataLoader = async () => {
  const API_URL = process.env.REACT_APP_API_URL
  const res = await fetch(API_URL + "/users?platform=T");
  const jsonRes = await res.json();
  // return jsonRes.map(user => <UserSuggestions user={user} type="twitch" />);
  return []
};