import React, { useCallback, useRef } from "react";
// import * as tf from '@tensorflow/tfjs';
import "@tensorflow/tfjs-core";
// import '@tensorflow/tfjs-converter';
// import '@tensorflow/tfjs-backend-cpu';
import "@tensorflow/tfjs-backend-webgl";
import * as speechCommands from "@tensorflow-models/speech-commands";

// https://teachablemachine.withgoogle.com/train/audio

// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
// const URL = "./my_model/";
const URL = (({ host, pathname, protocol }) =>
  `${protocol}//${host}${pathname}audio-model/`)(location);

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

async function init(labelContainer) {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  // const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < classLabels.length; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(
    (result) => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      for (let i = 0; i < classLabels.length; i++) {
        const classPrediction =
          classLabels[i] + ": " + result.scores[i].toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
      }
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}

export default function () {
  const labelContainerRef = useRef();

  const onStart = useCallback(
    (e) => console.log(["onStart"]) || init(labelContainerRef.current)
  );

  return (
    <div>
      <h3>Teachable Machine Audio Model</h3>
      <button onClick={onStart}>Start</button>
      <div ref={labelContainerRef}></div>
    </div>
  );
}
