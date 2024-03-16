import React from 'react'
import "./Suggestion.css"

export function Suggestion({ user, suggestion }) {
    return (
      <div className='suggestion'>
        <iframe
            className='suggestion-frame'
            // key={index}
            // width="320" 
            // height="200" 
            src={suggestion.embed_url} 
            title="YouTube video player" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="no-referrer-when-downgrade" >
          
          </iframe>
        {/* <div className='rate-buttons-wrapper'>
          <RateButton user={user} suggestion={suggestion} type="rateUp" />
          <RateButton user={user} suggestion={suggestion} type="rateDown" />
        </div> */}
      </div>
    )
  };