// src/components/UploadPage.jsx

import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiFileText, FiX } from 'react-icons/fi';

// Helper function to format file size
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const UPLOAD_API_URL = "https://fakeapk.onrender.com/upload";
const RESULT_API_URL = "https://fakeapk.onrender.com/result/";

const UploadPage = ({ onLogout }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('initial'); // 'initial', 'uploading', 'checking', 'complete', 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);

  // --- Event Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.apk')) {
      setFile(files[0]);
    } else {
      alert("Please drop an .apk file.");
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFile(files[0]);
      setAnalysisResult(null); // Reset analysis result when a new file is selected
      setUploadStatus('initial');
      setUploadProgress(0);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setAnalysisResult(null);
    setUploadStatus('initial');
    setUploadProgress(0);
    clearInterval(intervalRef.current);
  };
  
  const handleAnalyze = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setUploadProgress(0);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('apk', file); // 'apk' is the field name for the file

    try {
      // Step 1: Upload the APK
      const uploadResponse = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
        // The browser automatically sets the correct 'Content-Type' header for FormData
        // We can add a progress event listener but the fetch API doesn't support it directly.
        // A common workaround is to use XMLHttpRequest for progress tracking.
        // For simplicity here, we'll simulate progress.
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload APK.');
      }

      const { jobid } = await uploadResponse.json();
      setUploadStatus('checking');
      setUploadProgress(100); // Upload step is complete, progress is 100%

      // Step 2: Poll for the result
      intervalRef.current = setInterval(async () => {
        try {
          const resultResponse = await fetch(`${RESULT_API_URL}${jobid}`);
          if (!resultResponse.ok) {
            throw new Error('Failed to fetch analysis result.');
          }
          const data = await resultResponse.json();
          
          if (data.status === 'complete') {
            clearInterval(intervalRef.current);
            setUploadStatus('complete');
            setAnalysisResult(data.result.app); // Extract the desired 'app' data
          }
        } catch (error) {
          console.error("Error during polling:", error);
          clearInterval(intervalRef.current);
          setUploadStatus('error');
        }
      }, 2000); // Poll every 2 seconds
      
    } catch (error) {
      console.error("Analysis failed:", error);
      setUploadStatus('error');
    }
  };

  const renderContent = () => {
    if (uploadStatus === 'complete' && analysisResult) {
      // --- ANALYSIS COMPLETE STATE ---
      return (
        <div className="text-left animate-fade-in">
          <h2 className="text-3xl font-bold text-green-600 mb-4">APK Uploaded Successfully! ✅</h2>
          <p className="text-gray-500 mb-6">Here is the analysis data for your application.</p>
          <div className="bg-gray-100 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">App Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {analysisResult.name}</p>
              <p><strong>Package:</strong> {analysisResult.package}</p>
              <p><strong>Version:</strong> {analysisResult.version_name} ({analysisResult.version_code})</p>
              <p className="break-all"><strong>SHA256:</strong> {analysisResult.apk_sha256}</p>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Upload Another APK
            </button>
          </div>
        </div>
      );
    }

    if (uploadStatus === 'uploading' || uploadStatus === 'checking') {
      // --- UPLOADING/CHECKING STATE ---
      return (
        <div className="animate-pulse">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Analyzing...'}
          </h2>
          <p className="text-gray-500 mb-8">
            Please wait while we process your file.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{uploadStatus === 'uploading' ? 'Uploading file...' : 'Checking analysis status...'}</p>
        </div>
      );
    }
    
    // --- INITIAL/FILE SELECTED STATE ---
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Analyze Application</h2>
        <p className="text-gray-500 mb-8">Upload your Android application package to check its identity.</p>
        
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
          >
            <FiUploadCloud className="mx-auto text-5xl text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">
              Drag & Drop your APK here or{' '}
              <button onClick={handleBrowseClick} className="font-semibold text-blue-600 hover:underline">
                browse
              </button>
            </p>
            <p className="text-sm text-gray-400 mt-2">Only .apk files up to 50 MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".apk"
              className="hidden"
            />
          </div>
        ) : (
          <>
            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-left">
                <FiFileText className="text-3xl text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-800 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button onClick={handleRemoveFile} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-8">
              <button
                onClick={handleAnalyze}
                className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
              >
                Analyze APK
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="inline-block bg-gray-800 text-white text-xl font-bold p-3 rounded-lg shadow-md">A</div>
          <h1 className="text-xl font-bold text-gray-800">APKSure</h1>
        </div>
        <div>
          <span className="text-gray-600 mr-4 hidden sm:inline">Welcome, User!</span>
          <button 
            onClick={onLogout}
            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UploadPage;