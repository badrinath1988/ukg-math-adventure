import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const loadingScreen = document.getElementById('loading-screen');

if (!rootElement) {
  console.error("Critical: Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Smoothly hide loading screen after React initializes
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 300);
      }
    }, 800);

  } catch (err) {
    console.error("Mounting error:", err);
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="p-8 text-center bg-white rounded-3xl shadow-xl max-w-xs mx-auto">
          <div class="text-5xl mb-4">⚠️</div>
          <p class="text-red-500 font-bold text-lg">App failed to start</p>
          <p class="text-gray-500 text-sm mt-2">${err instanceof Error ? err.message : 'Unknown loading error'}</p>
          <button onclick="window.location.reload()" class="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow-md active:scale-95 transition-transform">
            Try Again
          </button>
        </div>
      `;
    }
  }
}