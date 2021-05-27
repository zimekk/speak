import React, { Suspense, useCallback, useRef, useState } from "react";
import { createAsset } from "use-asset";

const Spinner = () => <span>Loading...</span>;

const hello = createAsset(async (text, question) => {
  const res = await fetch(`api/ask.json?text=${text}&question=${question}`);
  return await res.json();
});

function Answer({ children: { text, question } }) {
  const { answer } = hello.read(text, question);

  console.log({ answer });
  return (
    <div>
      <div>Answer ({answer.score})</div>
      <div>{answer.text}</div>
    </div>
  );
}

export default function () {
  const [value, setValue] = useState(null);
  const textRef = useRef();
  const questionRef = useRef();

  const onAsk = useCallback(
    () =>
      console.log(["onAsk"]) ||
      setValue({
        text: textRef.current.value,
        question: questionRef.current.value,
      })
  );

  return (
    <div>
      <h3>Question Answering</h3>
      <label>
        <div>Text</div>
        <textarea
          ref={textRef}
          defaultValue={`My name is Clara and I live in Berkeley.`}
        />
      </label>
      <label>
        <div>Question</div>
        <textarea ref={questionRef} defaultValue={`What's my name?`} />
      </label>
      <button onClick={onAsk}>Ask</button>
      {value && (
        <Suspense fallback={<Spinner />}>
          <Answer>{value}</Answer>
        </Suspense>
      )}
    </div>
  );
}
