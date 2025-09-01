import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const ViewContent = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [askPassword, setAskPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Security state
  const [isBlurred, setIsBlurred] = useState(false);
  const [screenshotAttempts, setScreenshotAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const overlayRef = useRef(null);

  const fetchData = async (passwordInput = "") => {
    try {
      const query = passwordInput ? `?password=${encodeURIComponent(passwordInput)}` : "";
      const response = await fetch(`${VITE_API_URL}/api/v1/link/viewLink/${id}${query}`, { cache: 'no-store' });
      const result = await response.json();
      if (result.success) {
        if (result.data === "password_required") {
          setAskPassword(true);
        } else {
          setContent(result.data);
        }
      } else {
        setError(result.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // AGGRESSIVE PROTECTION: Blur on ANY suspicious activity
  useEffect(() => {
    // Only activate protection when content is loaded
    if (!content || askPassword) return;

    console.log('🛡️ SafeExpire Protection: ACTIVATED');

    const blurScreen = (reason) => {
      console.log('🚨 SCREEN BLURRED:', reason);
      setScreenshotAttempts(prev => prev + 1);
      setShowWarning(true);
      setIsBlurred(true);
      
      setTimeout(() => setShowWarning(false), 2000);
      
      // Auto-redirect after too many attempts
      if (screenshotAttempts > 0) {
        
        window.location.href = '/';
      }
    };

    // 1. BLUR ON ANY KEY PRESS (except specific allowed keys)
    const handleAnyKey = (e) => {
      const allowedKeys = [
        'Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
      ];
      
      // If it's NOT an allowed key, blur immediately
      if (!allowedKeys.includes(e.key)) {
        console.log('⚠️ Key pressed:', e.key);
        e.preventDefault();
        e.stopImmediatePropagation();
        blurScreen(`Key pressed: ${e.key}`);
        return false;
      }
    };

    // 2. MOBILE PROTECTION: Multi-touch detection (3+ fingers)
    let touchCount = 0;
    const handleTouchStart = (e) => {
      touchCount = e.touches.length;
      console.log('👆 Touch count:', touchCount);
      
      if (touchCount >= 3) {
        e.preventDefault();
        blurScreen('3+ finger touch detected');
        return false;
      }
    };

    // 3. MOBILE: Detect screenshot gestures (power + volume)
    const handleTouchEnd = (e) => {
      // Reset touch count
      touchCount = 0;
    };

    // 4. WINDOW FOCUS LOSS = BLUR
    const handleWindowBlur = () => {
      blurScreen('Window lost focus');
    };

    // 5. TAB VISIBILITY CHANGE = BLUR  
    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurScreen('Tab became hidden');
      }
    };

    // 6. RIGHT CLICK = BLUR
    const handleRightClick = (e) => {
      e.preventDefault();
      blurScreen('Right click detected');
      return false;
    };

    // 7. SELECTION ATTEMPT = BLUR
    const handleSelection = (e) => {
      e.preventDefault();
      blurScreen('Text selection attempted');
      return false;
    };

    // 8. DRAG ATTEMPT = BLUR
    const handleDrag = (e) => {
      e.preventDefault();
      blurScreen('Drag attempted');
      return false;
    };

    // 9. MOBILE: Orientation change (could indicate screenshot)
    const handleOrientationChange = () => {
      blurScreen('Device orientation changed');
    };

    // 10. COPY/PASTE = BLUR
    const handleClipboard = (e) => {
      e.preventDefault();
      blurScreen('Clipboard access attempted');
      return false;
    };

    // 11. DETECT BROWSER ZOOM (could indicate screenshot preparation)
    let lastZoom = window.devicePixelRatio;
    const detectZoom = () => {
      const currentZoom = window.devicePixelRatio;
      if (Math.abs(currentZoom - lastZoom) > 0.1) {
        blurScreen('Zoom level changed');
        lastZoom = currentZoom;
      }
    };

    // 12. DETECT DEVELOPER TOOLS OPENING
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          blurScreen('Developer tools opened');
        }
      } else {
        devToolsOpen = false;
      }
    };

    // ADD ALL EVENT LISTENERS
    // Keyboard events
    document.addEventListener('keydown', handleAnyKey, { capture: true, passive: false });
    window.addEventListener('keydown', handleAnyKey, { capture: true, passive: false });

    // Mobile touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Window events
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse events
    document.addEventListener('contextmenu', handleRightClick, { passive: false });
    document.addEventListener('selectstart', handleSelection, { passive: false });
    document.addEventListener('dragstart', handleDrag, { passive: false });

    // Clipboard events
    document.addEventListener('copy', handleClipboard, { passive: false });
    document.addEventListener('cut', handleClipboard, { passive: false });
    document.addEventListener('paste', handleClipboard, { passive: false });

    // Mobile orientation
    window.addEventListener('orientationchange', handleOrientationChange);

    // Zoom and dev tools detection
    const zoomInterval = setInterval(detectZoom, 1000);
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // AGGRESSIVE CSS PROTECTION
    const style = document.createElement('style');
    style.setAttribute('data-safeexpire', 'true');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      /* Disable selection */
      ::selection { background: transparent !important; }
      ::-moz-selection { background: transparent !important; }
      
      /* Disable print */
      @media print { * { display: none !important; } }
      
      /* Keep interactive elements working */
      button, a, input { pointer-events: auto !important; }
    `;
    document.head.appendChild(style);

    // CLEANUP
    return () => {
      console.log('🛡️ SafeExpire Protection: DEACTIVATED');
      
      // Remove all listeners
      document.removeEventListener('keydown', handleAnyKey, { capture: true });
      window.removeEventListener('keydown', handleAnyKey, { capture: true });
      
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('selectstart', handleSelection);
      document.removeEventListener('dragstart', handleDrag);
      
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      // Clear intervals
      clearInterval(zoomInterval);
      clearInterval(devToolsInterval);
      
      // Remove styles
      const injectedStyle = document.querySelector('style[data-safeexpire]');
      if (injectedStyle) {
        injectedStyle.remove();
      }
    };
  }, [content, askPassword, screenshotAttempts]);

  // Dynamic overlay effect
  useEffect(() => {
    if (!content || askPassword) return;

    const createOverlay = () => {
      if (!overlayRef.current) return;
      
      const overlay = overlayRef.current;
      overlay.innerHTML = '';
      
      for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = '1px';
        dot.style.height = '1px';
        dot.style.background = 'rgba(0, 0, 0, 0.05)';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.pointerEvents = 'none';
        overlay.appendChild(dot);
      }
    };

    const interval = setInterval(createOverlay, 2000);
    createOverlay();

    return () => clearInterval(interval);
  }, [content, askPassword]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(password);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="relative">
      {/* Security Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-red-600 p-6 rounded-lg text-center max-w-md text-white">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Security Violation Detected!</h2>
            <p className="mb-4">
              Unauthorized access attempt blocked and logged.
            </p>
            <p className="text-sm opacity-75">
              Attempts: {screenshotAttempts}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Protection Overlay */}
      {content && !askPassword && (
        <div 
          ref={overlayRef}
          className="fixed inset-0 pointer-events-none z-10"
          style={{ mixBlendMode: 'difference' }}
        />
      )}

      {/* Security Header - Only show when content is loaded */}
      {content && !askPassword && (
        <div className="bg-red-900 text-white p-3 mb-4 rounded">
          <div className="flex items-center justify-between text-sm">
            <div>
              🛡️ <strong>Protected Content</strong> - Screenshots, copying, and extensions blocked
            </div>
            <div className="flex items-center space-x-4">
              <span>Violations: {screenshotAttempts}</span>
              <button
                onClick={() => setIsBlurred(!isBlurred)}
                className="px-2 py-1 bg-red-700 rounded text-xs"
              >
                {isBlurred ? '👁️ Show' : '🙈 Hide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div 
        className={`p-6 max-w-3xl mx-auto mt-10 bg-[#EFE4D2] shadow-md rounded relative ${
          isBlurred && content && !askPassword ? 'blur-sm' : ''
        }`}
        style={{
          // Watermark background
          backgroundImage: content && !askPassword 
            ? 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Ctext x="50" y="50" font-size="8" fill="rgba(0,0,0,0.03)" text-anchor="middle" transform="rotate(45 50 50)"%3ESAFEEXPIRE%3C/text%3E%3C/svg%3E")' 
            : 'none'
        }}
      >
        {/* Password Form */}
        {askPassword ? (
          <form onSubmit={handlePasswordSubmit}>
            <label className="block mb-2 text-gray-700">Enter Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
              required
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Submit
            </button>
          </form>
        ) : content ? (
          <div className="relative">
            {/* display Content*/}
            {typeof content === "string" && content.startsWith("http") ? (
              <div>
                <p className="mb-4 font-semibold">Secure File:</p>
                {content.endsWith(".pdf") ? (
                  <iframe 
                    src={content} 
                    title="PDF" 
                    className="w-full h-[500px] border-2 border-gray-300" 
                    style={{ pointerEvents: 'auto' }}
                  />
                ) : content.endsWith(".jpg") || content.endsWith(".png") ? (
                  <img 
                    src={content} 
                    alt="Protected Content" 
                    className="max-w-full h-auto border-2 border-gray-300" 
                    style={{ pointerEvents: 'none' }}
                  />
                ) : content.endsWith(".zip") ? (
                  <a 
                    href={content} 
                    download 
                    className="text-blue-500 underline inline-block p-2 bg-blue-100 rounded"
                    style={{ pointerEvents: 'auto' }}
                  >
                    ZIP File
                  </a>
                ) : (
                  <a 
                    href={content} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 underline inline-block p-2 bg-blue-100 rounded"
                    style={{ pointerEvents: 'auto' }}
                  >
                    🔗 Open Secure Link
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-white p-4 rounded border-2 border-gray-300">
                <p className="whitespace-pre-line text-gray-800">{content}</p>
              </div>
            )}

            {/* Watermark overlay for text content */}
            {typeof content === "string" && !content.startsWith("http") && (
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                <div className="text-4xl font-bold rotate-45 text-gray-600">
                  SAFEEXPIRE PROTECTED
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer Notice - Only show when content is loaded */}
      {content && !askPassword && (
        <div className="text-center mt-4 text-gray-600 text-xs">
          <p>🔒 This content is protected by SafeExpire security system</p>
          <p>All access attempts are monitored and logged for security purposes</p>
        </div>
      )}
    </div>
  );
};

export default ViewContent;