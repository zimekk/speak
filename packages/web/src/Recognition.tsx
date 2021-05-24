import React, { useCallback, useEffect, useRef } from "react";

// https://mdn.github.io/web-speech-api/speech-color-changer/
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const colors = [
  "aqua",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "chocolate",
  "coral",
  "crimson",
  "cyan",
  "fuchsia",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "linen",
  "magenta",
  "maroon",
  "moccasin",
  "navy",
  "olive",
  "orange",
  "orchid",
  "peru",
  "pink",
  "plum",
  "purple",
  "red",
  "salmon",
  "sienna",
  "silver",
  "snow",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "white",
  "yellow",
];
const grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export default function () {
  const diagnosticRef = useRef();
  const buttonRef = useRef();

  const onRecognition = useCallback(
    () =>
      console.log(["Ready to receive a color command."]) || recognition.start()
  );

  useEffect(() => {
    const diagnostic = diagnosticRef.current;
    const bg = buttonRef.current;

    recognition.onresult = function (event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at the last position.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object
      var color = event.results[0][0].transcript;
      diagnostic.textContent = "Result received: " + color + ".";
      bg.style.backgroundColor = color;
      console.log("Confidence: " + event.results[0][0].confidence);
    };

    recognition.onspeechend = function () {
      recognition.stop();
    };

    recognition.onnomatch = function (event) {
      diagnostic.textContent = "I didn't recognise that color.";
    };

    recognition.onerror = function (event) {
      diagnostic.textContent = "Error occurred in recognition: " + event.error;
    };
  });

  return (
    <div>
      <h3>Speech color changer</h3>
      <div>
        Tap/click then say a color to change the background color of the app.
        Try{" "}
        {colors.map((backgroundColor, key) => (
          <span key={key} style={{ backgroundColor }}>
            {" "}
            {backgroundColor}{" "}
          </span>
        ))}
        .
      </div>
      <button ref={buttonRef} onClick={onRecognition}>
        Recognition
      </button>
      <div ref={diagnosticRef}></div>
    </div>
  );
}
