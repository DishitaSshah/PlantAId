import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { analyzeLeafDisease } from '../api/plantApi';
import type { DiseaseAnalysisResult } from '../types/plant';

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files[0]);
    }
  };

  const handleFiles = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const result = await analyzeLeafDisease(file);
      setResult(result);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6" id="detect">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
          ${preview ? 'bg-gray-50' : 'bg-white'}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!preview ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-900">Upload a leaf image for analysis</p>
            <p className="mt-2 text-sm text-gray-500">Drag and drop or click to select</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Select Image
            </button>
          </>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg" />
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Loader className="animate-spin h-5 w-5" />
                <span>Analyzing image...</span>
              </div>
            ) : result ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                <div className="space-y-3">
                  <p className="text-lg">
                    <span className="font-medium">Detected Disease:</span>{' '}
                    <span className="text-red-600">{result.disease}</span>
                  </p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommended Treatment:</h4>
                    <p className="text-gray-700">{result.treatment}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}