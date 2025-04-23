import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ImageUpload } from './components/ImageUpload';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    }>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/detect" 
                element={
                  <ProtectedRoute>
                    <main className="container mx-auto py-8">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Detect Plant Disease</h2>
                        <p className="mt-2 text-gray-600">Upload a leaf image to check for diseases</p>
                      </div>
                      <ImageUpload />
                    </main>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}

export default App;