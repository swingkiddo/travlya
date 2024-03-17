import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretUp } from "@fortawesome/free-solid-svg-icons"

import { useState } from "react";

export function HideButton() {
    const [rotation, setRotation] = useState(0);
    function toggleHide(event) {
        let wrapper = event.currentTarget.closest(".user-suggestions-wrapper");
        let sugs = wrapper.getElementsByClassName("suggestions");

        if (sugs.length) {
          sugs = sugs[0];
          sugs.classList.toggle('hidden');
          let newRotation = rotation > 0 ? 0 : 180
          setRotation(newRotation)
          event.currentTarget.style.transform = `rotate(${newRotation}deg)`;
        }
    }

    return (
      <FontAwesomeIcon icon={faCaretUp} onClick={toggleHide}/>
    )
  }