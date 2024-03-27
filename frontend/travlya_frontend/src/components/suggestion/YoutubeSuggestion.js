export function YoutubeSuggestion({url}) {
  return (
    <iframe 
      className="suggestion-frame" 
      src={url} 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    >
    </iframe>
  ) 
}