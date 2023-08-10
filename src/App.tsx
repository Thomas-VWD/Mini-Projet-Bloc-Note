import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const apiUrl = "http://localhost:3000";

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const createNote = async () => {
    try {
      await axios.post(`${apiUrl}/notes`, { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const saveEditedNote = async (id: number) => {
    try {
      await axios.put(`${apiUrl}/notes/${id}`, { title, content });
      setEditingNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  return (
    <div className="App">
      <h1>Bloc-notes</h1>
      <div>
        <h2>Ajouter une note</h2>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="couscous"
        />
        <ReactQuill value={content} onChange={setContent} />
        <button onClick={createNote}>Ajouter</button>
      </div>
      <div>
        <div>
          <h2>Liste des notes</h2>
          <ul>
            {notes.map((note) => (
              <li className="lili" key={note.id}>
                {editingNoteId === note.id ? (
                  <>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <ReactQuill value={content} onChange={setContent} />
                    <button onClick={() => saveEditedNote(note.id)}>
                      Enregistrer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="note-content">
                      <strong>{note.title}</strong>
                      <p>{note.content}</p>
                    </div>
                    <br />
                    <div className="button-group">
                      <button
                        className="but1"
                        onClick={() => deleteNote(note.id)}
                      >
                        Supprimer
                      </button>
                      <button
                        className="but2"
                        onClick={() => startEditing(note)}
                      >
                        Editer
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
