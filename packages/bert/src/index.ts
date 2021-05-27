import { QAClient, initModel } from "question-answering"; // When using Typescript or Babel

async function qa(text: string, question: string) {
  // https://github.com/huggingface/node-question-answering#using-another-model
  const model = await initModel({ name: "a-ware/mobilebert-squadv2" });
  const qaClient = await QAClient.fromOptions({ model });
  const answer = await qaClient.predict(question, text);
  console.log({ answer });
  return answer;
}

export default (
  text = `My name is Clara and I live in Berkeley.`,
  question = `What's my name?`
) => qa(text, question); // { text: 'Denver Broncos', score: 0.3 }
