import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"

import "../buttons.css"

export function UpdateRatingButton({ user, type }) {
    const API_URL = `http://45.8.96.82:8000/users/${user.twtitch_id}`
    // const API_URL = `http://192.168.3.9:8000/users/${user.twitch_id}`
    console.log(API_URL)
    function addRating() {
        let body = {
            twitch_id: user.twitch_id,
            username: user.username,
            rating: user.rating + 5,
            display_name: user.display_name,
            profile_image: user.profile_image
        }

        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }
        fetch(API_URL, requestOptions)
            .then(response => console.log(response.json()))
            .catch(err => console.log(err))
    }

    function reduceRating() {
        let body = {
            twitch_id: user.twitch_id,
            username: user.username,
            rating: user.rating - 5,
            display_name: user.display_name,
            profile_image: user.profile_image

        }

        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }
        fetch(API_URL, requestOptions)
            .then(response => console.log(response.json()))
            .catch(err => console.log(err))
    }

    let icon = type == "add" ? faPlus : faMinus
    let callback = type == "add" ? addRating : reduceRating
    return (
        <div className="suggestion-update-rating-button">
            <FontAwesomeIcon icon={icon} onClick={callback}/>
        </div>
    )
}
