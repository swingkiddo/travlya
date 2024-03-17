import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"

import "../buttons.css"

export function UpdateRatingButton({ user, type }) {
    function addRating() {
        const API_URL = `http://45.8.96.82:8000/users/${user.id}`
    }
    let icon = type == "add" ? faPlus : faMinus
    return (
        <div className="suggestion-update-rating-button">
            <FontAwesomeIcon icon={icon} />
        </div>
    )
}
