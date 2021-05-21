import React, { useCallback, useRef } from "react";

const TEXT2SPEECH = "Dzień dobry";

let voice;

// https://github.com/puppeteer/examples/blob/master/html/speech_synth.html
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
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
        // const name = 'Google UK English Male'; // Note: only works in Google Chrome.
        const name = "Google polski";
        resolve((voice = voices.find((voice) => voice.name === name)));
      };
    }
  });

  msg.onend = (e) => console.log("SPEECH_DONE");
  console.log(["SPEAK"], msg.voice);
  speechSynthesis.speak(msg);
}

export default function Speak() {
  const ref = useRef();
  const onSpeak = useCallback(
    () => console.log(["onSpeak"]) || speak(ref.current.value)
  );

  return (
    <div>
      <textarea ref={ref} defaultValue={TEXT2SPEECH} />
      <button onClick={onSpeak}>Speak</button>
    </div>
  );
}
