import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import React from "react"

export function DeleteSuggestionButton({suggestion }) {
  function deleteSuggestion(event) {
    const API_URL = `${process.env.REACT_APP_API_URLL}/${suggestion.id}`
    fetch(API_URL, {
      method: "DELETE"
    }).catch(err => console.log(err))
  }

  return (
    <div className="suggestion-delete-button">
      <FontAwesomeIcon icon={faTrash} onClick={deleteSuggestion} />
    </div>
  )
}