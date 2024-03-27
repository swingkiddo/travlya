import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons"
import { redirect, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL
export function SuggestionSwitchButton({ type }){
  const icon = type == "twitch" ? faTwitch : faYoutube;
  const redirectURL = type == "twitch" ? "/clips" : "/videos";
  const color = type == "twitch" ? "purple" : "red"
  // const Link = useNavigate();
  return (
    <div className="suggestion-switch-button">
      <Link to={redirectURL} >
        <FontAwesomeIcon icon={icon} color={color}/>
    </Link>
    </div>

  )
}