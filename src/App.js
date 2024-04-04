import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar.js";
import NoteState from "./Context/Notes/NoteState.js";
import Register from "./Component/Register.js";
import Home from "./Component/Home.js";
import Notes from "./Component/Main.js";
import OpenNote from "./Component/OpenNote.js";
import NewNote from "./Component/NewNote.js";
function App() {
  return (
    <NoteState>
      <div className="App bg-dark d-flex flex-column vh-100">
        <Router>
          <div className="header">
            <Navbar />
          </div>
          <div className="main h-100 mb-2">
            <Routes>
              <Route exact path="/" element={<Home />}>
                <Route exact path="/notes" element={<Notes />} />
                <Route exact path="/open-note" element={<OpenNote />} />
                <Route exact path="/newnote" element={<NewNote />} />
              </Route>

              <Route exact path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </div>
    </NoteState>
  );
}

export default App;
