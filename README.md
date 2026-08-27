# 📄 PaperReader-RAG

### AI-Powered Document Intelligence using Retrieval-Augmented Generation

**PaperReader-RAG** is a full-stack Generative AI application that allows users to upload PDF documents and interact with them using natural language.

Instead of manually searching through lengthy documents, users can simply ask questions and receive context-aware answers based on the content of their uploaded documents.

The project demonstrates how **RAG, embeddings, vector databases, and LLMs** can be combined to build a practical Generative AI application.

---

## 🌐 Live Demo

**Try PaperReader:**
https://paper-reader-rag-vgdh.vercel.app/

**GitHub:**
https://github.com/Saurabh-Singh33/PaperReader-RAG

---

## ✨ Features

* 📄 Upload PDF documents
* 💬 Chat with uploaded documents
* 🔍 Semantic search instead of traditional keyword search
* 🧠 Retrieval-Augmented Generation (RAG)
* 🤖 Google Gemini integration
* 🔢 Document embeddings
* 🗄️ Qdrant vector database
* 🔗 LangChain-based AI orchestration
* 🔐 Clerk authentication
* ⚡ Full-stack React + Node.js architecture
* ☁️ Production deployment with Vercel and Render

---

# 🧠 How PaperReader Works

PaperReader follows a complete **Retrieval-Augmented Generation pipeline**.

```text
                PDF DOCUMENT
                     │
                     ▼
             ┌───────────────┐
             │ Text Extraction│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │    Chunking   │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │   Embeddings  │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │    Qdrant     │
             │ Vector Database│
             └───────────────┘


             USER QUESTION
                     │
                     ▼
             ┌───────────────┐
             │Question Vector│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │Semantic Search│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │Relevant Chunks│
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ Gemini LLM    │
             └───────┬───────┘
                     │
                     ▼
                AI RESPONSE
```

### 🔄 Simplified Pipeline

```text
PDF
 ↓
Text Extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
Qdrant
 ↓
User Question
 ↓
Semantic Retrieval
 ↓
Relevant Context
 ↓
Gemini
 ↓
Generated Answer
```

---

# 🏗️ Architecture

PaperReader consists of three major layers:

### 1. Frontend

The React frontend provides:

* User authentication
* PDF upload interface
* Document interaction
* Chat interface
* API communication

### 2. Backend

The Node.js + Express backend handles:

* API requests
* Document processing
* RAG workflow
* Vector database communication
* Gemini integration
* Authentication verification

### 3. AI / Data Layer

The AI layer contains:

* Document embeddings
* Qdrant vector storage
* Semantic retrieval
* Gemini LLM
* LangChain orchestration

---

# 🛠️ Tech Stack

| Category            | Technology        |
| ------------------- | ----------------- |
| Frontend            | React.js          |
| Backend             | Node.js           |
| API                 | Express.js        |
| AI Framework        | LangChain         |
| LLM                 | Google Gemini     |
| Embeddings          | Gemini Embeddings |
| Vector Database     | Qdrant            |
| Authentication      | Clerk             |
| Frontend Deployment | Vercel            |
| Backend Deployment  | Render            |
| Language            | JavaScript        |

---

# 📁 Project Structure

```text
PaperReader-RAG/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> The structure may vary depending on the current implementation.

---

# 🚀 Getting Started

Follow these steps to run PaperReader locally.

## Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* Git
* A Google Gemini API key
* A Qdrant instance
* A Clerk application

---

## 1. Clone the Repository

```bash
git clone https://github.com/Saurabh-Singh33/PaperReader-RAG.git

cd PaperReader-RAG
```

---

# 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

Open another terminal:

```bash
cd backend
npm install
```

---

# 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

GEMINI_API_KEY=your_gemini_api_key

QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key

CLERK_SECRET_KEY=your_clerk_secret_key
```

For the frontend, configure your Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### ⚠️ Important

Never commit API keys or secrets to GitHub.

Make sure your `.gitignore` contains:

```text
.env
.env.local
node_modules/
```

---

# 4. Start the Backend

```bash
cd backend
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

---

# 5. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser and start interacting with your documents.

---

# 🔐 Authentication

PaperReader uses **Clerk** for user authentication.

The authentication layer protects application functionality and allows the application to identify authenticated users.

---

# 🔎 Retrieval-Augmented Generation

The core of PaperReader is the **RAG architecture**.

Traditional LLM applications generally work like:

```text
User Question
      ↓
     LLM
      ↓
   Response
