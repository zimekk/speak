(self.webpackChunk_dev_web=self.webpackChunk_dev_web||[]).push([[499],{499:(e,n,o)=>{"use strict";o.r(n),o.d(n,{default:()=>d});var t=o(784),c=c||webkitSpeechRecognition,r=r||webkitSpeechGrammarList,l=l||webkitSpeechRecognitionEvent;const a=["aqua","azure","beige","bisque","black","blue","brown","chocolate","coral","crimson","cyan","fuchsia","ghostwhite","gold","goldenrod","gray","green","indigo","ivory","khaki","lavender","lime","linen","magenta","maroon","moccasin","navy","olive","orange","orchid","peru","pink","plum","purple","red","salmon","sienna","silver","snow","tan","teal","thistle","tomato","turquoise","violet","white","yellow"],i="#JSGF V1.0; grammar colors; public <color> = "+a.join(" | ")+" ;",s=new c,u=new r;let g;function d(){const[e,n]=(0,t.useState)(!1),o=(0,t.useRef)(),c=(0,t.useRef)(),r=(0,t.useCallback)((()=>console.log(["Ready to receive a color command."])||s.start()||n(!0))),l=(0,t.useCallback)((e=>console.log(["onSpeak"])||async function(e){const n=new SpeechSynthesisUtterance;n.text=e,n.voice=await new Promise((e=>{console.log(["VOICE"],g),g?e(g):speechSynthesis.onvoiceschanged=n=>{console.log(["onvoiceschanged"]);const o=window.speechSynthesis.getVoices();for(const e of o);e(g=o.find((e=>"Google UK English Male"===e.name)))}})),n.onend=e=>console.log("SPEECH_DONE"),console.log(["SPEAK"],n.voice),speechSynthesis.speak(n)}(e.target.innerText)));return(0,t.useEffect)((()=>{const e=o.current,t=c.current;s.onresult=function(n){var o=n.results[0][0].transcript;e.textContent="Result received: "+o+".",t.style.backgroundColor=o,console.log("Confidence: "+n.results[0][0].confidence)},s.onspeechend=function(){s.stop(),n(!1)},s.onnomatch=function(n){e.textContent="I didn't recognise that color."},s.onerror=function(n){e.textContent="Error occurred in recognition: "+n.error}})),t.createElement("div",null,t.createElement("h3",null,"Speech color changer"),t.createElement("div",null,"Tap/click then say a color to change the background color of the app. Try"," ",a.map(((e,n)=>t.createElement("span",{key:n}," ",t.createElement("button",{style:{backgroundColor:e},onClick:l},e)," "))),"."),t.createElement("button",{ref:c,onClick:r,disabled:e},"Recognition"),t.createElement("div",{ref:o}))}u.addFromString(i,1),s.grammars=u,s.continuous=!1,s.lang="en-US",s.interimResults=!1,s.maxAlternatives=1}}]);