import React from 'react';
import { Leaf, Plane as Plant, Shield } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Quick Disease Detection",
      description: "Upload a leaf photo and get instant disease diagnosis"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Protect Your Plants",
      description: "Early detection helps prevent disease spread"
    },
    {
      icon: <Plant className="h-8 w-8" />,
      title: "Expert Analysis",
      description: "Powered by advanced AI technology"
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80"
          alt="Garden background" 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-5xl font-bold mb-4">Plant Disease Detection</h1>
            <p className="text-xl mb-8">Protect your garden with AI-powered leaf disease detection</p>
            <a 
              href="#detect" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Detect Now
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="text-green-600 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Healthy Garden Gallery</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <img 
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80" 
            alt="Healthy plant 1" 
            className="rounded-lg h-64 w-full object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&q=80" 
            alt="Healthy plant 2" 
            className="rounded-lg h-64 w-full object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80" 
            alt="Healthy plant 3" 
            className="rounded-lg h-64 w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}