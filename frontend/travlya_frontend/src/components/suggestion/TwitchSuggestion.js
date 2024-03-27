import ReactTwitchEmbedVideo from "react-twitch-embed-video";

export function TwitchSuggestion({ url }) {
  return (
    // <ReactTwitchEmbedVideo video={videoId}/>
    <iframe 
      className="suggestion-frame" 
      src={url} 
      allowFullScreen
    >
  </iframe>
  )
}