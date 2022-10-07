import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import PageCheckpoints from './pageCheckpoints';
import PageSubmissions from './pageSubmissions';
import PageLogin from './pageLogin';
import PageChangePassword from './pageChangePassword';
import MyNavbar from './CityhuntNavbar';
import { AuthProvider, ProtectedRoute } from './AuthProvider';

// Import constants for debug purposes
import { taskList, submissions } from './debug';

// const taskList = require("./TaskList.json");

// In production, the task list will be read from the json.
// Refer to the TaskList_example.json for formats.
// Note that the name of a point can be describing its content or position.

export default function App() {
  return (
    <BrowserRouter> <AuthProvider>
      <MyNavbar />
      <ErrorBoundary> <Routes>
        <Route path="/login" element={<PageLogin />} />
        <Route path="/submissions" element={
          <ProtectedRoute types="admin">
            <PageSubmissions list={taskList} subs={submissions} />
          </ProtectedRoute>
        }/>
        <Route path="/checkpoints" element={
          <ProtectedRoute>
            <PageCheckpoints list={taskList} />
          </ProtectedRoute>
        }/>
        <Route path="/changepassword" element={
          <ProtectedRoute>
            <PageChangePassword />
          </ProtectedRoute>
        }/>
      </Routes> </ErrorBoundary>
    </AuthProvider> </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);