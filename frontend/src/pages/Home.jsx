import { useState, useEffect } from "react";
// import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    // Mock data
    const mockData = [
      { id: 1, title: "Note 1", content: "Content of note 1" },
      { id: 2, title: "Note 2", content: "Content of note 2" },
      { id: 3, title: "Note 3", content: "Content of note 3" },
    ];
    setNotes(mockData);
    console.log(mockData); // Debugging: Log the mock data
  };

  const deleteNote = (id) => {
    // Mock delete functionality
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    alert("Note deleted!");
  };

  const createNote = (e) => {
    e.preventDefault();
    // Mock create functionality
    const newNote = { id: notes.length + 1, title, content };
    setNotes([...notes, newNote]);
    alert("Note created!");
    setTitle("");
    setContent("");
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.length === 0 ? (
          <p>No notes available</p>
        ) : (
          notes.map((note) => (
            <Note note={note} onDelete={deleteNote} key={note.id} />
          ))
        )}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
}

export default Home;
