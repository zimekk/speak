import React, { useCallback, useEffect, useRef, useState } from "react";

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
// recognition.lang = "pl-PL";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let voice;

// https://github.com/puppeteer/examples/blob/master/html/speech_synth.html
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
// https://mdn.github.io/web-speech-api/speak-easy-synthesis/
async function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  // msg.volume = 1; // 0 to 1
  // msg.rate = 1; // 0.1 to 10
  // msg.pitch = 1; //0 to 2
  // msg.lang = this.DEST_LANG;

  msg.voice = await new Promise((resolve) => {
    console.log(["VOICE"], voice);
    if (voice) {
      resolve(voice);
    } else {
      // Voice are populated, async.
      speechSynthesis.onvoiceschanged = (e) => {
        console.log(["onvoiceschanged"]);
        const voices = window.speechSynthesis.getVoices();
        for (const voice of voices) {
          // console.log(voice.name, voice.lang, voice.localService)
        }
        const name = "Google UK English Male"; // Note: only works in Google Chrome.
        // const name = "Google polski";
        resolve((voice = voices.find((voice) => voice.name === name)));
      };
    }
  });

  msg.onend = (e) => console.log("SPEECH_DONE");
  console.log(["SPEAK"], msg.voice);
  speechSynthesis.speak(msg);
}

export default function () {
  const [started, setStarted] = useState(false);
  const diagnosticRef = useRef();
  const buttonRef = useRef();

  const onRecognition = useCallback(
    () =>
      console.log(["Ready to receive a color command."]) ||
      recognition.start() ||
      setStarted(true)
  );

  const onSpeak = useCallback(
    (e) => console.log(["onSpeak"]) || speak(e.target.innerText)
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
      setStarted(false);
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
          <span key={key}>
            {" "}
            <button style={{ backgroundColor }} onClick={onSpeak}>
              {backgroundColor}
            </button>{" "}
          </span>
        ))}
        .
      </div>
      <button ref={buttonRef} onClick={onRecognition} disabled={started}>
        Recognition
      </button>
      <div ref={diagnosticRef}></div>
    </div>
  );
}
