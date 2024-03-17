import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export function DeleteSuggestionButton({callback, suggestion }) {
  function deleteSuggestion(event) {
    console.log("opa")
    const API_URL = `http://45.8.96.82:8000/suggestions/${suggestion.id}`
    console.log(API_URL)
    callback(suggestion.id)
    // fetch(API_URL, {
    //   method: "DELETE"
    // }).catch(err => console.log(err))
  }
  console.log("op")
  return (
    <div className="suggestion-delete-button">
      <FontAwesomeIcon icon={faTrash} onClick={deleteSuggestion} />
    </div>
  )
}