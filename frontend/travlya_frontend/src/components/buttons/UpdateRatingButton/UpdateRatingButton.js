import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import React from "react"

import "../buttons.css"

export function UpdateRatingButton({ user, type }) {
    const API_URL = `${process.env.REACT_APP_API_URL}/${user.twitch_id}`

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
