// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
//querySelector is pretty much jQuery va mitoni har chizio bahash select koni : id, ...
//ina baraye jlogiri az tekrare address dadan be doc, querySelector, ... ast
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Init voices array/we are going to fetch the voices using the API
let voices = [];

//arrow function : ES6
const getVoices = () => {
  //get kone brize to araye voices
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

// ba in voice haro log mindaze chon web-speech-api niaz be eventListener dare
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices; //set krdimesh roye functione getVoices
}

// Speak
const speak = () => {
  // Check if speaking
  //avalin kar omadim khatasho barrasi krdim ke age nashod chi bshe? khoroji roye hava to web nadarim :D
  // ye log mindaze fqad bhtare k ye texte red bshe ...
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }

  //asle kar ke text ro migire voice mikone
  if (textInput.value !== "") {
    // Add background animation
    //age roye host deploy nakoni (ro server ejrash nakoni in shayad ejra nashe)
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x"; //it will repeat just on horizontal fation because of "x"
    body.style.backgroundSize = "100% 100%"; //"100% 100%" will cover all the back ground

    //ta inja k ino set krdim age unsetesh nakonim hamintor repeatetive tekrar mishe
    //toie programming koln bayad havaset bashe ke ye chizi ro set mikoni, unsetesh ham bokoni
    //pas avlan toie if gozashtim k khali ejra nashe
    //va toie "Done speaking..." in paiin back ground ro be halate avaliash dar avordim

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      console.log("Done speaking...");
      body.style.background = "#141414";
    };

    // Speak error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    //so now we have those variable voices we want to put them into that selectList :)
    //make ur selectList full of voices which all come from synth.getVoices();
    // Loop through voices
    //loop mizanim k age current voice match bod ba chizi k select shode, pas on voico entekhab kn
    //yademone ke voices golbal array bod !
    //bedone in qesmate select qabele select nist va fqd mishe bala paiin raft va didesh !
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
//submit esme eventemone :|
textForm.addEventListener("submit", e => {
  //arrow function with an event parameter

  //since it's a form it's a submit we wanna do perventing to submiting to a file
  e.preventDefault();
  speak();
  //textInput on bala bod
  //set a text input and call it blur
  textInput.blur();
});

// "Rate" value change
// eventemon = change, ke behesh listen mikonim... and we are gonna take the value "rateValue." and set the "textContent" to whatever "rate.value" is
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// "Pitch" value change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener("change", e => speak());
