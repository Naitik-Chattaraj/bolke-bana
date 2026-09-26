const fs = require('fs');

async function test() {
  try {
    const formData = new FormData();
    // Use an empty Blob for testing, or read a real file
    const blob = new Blob(["test audio content"], { type: "audio/wav" });
    
    formData.append("file", blob, "audio.wav");
    formData.append("model", "saaras:v3");

    console.log("Sending request to Sarvam...");
    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": "sk_32g6rga7_FsGzs64NR0HMiCGaCxdfh8tV",
      },
      body: formData,
    });

    console.log("Status:", response.status);
    const text = await response.text();
    console.log("Response:", text);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

test();
