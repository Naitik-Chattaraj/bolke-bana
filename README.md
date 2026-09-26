# Bolke Bana

> **Build software. Just say what you need.**

Bolke Bana is a multilingual, voice-first software builder powered by **Sarvam AI**.

Instead of writing code or navigating complex development tools, users simply describe what they want to build in their own language — and Bolke Bana turns their words into a working application prototype.

---

## 🚀 The Idea

Building software usually requires knowing programming languages, frameworks, UI components, APIs, and technical architecture.

**Bolke Bana removes that barrier.**

A user can simply say:

> "Mujhe ek college attendance app banana hai jisme students ka attendance percentage dikhe, subjects ke cards ho aur 80% se neeche attendance ho toh warning aaye."

Bolke Bana understands the request, structures the requirements, and generates a functional interface.

The user can then continue:

> "Monthly attendance ka graph bhi add karo."

And the application updates itself.

### Core Loop

```text
🎙️ Speak
   ↓
🗣️ Saaras
   ↓
🧠 Sarvam LLM
   ↓
📋 Structured App Specification
   ↓
✅ Zod Validation
   ↓
⚛️ React Renderer
   ↓
🖥️ Live Application
   ↓
🎙️ "Change this..."
   ↓
🔄 Updated Application
```

---

## ✨ Features

### 🎙️ Voice-First Development

Describe an application naturally instead of writing code.

### 🇮🇳 Indian Language Support

Users can communicate using Indian languages and code-mixed speech.

### 🧠 AI Requirement Understanding

Sarvam's language models convert natural-language requirements into a structured application specification describing:

- Pages
- Features
- Components
- Navigation
- Forms
- Data
- Actions
- Theme
- Application structure

### ⚡ Live Application Generation

The structured specification is rendered into a functional React interface.

```text
Natural Language
       ↓
Application JSON
       ↓
React Renderer
       ↓
Live UI
```

### 🔄 Conversational Editing

Users can modify their application without starting over.

> "Add a monthly attendance graph."

> "Change the warning threshold to 80%."

### ↩️ Version History

Application versions can be stored so users can:

- Undo changes
- Restore previous versions
- Compare iterations
- Continue from an earlier state

### 🗺️ Application Blueprint

Users can see what the AI understood before and while the application is being generated.

**What the user said → What the AI understood → What was built**

---

# 🏗️ Architecture

```text
                        ┌──────────────────┐
                        │      User        │
                        │  Voice / Text    │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │    Next.js UI    │
                        │     Builder      │
                        └────────┬─────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │    Next.js Backend    │
                     │     API Routes        │
                     └───────────┬───────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               │                 │                 │
               ▼                 ▼                 ▼
        ┌────────────┐    ┌────────────┐    ┌────────────┐
        │   Saaras   │    │ Sarvam LLM │    │   Bulbul   │
        │ Speech →   │    │ Requirement│    │ Text →     │
        │    Text    │    │ Processing │    │   Speech   │
        └────────────┘    └─────┬──────┘    └────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ App Specification│
                       │      JSON       │
                       └────────┬────────┘
                                │
                                ▼
                         ┌────────────┐
                         │    Zod     │
                         │ Validation │
                         └─────┬──────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │  React Renderer  │
                      │ Controlled UI    │
                      └────────┬─────────┘
                               │
                               ▼
                       🖥️ Live Prototype
                               │
                               ▼
                         ┌────────────┐
                         │  Supabase  │
                         │  Versions  │
                         │  Projects  │
                         └────────────┘
```

---

# 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui / Custom Components |
| Voice Input | Browser MediaRecorder / Web Audio |
| Speech Recognition | Sarvam Saaras |
| LLM | Sarvam Language Model |
| Text-to-Speech | Sarvam Bulbul |
| Validation | Zod |
| Database | Supabase / PostgreSQL |
| Backend | Next.js Route Handlers |
| Deployment | Vercel |

---

# 🛡️ Controlled Application Generation

Bolke Bana does **not** simply ask an LLM to generate and execute arbitrary JavaScript.

Instead:

```text
User Request
     ↓
Sarvam LLM
     ↓
Structured JSON
     ↓
Zod Validation
     ↓
Controlled Components
     ↓
React Renderer
```

The renderer supports a controlled component vocabulary such as:

```text
Heading
Paragraph
Button
Input
Textarea
Select
Checkbox
Card
Table
Badge
Alert
Modal
Tabs
Navbar
Sidebar
List
Avatar
Chart
Stat
Form
Dashboard
```

This makes generated applications more predictable and easier to modify.

---

# 📁 Project Structure

