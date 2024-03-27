import React from 'react'
import "./Suggestion.css"

import { UpdateRatingButton } from '../buttons/UpdateRatingButton/UpdateRatingButton'
import { DeleteSuggestionButton } from '../buttons/DeleteSuggestionButton/DeleteSuggestionButton'
import { YoutubeSuggestion } from './YoutubeSuggestion'
import { TwitchSuggestion } from './TwitchSuggestion'

export function Suggestion({ user, suggestion, type }) {
  const url = "https://clips.twitch.tv/embed?clip=UnsightlyShinyHamsterRaccAttack-AR44NQqbSJjkeGkj&parent=travlya.xyz:3000"
  const suggestionComponent = type == "youtube" ? <YoutubeSuggestion url={suggestion.embed_url}/> : <TwitchSuggestion url={suggestion.embed_url} />
  return (
    <div className='suggestion'>
      { suggestionComponent }
      <div className='suggestion-buttons'>
        <UpdateRatingButton user={user} type="minus" />
        <UpdateRatingButton user={user}  type="add" />
        <DeleteSuggestionButton callback={() => console.log("op")} suggestion={suggestion}  />
      </div>
    </div>
  )
};