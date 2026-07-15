# 🚀 GrowthsStack.Dev - AI-Powered Portfolio

Welcome to the official repository of **GrowthsStack.Dev**, a next-generation portfolio powered by a custom **In-Browser RAG (Retrieval-Augmented Generation) Engine**. Built by Muhammad Talha Ansari, this project demonstrates advanced frontend architecture, zero-latency local search, and natural language processing entirely on the client side.

## 🧠 The AI Architecture: Deep Text Omni-Parser
Unlike standard static portfolios, this application features a bespoke JavaScript-based AI agent that reads from a **25-Node Modular Knowledge Graph**. 

### Key Features:
* **Zero-Latency Local RAG:** The knowledge base is fetched in parallel via `Promise.all` and cached in the browser, eliminating server costs and database latency.
* **Fuzzy Matching & Typo Tolerance:** Implements an advanced padded-string and substring scoring algorithm to handle user typos (e.g., matching "chatbor" to "chatbot").
* **Roman Urdu & Multilingual Support:** Seamlessly parses global `variations` from the JSON nodes, allowing the AI to understand localized queries like *"katna time lagta hai"*.
* **Deep Text Omni-Parser:** Automatically flattens and extracts contextual strings from complex nested JSON arrays (`faqs`, `knowledge`, `variations`) into a unified vector-like array.
* **Strict Guardrails:** Built-in exact-boundary word matching prevents false positives and substring collisions.

## 📂 Modular Data Structure
The AI's brain is highly maintainable, split across 25 specific JSON modules inside the `/json` directory. Updating pricing, services, or FAQs simply requires editing a single JSON file without touching the core engine.

## 💻 Tech Stack
* **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Data Layer:** Parallel-loaded JSON Knowledge Graph
* **Deployment:** GitHub Pages / Vercel Ready

## 🚀 How to Run Locally
Due to strict browser CORS policies regarding local JSON fetching, you must run this project on a local server.

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/growthsstack-ai-portfolio.git](https://github.com/yourusername/growthsstack-ai-portfolio.git)
   ```

## 👨‍💻 About the Developer
Muhammad Talha Ansari is a 22-year-old AI Full Stack Engineer based in Faisalabad, Pakistan. Specializing in Python, FastAPI, Next.js, and autonomous AI agents, Talha builds intelligent software solutions that scale.

Built with logic, structured with data, and designed for the future.
