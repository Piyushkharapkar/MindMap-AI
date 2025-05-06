
# 🧠 Mind-Mapped AI

**Mind-Mapped AI** is an **AI-powered web application** that uses the **Gemini API** to generate structured content on any given topic and presents it as an **interactive mind map** using **Cytoscape.js**. It also features editable notes, mind map customization, and export functionality. The backend is powered by **Django Rest Framework (DRF)**.

---

## 🚀 Features

* 🤖 **AI-Based Topic Expansion**
  Uses **Gemini API** to generate a deep and organized breakdown of any topic.

* 🧠 **Interactive Mind Map Visualization**
  Powered by **Cytoscape.js**, the app renders a dynamic mind map view of the content.

* ✏️ **Editable Content**
  Users can edit generated notes and adjust the mind map nodes directly.

* 💾 **Save & Reuse**
  Save modified mind maps and notes for later use.

* 📤 **Export as PNG or PDF**
  Easily export your mind map for presentations or offline study.

* 🧩 **Django Rest Framework Backend**
  Handles API integration, topic storage, and content endpoints securely and efficiently.

---

## 🖼 Example Use Case

**Topic:** *Artificial Intelligence*
**Output:**

* Subtopics like Machine Learning, Deep Learning, Ethics, etc.
* Interactive, expandable, editable mind map view
* Exportable PNG or PDF visual for use in slides or reports

---

## ⚙️ Tech Stack

### 🔧 Backend (DRF)

* Django Rest Framework
* Gemini API integration
* API endpoints for generating content, saving notes/maps

### 🎨 Frontend

* HTML, CSS, JavaScript
* Cytoscape.js for visualizing mind maps
* jsPDF + html2canvas for exporting
* Responsive UI for all screen sizes

---

## 📂 Project Structure

```
mind-mapped-ai/
├── backend/
│   ├── manage.py
│   ├── mindmap_app/
│   │   ├── views.py         # Handles Gemini API logic and note storage
│   │   ├── serializers.py
│   │   └── urls.py
│   └── settings.py          # Django and DRF settings
├── frontend/
│   ├── index.html           # Main interface
│   ├── script.js            # Handles API calls and rendering
│   └── style.css            # Styling and layout
```

---

## 💡 How It Works

1. User enters a topic (e.g., "Artificial Intelligence").
2. DRF backend sends topic to **Gemini API** and receives structured content.
3. Frontend visualizes the content as an editable **mind map**.
4. User can:

   * Edit notes
   * Adjust nodes
   * Save changes
   * Export the final result

---

## 👥 Who Is It For?

* **🎓 Students** — for structured study notes
* **🧑‍🏫 Educators** — to prepare and visualize lessons
* **💼 Professionals** — for strategy mapping and presentations
* **🧠 Visual Thinkers** — who learn better through diagrams

---

## 📦 Installation & Run

### Clone the repository

```bash
git clone https://github.com/your-username/mind-mapped-ai.git
cd mind-mapped-ai
```

### Backend (Django DRF)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

Open `frontend/index.html` in your browser.

---


