import "./UserSuggestions.css";
// import "font-awesome/css/font-awesome.min.css";

import { Suggestion } from "../suggestion/Suggestion"
import { HideButton } from "../hide_button/HideButton";


function initSuggestions(user, index){
  let sugs = document.getElementsByClassName("suggestions");
  console.log(sugs)
  console.log(index)
  if (sugs.length) {
    sugs = sugs[index];
    sugs.classList.toggle("hidden");
    console.log(sugs.classList);
    // sugs.classList.add(user.twitch_id);
  }
}


export function UserSuggestions({ user }) {
    let suggestions = user.suggestions.slice(-5).map((s, index) => <Suggestion user={user} suggestion={s}/>)
    return (
      <>
        <div className='user-suggestions-wrapper'>
          <div className='user-info'>
            <div className="user-info-left">
              <div className='avatar'>
                <img src={user.profile_image} className='user-profile-image'></img>
              </div>
              <div className='username'>
                {user.username}
              </div>
              <div className="hide-button-wrapper">
                <HideButton />
              </div>
            </div>
            <div className="user-info-right">
              <div className='rating'>
                {user.rating}
              </div>
            </div>
          </div>
          <div className={'suggestions'}>{suggestions}</div>
        </div>
      </>
    )
  }