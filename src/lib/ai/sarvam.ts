import { AppSpec, AppSpecSchema } from "../schemas/app-spec";
import { SYSTEM_PROMPT_REQUIREMENTS, SYSTEM_PROMPT_MODIFICATION } from "./prompts";

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || process.env.NEXT_PUBLIC_SARVAM_API_KEY;

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!SARVAM_API_KEY) {
    console.warn("No Sarvam API key found. Using fallback transcription.");
    return fallbackTranscription();
  }

  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "saaras:v3");

    // Replace with correct Sarvam API endpoint
    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Sarvam STT failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.transcript || data.text || fallbackTranscription();
  } catch (error: any) {
    console.error("Transcription error:", error);
    return `Error: ${error.message}`;
  }
}

export async function extractRequirements(transcript: string): Promise<AppSpec> {
  if (!SARVAM_API_KEY) {
    console.warn("No Sarvam API key found. Using fallback extraction.");
    return fallbackExtraction();
  }

  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: "sarvam-105b", // Assuming sarvam-105b or latest model
        messages: [
          { role: "system", content: SYSTEM_PROMPT_REQUIREMENTS },
          { role: "user", content: `Please generate the JSON specification for this request: "${transcript}"` }
        ],
        temperature: 0.1,
        // Require JSON response format if supported, else rely on prompt
      }),
    });

    if (!response.ok) {
      throw new Error(`Sarvam LLM failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON safely
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    const parsed = JSON.parse(jsonString);
    return AppSpecSchema.parse(parsed);
  } catch (error) {
    console.error("Extraction error:", error);
    return fallbackExtraction();
  }
}

export async function modifyRequirements(currentSpec: AppSpec, instruction: string): Promise<AppSpec> {
  if (!SARVAM_API_KEY) {
    console.warn("No Sarvam API key found. Using fallback modification.");
    return fallbackModification(currentSpec, instruction);
  }

  try {
    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        model: "sarvam-105b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT_MODIFICATION },
          { role: "user", content: `CURRENT SPECIFICATION:\n${JSON.stringify(currentSpec)}\n\nINSTRUCTION:\n${instruction}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Sarvam LLM failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    const parsed = JSON.parse(jsonString);
    return AppSpecSchema.parse(parsed);
  } catch (error) {
    console.error("Modification error:", error);
    return fallbackModification(currentSpec, instruction);
  }
}

// Fallbacks for demo mode / hackathon reliability
function fallbackTranscription() {
  return "Mujhe ek college attendance app banana hai jisme students login karein, subjects add karein, attendance percentage dikhe aur 80 percent se neeche warning aaye.";
}

function fallbackExtraction(): AppSpec {
  return {
    project: {
      name: "College Attendance",
      description: "App to track college attendance for students",
      targetUsers: ["Students"],
      problem: "Tracking attendance manually is hard",
    },
    features: [
      { name: "Authentication", description: "Students login" },
      { name: "Subject Management", description: "Add and manage subjects" },
      { name: "Attendance Tracking", description: "Track percentage" },
      { name: "Alerts", description: "Warning below 80 percent" },
    ],
    pages: [
      {
        id: "dashboard",
        name: "Dashboard",
        purpose: "Main overview of attendance",
        components: [
          { id: "c1", type: "heading", props: { text: "Your Attendance" }, dataSource: null, actions: [] },
          { id: "c2", type: "stat", props: { label: "Overall Attendance", value: "85%" }, dataSource: null, actions: [] },
          { id: "c3", type: "list", props: { items: ["Math: 91%", "Physics: 78%"] }, dataSource: null, actions: [] },
          { id: "c4", type: "alert", props: { title: "Warning", description: "Physics attendance is below 80%", variant: "destructive" }, dataSource: null, actions: [] }
        ]
      }
    ],
    entities: [
      {
        name: "Student",
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true }
        ]
      },
      {
        name: "Subject",
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true },
          { name: "attendancePercentage", type: "number", required: true }
        ]
      }
    ],
    navigation: [
      { label: "Dashboard", pageId: "dashboard" }
    ],
    theme: {
      primaryColor: "green"
    }
  };
}

function fallbackModification(spec: AppSpec, instruction: string): AppSpec {
  // Simple deterministic fallback for demo
  const newSpec = JSON.parse(JSON.stringify(spec)) as AppSpec;
  
  if (instruction.includes("graph")) {
    newSpec.pages[0].components.push({
      id: "c5",
      type: "chart",
      props: { type: "bar", title: "Monthly Attendance" },
      dataSource: null,
      actions: []
    });
    newSpec.features.push({ name: "Attendance Graph", description: "Visualize attendance" });
  } else if (instruction.includes("80")) {
    const alertComponent = newSpec.pages[0].components.find(c => c.type === "alert");
    if (alertComponent) {
      alertComponent.props.description = "Physics attendance is below 80%";
      alertComponent.props.variant = "destructive";
    }
  }
  
  return newSpec;
}