```text
bolke-bana/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── speech/
│   │   │   ├── generate/
│   │   │   ├── update/
│   │   │   ├── speak/
│   │   │   └── projects/
│   │   │
│   │   ├── builder/
│   │   └── project/
│   │
│   ├── components/
│   │
│   ├── lib/
│   │   ├── sarvam/
│   │   │   ├── client.ts
│   │   │   ├── speech.ts
│   │   │   ├── llm.ts
│   │   │   └── tts.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── prompts.ts
│   │   │   ├── extractor.ts
│   │   │   └── updater.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── project.ts
│   │   │
│   │   ├── renderer/
│   │   │
│   │   └── db/
│   │
│   └── types/
│
├── public/
├── .env.local
├── package.json
└── README.md
```

---

# 🔌 API Flow

## `POST /api/speech`

```text
Audio
 ↓
Saaras
 ↓
Transcript + Language
```

## `POST /api/generate`

```text
Transcript
 ↓
Sarvam LLM
 ↓
Structured JSON
 ↓
Zod
 ↓
Application Specification
```

## `POST /api/update`

```text
Current Specification
        +
New User Instruction
        ↓
    Sarvam LLM
        ↓
Updated Specification
```

This enables conversational editing.

## `POST /api/speak`

```text
Response Text
     ↓
   Bulbul
     ↓
Audio
```

---

# 🔐 Environment Variables

Create a `.env.local` file:

```env
SARVAM_API_KEY=your_sarvam_api_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Never expose `SARVAM_API_KEY` to the browser.**

All Sarvam requests should go through the server.

---

# 🗄️ Data Model

## Projects

```text
projects
├── id
├── name
├── description
├── created_at
└── updated_at
```

## Project Versions

```text
project_versions
├── id
├── project_id
├── version_number
├── specification_json
├── change_description
└── created_at
```

## Conversations

```text
conversations
├── id
├── project_id
├── role
├── content
├── language
└── created_at
```

---

# 🎬 Example

### Step 1 — User speaks

> "Mujhe ek college attendance dashboard banana hai."

### Step 2 — Bolke Bana understands

```json
{
  "name": "College Attendance",
  "pages": [
    {
      "name": "Dashboard",
      "components": [
        "stats",
        "subject-list",
        "attendance-chart"
      ]
    }
  ]
}
```

### Step 3 — Application appears

The React renderer turns the specification into a working dashboard.

### Step 4 — User continues

> "Jiska attendance 80 percent se kam hai usko warning dikhao."

### Step 5 — Application updates

No prompt engineering.

No code editing.

No regeneration from scratch.

**Speak → Modify → See.**

---

# 🎯 Hackathon Demo

Recommended demo flow:

```text
1. Open Bolke Bana
        ↓
2. Start voice input
        ↓
3. Speak a Hinglish application request
        ↓
4. Saaras transcribes it
        ↓
5. Sarvam understands the requirements
        ↓
6. Blueprint is generated
        ↓
7. Live application appears
        ↓
8. Say "Add a monthly graph"
        ↓
9. Application updates
        ↓
10. Change another requirement
        ↓
11. Demonstrate another Indian language
```

The important part is not simply showing AI-generated UI.

The important part is demonstrating:

> **A person can create and modify software through natural speech.**

---

# 🌏 Why Sarvam?

Bolke Bana is designed around capabilities particularly relevant to India's multilingual environment.

```text
Indian-language speech
        ↓
      Saaras
        ↓
Language understanding
        ↓
    Sarvam LLM
        ↓
Application generation
        ↓
      Bulbul
        ↓
Spoken feedback
```

This makes the experience less like a conventional English-first AI coding tool and more like **software creation through natural Indian-language conversation**.

---

# 🔮 Future Possibilities

- 📱 Export generated applications to mobile
- 💻 Export production-ready code
- 🌐 Support more Indian languages
- 🎙️ Continuous voice conversations
- 👥 Collaborative app building
- 🔗 API/integration generation
- 🗃️ AI-generated database schemas
- 🔐 Authentication generation
- 📊 Real backend/data connections
- 🧪 Automated testing of generated applications
- 🗣️ Voice-based debugging
- 🧑‍💻 Developer handoff mode

---

# 🧠 Philosophy

Bolke Bana isn't trying to make everyone a programmer.

It's trying to make the **distance between an idea and a working piece of software dramatically smaller.**

Instead of:

```text
Idea
 ↓
Learn programming
 ↓
Learn framework
 ↓
Write code
 ↓
Debug
 ↓
Deploy
```

Bolke Bana aims for:

```text
Idea
 ↓
🗣️ Say it
 ↓
🤖 Build it
 ↓
🔄 Refine it
```

---

## Built with ❤️ and a lot of talking

# **Bolke Bana**

### *Aap bolo. Software banega.*
