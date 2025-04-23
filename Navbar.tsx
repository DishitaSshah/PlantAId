import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Home, Upload, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">PlantAId</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/detect" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <Upload className="h-5 w-5 mr-1" />
              <span>Detect Disease</span>
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-green-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}