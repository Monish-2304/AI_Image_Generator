const api_key = "paste your api key here";

const submit = document.querySelector("#submit");
const reset = document.querySelector("#reset");
const speak = document.querySelector("#generate");
const inputElement = document.querySelector("#floatingTextarea2");
const imageSection = document.querySelector(".images-section");

//speech recognition
var speechRecognition = window.webkitSpeechRecognition;
var recognition = new speechRecognition();
var content = "";
recognition.continuous = true;

//generate speech text
speak.addEventListener("click", function (event) {
	if (content.length) {
		content = "";
	}
	recognition.start();
});

//add generated text to textbox
recognition.onresult = (event) => {
	var current = event.resultIndex;
	var transcript = event.results[current][0].transcript;
	content += transcript;
	inputElement.value = content;
};

//get images based on textbox content
const getImages = async () => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${api_key}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			prompt: inputElement.value,
			n: 4,
			size: "1024x1024",
		}),
	};
	try {
		const response = await fetch(
			"https://api.openai.com/v1/images/generations",
			options
		);
		const data = await response.json();
		data?.data.forEach((imageObject) => {
			const imageContainer = document.createElement("div");
			imageContainer.classList.add("image-container");
			const imageElement = document.createElement("img");
			imageElement.setAttribute("src", imageObject.url);
			imageContainer.append(imageElement);
			imageSection.append(imageContainer);
		});
	} catch (error) {
		console.log(error);
	}
};

//reset
const remImages = () => {
	document.querySelectorAll(".image-container").forEach((e) => e.remove());
	inputElement.value = null;
};

submit.addEventListener("click", getImages);
reset.addEventListener("click", remImages);
