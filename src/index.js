import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageCheckpoints from './pageCheckpoints';
import PageSubmissions from './pageSubmissions';

// Import constants for debug purposes
import { taskList, submissions } from './debug';

// const taskList = require("./TaskList.json");

// In production, the task list will be read from the json.
// Refer to the TaskList_example.json for formats.
// Note that the name of a point can be describing its content or position.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/submissions" element={<PageSubmissions list={taskList} subs={submissions}/>} />
        <Route path="/checkpoints" element={<PageCheckpoints list={taskList}/>} />
      </Routes>
    </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);