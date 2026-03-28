# Pear Media AI Prototype

A responsive React application that implements two AI workflows:

- **Creative Studio (Text Workflow):** Enhance a user prompt with NLP, allow approval, and generate an image.
- **Style Lab (Image Workflow):** Upload an image, analyze visual style, and create variation prompts for image generation.

## Project Structure

```
pearmedia-ai-prototype/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── public/
│   └── index.html
└── src/
    ├── App.js
    ├── App.css
    ├── components/
    │   ├── Navbar.js
    │   ├── WorkflowText.js
    │   ├── WorkflowImage.js
    │   └── ImageCard.js
    └── utils/
        ├── apiHelpers.js
        └── constants.js
```

## How to Run

1. Copy `.env.example` to `.env`.
2. Add your OpenAI API key:

```bash
REACT_APP_OPENAI_KEY=your_openai_api_key_here
```

3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm start
```

## Features

- Text workflow with prompt enhancement and approval.
- Image workflow with file upload, visual analysis, and variation generation.
- Global loading state and status messaging.
- Responsive layout with a clean tech-inspired UI.

## Notes

- The app uses OpenAI for prompt enhancement, image generation, and visual analysis.
- If no `REACT_APP_OPENAI_KEY` is provided, the app shows fallback responses and placeholder outputs.
