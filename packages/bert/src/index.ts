import { QAClient, initModel } from "question-answering"; // When using Typescript or Babel

const text = `My name is Clara and I live in Berkeley.`
const question = "What's my name?";

async function qa(question) {
  // https://github.com/huggingface/node-question-answering#using-another-model
  const model = await initModel({ name: "a-ware/mobilebert-squadv2" });
  const qaClient = await QAClient.fromOptions({model});
const answer = await qaClient.predict(question, text);
return answer;
}

qa(question).then(console.log); // { text: 'Denver Broncos', score: 0.3 }