```

PaperReader uses:

```text
User Question
      ↓
Create Query Embedding
      ↓
Search Qdrant
      ↓
Retrieve Relevant Document Chunks
      ↓
Combine Question + Context
      ↓
Gemini
      ↓
Context-Aware Response
```

This allows the application to provide answers grounded in the uploaded document rather than relying only on the model's general knowledge.

---

# 🧩 Why Vector Search?

Keyword search looks for exact words.

Semantic search attempts to find content based on **meaning**.

For example, a user might ask:

```text
"What are the main causes of climate change?"
```

Even if the document does not contain that exact sentence, vector search can retrieve relevant passages discussing:

```text
greenhouse gases
fossil fuels
carbon emissions
global warming
```

This makes semantic retrieval particularly useful for document-based question answering.

---

# 🗄️ Qdrant

Qdrant acts as the vector database.

The document processing pipeline converts text chunks into embeddings and stores them in Qdrant.

When the user asks a question:

```text
Question
   ↓
Embedding
   ↓
Qdrant Similarity Search
   ↓
Top Relevant Chunks
```

The retrieved chunks are then passed to Gemini as context.

---

# 🤖 Gemini

Google Gemini is responsible for generating the final natural-language response.

The application provides Gemini with:

```text
Retrieved Context
+
User Question
```

Gemini then generates an answer based on the available context.

---

# 🔗 LangChain

LangChain helps connect and orchestrate different components of the AI pipeline.

It can be used to manage workflows involving:

* Document processing
* Text splitting
* Embeddings
* Vector stores
* Retrieval
* LLM interaction

---

# ☁️ Deployment

PaperReader is deployed using separate frontend and backend services.

```text
                 INTERNET
                    │
                    ▼
              ┌───────────┐
              │  Vercel   │
              │  React UI │
              └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │  Render   │
              │ Node/Express
              └─────┬─────┘
                    │
             ┌──────┴───────┐
             │              │
             ▼              ▼
        ┌─────────┐    ┌─────────┐
        │ Gemini  │    │ Qdrant  │
        └─────────┘    └─────────┘
```

### Deployment Stack

* **Frontend:** Vercel
* **Backend:** Render
* **Vector Database:** Qdrant
* **LLM:** Gemini

---

# 🎯 Use Cases

PaperReader can be useful for:

* 📚 Research papers
* 📖 Study materials
* 📑 Technical documentation
* 📝 Reports
* 📊 Business documents
* 🎓 Academic papers
* 📄 Long PDF documents

Instead of manually reading through hundreds of pages, users can ask questions directly about the document.

---

# 🔮 Future Improvements

Planned or possible improvements include:

* [ ] Support for DOCX and TXT files
* [ ] Multiple document collections
* [ ] Conversation history
* [ ] Source citations for answers
* [ ] Page-level references
* [ ] Streaming AI responses
* [ ] Voice-based document interaction
* [ ] Multi-language support
* [ ] Improved retrieval and reranking
* [ ] Document summarization
* [ ] Document comparison

---

# 📚 Key Concepts Demonstrated

This project provides practical experience with:

* Generative AI
* Retrieval-Augmented Generation
* Large Language Models
* Vector databases
* Semantic search
* Embeddings
* Document processing
* LangChain
* REST APIs
* Authentication
* Full-stack development
* Cloud deployment

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### Fork the repository

```bash
git fork
```

Or fork the repository directly from GitHub.

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Make your changes

```bash
git add .
git commit -m "Add: your feature"
```

### Push your branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# ⭐ Support the Project

If you find PaperReader useful or interesting, consider giving the repository a ⭐ on GitHub.

It helps support the project and encourages further development.

---

# 👨‍💻 Author

### Saurabh Singh Rathore

Computer Science Engineering Student & Developer

**GitHub:**
https://github.com/Saurabh-Singh33

---

## 📄 PaperReader-RAG

> **Upload a document. Ask a question. Let AI find the answer.**

Built with:

**React.js • Node.js • Express.js • LangChain • Gemini • Qdrant • RAG • Clerk**
