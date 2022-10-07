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

export default function App() {
  return (
    <ErrorBoundary> <BrowserRouter> <AuthProvider>
      <MyNavbar />
      <ErrorBoundary> <Routes>
        <Route path="/login" element={<PageLogin />} />
        <Route path="/submissions" element={
          <ProtectedRoute types="admin">
            <PageSubmissions />
          </ProtectedRoute>
        }/>
        <Route path="/checkpoints" element={
          <ProtectedRoute>
            <PageCheckpoints />
          </ProtectedRoute>
        }/>
        <Route path="/changepassword" element={
          <ProtectedRoute>
            <PageChangePassword />
          </ProtectedRoute>
        }/>
      </Routes> </ErrorBoundary>
    </AuthProvider> </BrowserRouter> </ErrorBoundary>
  )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);