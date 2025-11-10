import React, { useEffect, useRef, useState } from "react";

export default function GreenLeafFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentTest, setCurrentTest] = useState("menu");
  const [testPhase, setTestPhase] = useState("setup"); // setup, running, complete
  const [testData, setTestData] = useState({});
  
  // Performance metrics
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [accuracy, setAccuracy] = useState("measuring...");
  const [testDuration, setTestDuration] = useState(0);
  
  const fpsHistory = useRef([]);
  const latencyHistory = useRef([]);
  const frameCount = useRef(0);
  const lastFrameTime = useRef(Date.now());
  const testStartTime = useRef(0);
  const landmarkLog = useRef([]);
  
  // Device info
  const [deviceInfo, setDeviceInfo] = useState({});
  
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Detect device and browser
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isChrome = /Chrome/.test(ua);
    
    setDeviceInfo({
      platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop',
      browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other',
      userAgent: ua,
      screen: `${window.screen.width}x${window.screen.height}`,
      pixelRatio: window.devicePixelRatio
    });
  }, []);

  const updateFPS = () => {
    const now = Date.now();
    frameCount.current++;
    
    if (now - lastFrameTime.current >= 1000) {
      const currentFps = frameCount.current;
      setFps(currentFps);
      fpsHistory.current.push(currentFps);
      
      frameCount.current = 0;
      lastFrameTime.current = now;
    }
  };

  const logLandmarks = (landmarks, type = "hand") => {
    const timestamp = Date.now() - testStartTime.current;
    const logEntry = {
      timestamp,
      type,
      fps: fps,
      landmarks: landmarks.map((lm, idx) => ({
        id: idx,
        x: parseFloat(lm.x.toFixed(4)),
        y: parseFloat(lm.y.toFixed(4)),
        z: lm.z ? parseFloat(lm.z.toFixed(4)) : 0
      }))
    };
    
    landmarkLog.current.push(logEntry);
    
    // Console log for debugging
    console.log(`[${type.toUpperCase()} DETECTION]`, {
      time: `${(timestamp / 1000).toFixed(1)}s`,
      points: landmarks.length,
      fps: fps
    });
  };

  const calculateMetrics = () => {
    const avgFps = fpsHistory.current.length > 0
      ? (fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length).toFixed(1)
      : 0;
    
    const minFps = fpsHistory.current.length > 0
      ? Math.min(...fpsHistory.current)
      : 0;
    
    const avgLatency = latencyHistory.current.length > 0
      ? (latencyHistory.current.reduce((a, b) => a + b, 0) / latencyHistory.current.length).toFixed(0)
      : 0;
    
    const smoothness = avgFps >= 28 ? 'Excellent' :
                      avgFps >= 24 ? 'Good' :
                      avgFps >= 20 ? 'Fair' : 'Poor';
    
    const responsiveness = avgLatency <= 50 ? 'Excellent' :
                          avgLatency <= 100 ? 'Good' :
                          avgLatency <= 200 ? 'Fair' : 'Poor';
    
    return {
      avgFps,
      minFps,
      avgLatency,
      smoothness,
      responsiveness,
      landmarkCount: landmarkLog.current.length,
      testDuration: ((Date.now() - testStartTime.current) / 1000).toFixed(1)
    };
  };

  const startTest = (testType) => {
    setCurrentTest(testType);
    setTestPhase("running");
    testStartTime.current = Date.now();
    fpsHistory.current = [];
    latencyHistory.current = [];
    landmarkLog.current = [];
    frameCount.current = 0;
    lastFrameTime.current = Date.now();
  };

  const finishTest = () => {
    const metrics = calculateMetrics();
    const report = {
      testType: currentTest,
      device: deviceInfo,
      metrics,
      timestamp: new Date().toISOString(),
      landmarkData: landmarkLog.current
    };
    
    setTestData(prev => ({
      ...prev,
      [currentTest]: report
    }));
    
    setTestPhase("complete");
    
    // Log full report
    console.log("=== TEST COMPLETE ===");
    console.log("Test:", currentTest);
    console.log("Metrics:", metrics);
    console.log("Landmark samples:", landmarkLog.current.length);
    console.log("====================");
  };

  const returnToMenu = () => {
    // Cleanup
    if (cameraRef.current && cameraRef.current.stop) {
      cameraRef.current.stop();
    }
    if (handsRef.current && handsRef.current.close) {
      handsRef.current.close();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setCurrentTest("menu");
    setTestPhase("setup");
  };

  const downloadReport = () => {
    const fullReport = {
      researchProject: "Vocational School WebAR Implementation",
      testDate: new Date().toISOString(),
      device: deviceInfo,
      tests: testData,
      summary: generateSummary()
    };
    
    const blob = new Blob([JSON.stringify(fullReport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webar-research-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSummary = () => {
    if (Object.keys(testData).length === 0) return null;
    
    const tests = Object.values(testData);
    const summary = {
      testsCompleted: tests.length,
      recommendations: []
    };
    
    // Compare if we have multiple tests
    if (tests.length >= 2) {
      const sorted = tests.sort((a, b) => 
        parseFloat(b.metrics.avgFps) - parseFloat(a.metrics.avgFps)
      );
      summary.bestPerformance = sorted[0].testType;
      summary.recommendations.push(
        `${sorted[0].testType} showed best performance with ${sorted[0].metrics.avgFps} avg FPS`
      );
    }
    
    return summary;
  };

  // MediaPipe Test
  useEffect(() => {
    if (currentTest !== "mediapipe" || testPhase !== "running") return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    let scriptsLoaded = false;

    const script1 = document.createElement("script");
    const script2 = document.createElement("script");
    const script3 = document.createElement("script");
    
    script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
    script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

    script1.onload = () => {
      script2.onload = () => {
        script3.onload = () => {
          if (scriptsLoaded) return;
          scriptsLoaded = true;

          const hands = new window.Hands({
            locateFile: (file) =>
              `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          hands.onResults((results) => {
            const startTime = performance.now();
            updateFPS();
            
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(
              results.image,
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );

            if (results.multiHandLandmarks) {
              for (const landmarks of results.multiHandLandmarks) {
                // Log landmarks every 500ms
                if (landmarkLog.current.length === 0 || 
                    Date.now() - testStartTime.current - landmarkLog.current[landmarkLog.current.length - 1].timestamp > 500) {
                  logLandmarks(landmarks, "hand");
                }
                
                // Draw hand skeleton
                const connections = [
                  [0,1],[1,2],[2,3],[3,4],
                  [0,5],[5,6],[6,7],[7,8],
                  [0,9],[9,10],[10,11],[11,12],
                  [0,13],[13,14],[14,15],[15,16],
                  [0,17],[17,18],[18,19],[19,20],
                  [5,9],[9,13],[13,17]
                ];
                
                canvasCtx.strokeStyle = "rgba(0, 255, 100, 0.8)";
                canvasCtx.lineWidth = 3;
                for (const [start, end] of connections) {
                  canvasCtx.beginPath();
                  canvasCtx.moveTo(
                    landmarks[start].x * canvasElement.width,
                    landmarks[start].y * canvasElement.height
                  );
                  canvasCtx.lineTo(
                    landmarks[end].x * canvasElement.width,
                    landmarks[end].y * canvasElement.height
                  );
                  canvasCtx.stroke();
                }
                
                // Draw landmarks
                canvasCtx.fillStyle = "rgba(255, 0, 100, 0.9)";
                for (const point of landmarks) {
                  canvasCtx.beginPath();
                  canvasCtx.arc(
                    point.x * canvasElement.width,
                    point.y * canvasElement.height,
                    5,
                    0,
                    2 * Math.PI
                  );
                  canvasCtx.fill();
                }
              }
              
              const processingTime = performance.now() - startTime;
              latencyHistory.current.push(processingTime);
              setLatency(processingTime.toFixed(1));
              setAccuracy(`${results.multiHandLandmarks.length} hand(s) detected`);
            } else {
              setAccuracy("No hands detected");
            }

            canvasCtx.restore();
          });

          handsRef.current = hands;

          const camera = new window.Camera(videoElement, {
            onFrame: async () => {
              await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480,
          });
          
          cameraRef.current = camera;
          camera.start();
        };
        document.body.appendChild(script3);
      };
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);

    return () => {
      if (cameraRef.current && cameraRef.current.stop) {
        cameraRef.current.stop();
      }
      if (handsRef.current && handsRef.current.close) {
        handsRef.current.close();
      }
    };
  }, [currentTest, testPhase]);

  // Three.js / Plain WebRTC Test
  useEffect(() => {
    if (currentTest !== "threejs" || testPhase !== "running") return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    })
    .then(stream => {
      streamRef.current = stream;
      videoElement.srcObject = stream;
      videoElement.play();
      
      const renderLoop = () => {
        if (currentTest !== "threejs" || testPhase !== "running") return;
        
        const startTime = performance.now();
        updateFPS();
        
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // AR Overlay simulations
        const time = Date.now() / 1000;
        
        // Animated guide arrow
        canvasCtx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        canvasCtx.fillStyle = 'rgba(0, 255, 0, 0.6)';
        canvasCtx.lineWidth = 4;
        
        const arrowY = 200 + Math.sin(time * 2) * 30;
        canvasCtx.beginPath();
        canvasCtx.moveTo(150, arrowY);
        canvasCtx.lineTo(250, arrowY);
        canvasCtx.lineTo(240, arrowY - 10);
        canvasCtx.moveTo(250, arrowY);
        canvasCtx.lineTo(240, arrowY + 10);
        canvasCtx.stroke();
        
        // Hand position indicator (center)
        canvasCtx.fillStyle = 'rgba(255, 100, 0, 0.4)';
        canvasCtx.fillRect(270, 190, 100, 100);
        canvasCtx.strokeStyle = 'rgba(255, 100, 0, 0.9)';
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeRect(270, 190, 100, 100);
        
        // Text overlay
        canvasCtx.font = 'bold 20px Arial';
        canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        canvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        canvasCtx.lineWidth = 3;
        canvasCtx.strokeText('Place hands here', 390, 240);
        canvasCtx.fillText('Place hands here', 390, 240);
        
        canvasCtx.restore();
        
        const processingTime = performance.now() - startTime;
        latencyHistory.current.push(processingTime);
        setLatency(processingTime.toFixed(1));
        setAccuracy("Overlay rendering active");
        
        requestAnimationFrame(renderLoop);
      };
      
      renderLoop();
    })
    .catch(err => {
      console.error('Camera error:', err);
      setAccuracy('Camera access denied');
    });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [currentTest, testPhase]);

  // Timer for test duration
  useEffect(() => {
    if (testPhase !== "running") return;
    
    const interval = setInterval(() => {
      setTestDuration(((Date.now() - testStartTime.current) / 1000).toFixed(1));
    }, 100);
    
    return () => clearInterval(interval);
  }, [testPhase]);

  if (currentTest === "menu") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold mb-3">
              📱 WebAR Research Platform
            </h1>
            <p className="text-blue-200 text-lg mb-2">
              Vocational School AR/AI Implementation Study
            </p>
            <div className="bg-blue-800/50 rounded-lg px-4 py-2 inline-block">
              <p className="text-white text-sm">
                Device: {deviceInfo.platform} • {deviceInfo.browser}
              </p>
              <p className="text-blue-200 text-xs">
                {deviceInfo.screen} @ {deviceInfo.pixelRatio}x pixel ratio
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-white text-2xl font-bold mb-4">
              🎯 Research Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-green-400 font-bold mb-2">✓ Action 1: Test WebAR Options</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Compare different technologies</li>
                  <li>• Measure FPS and latency</li>
                  <li>• Test on iOS Safari & Android Chrome</li>
                </ul>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-yellow-400 font-bold mb-2">✓ Action 2: Add Pose Detection</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Use MediaPipe for hand tracking</li>
                  <li>• Show live overlay dots/lines</li>
                  <li>• Log positions for AI training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-white text-2xl font-bold mb-4">
              🧪 Test Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => startTest("mediapipe")}
                className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold">Option A+2: MediaPipe</h3>
                  <span className="text-3xl">🤲</span>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Google's hand tracking ML model with 21 landmark points
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">FREE</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Hand Tracking</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">CDN Hosted</span>
                </div>
                <p className="text-xs opacity-75">
                  ✓ Action 2: Pose detection included
                </p>
              </button>

              <button
                onClick={() => startTest("threejs")}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold">Option B: Three.js/WebRTC</h3>
                  <span className="text-3xl">📹</span>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Custom AR overlays with native browser camera (no tracking)
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">FREE</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Lightweight</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Custom AR</span>
                </div>
                <p className="text-xs opacity-75">
                  ✓ Simple overlay rendering only
                </p>
              </button>
            </div>

            <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>💡 Test Instructions:</strong> Each test runs for 20-30 seconds. 
                Move your hands naturally. Metrics are captured automatically. 
                Click "Finish Test" when done.
              </p>
            </div>
          </div>

          {Object.keys(testData).length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">📊 Test Results</h2>
                <button
                  onClick={downloadReport}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  📥 Download Full Report (JSON)
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(testData).map(([testName, data]) => (
                  <div key={testName} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {testName === 'mediapipe' && '🤲 MediaPipe Hands'}
                          {testName === 'threejs' && '📹 Three.js/WebRTC'}
                        </h3>
                        <p className="text-blue-300 text-xs">
                          {new Date(data.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        data.metrics.smoothness === 'Excellent' || data.metrics.smoothness === 'Good'
                          ? 'bg-green-500/30 text-green-200'
                          : 'bg-yellow-500/30 text-yellow-200'
                      }`}>
                        {data.metrics.smoothness}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-blue-500/20 rounded-lg p-3">
                        <p className="text-blue-300 text-xs mb-1">Avg FPS</p>
                        <p className="text-white text-xl font-bold">{data.metrics.avgFps}</p>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-3">
                        <p className="text-purple-300 text-xs mb-1">Min FPS</p>
                        <p className="text-white text-xl font-bold">{data.metrics.minFps}</p>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-3">
                        <p className="text-green-300 text-xs mb-1">Latency</p>
                        <p className="text-white text-xl font-bold">{data.metrics.avgLatency}ms</p>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-3">
                        <p className="text-orange-300 text-xs mb-1">Duration</p>
                        <p className="text-white text-xl font-bold">{data.metrics.testDuration}s</p>
                      </div>
                      <div className="bg-pink-500/20 rounded-lg p-3">
                        <p className="text-pink-300 text-xs mb-1">Landmarks</p>
                        <p className="text-white text-xl font-bold">{data.metrics.landmarkCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(testData).length >= 2 && (
                <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4">
                  <h3 className="text-white font-bold text-lg mb-2">
                    🏆 Comparison Summary
                  </h3>
                  {(() => {
                    const tests = Object.values(testData);
                    const mp = tests.find(t => t.testType === 'mediapipe');
                    const tj = tests.find(t => t.testType === 'threejs');
                    
                    if (mp && tj) {
                      return (
                        <div className="space-y-2 text-sm">
                          <p className="text-green-200">
                            • <strong>Performance:</strong> {parseFloat(mp.metrics.avgFps) > parseFloat(tj.metrics.avgFps) ? 'MediaPipe' : 'Three.js'} has better FPS ({mp.metrics.avgFps} vs {tj.metrics.avgFps})
                          </p>
                          <p className="text-blue-200">
                            • <strong>Responsiveness:</strong> {parseFloat(mp.metrics.avgLatency) < parseFloat(tj.metrics.avgLatency) ? 'MediaPipe' : 'Three.js'} has lower latency ({mp.metrics.avgLatency}ms vs {tj.metrics.avgLatency}ms)
                          </p>
                          <p className="text-purple-200">
                            • <strong>Features:</strong> MediaPipe includes hand tracking ({mp.metrics.landmarkCount} samples), Three.js is overlay-only
                          </p>
                          <p className="text-yellow-200">
                            • <strong>Recommendation:</strong> MediaPipe for full AR training (hand tracking required), Three.js for simple visual guides only
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          )}

          <div className="text-center text-sm text-blue-200">
            <p className="mb-2">
              📋 Additional options to research manually:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-blue-800/30 rounded-full px-3 py-1">8th Wall ($100+/mo)</span>
              <span className="bg-blue-800/30 rounded-full px-3 py-1">Zappar (Free tier)</span>
              <span className="bg-blue-800/30 rounded-full px-3 py-1">WebXR Device API (Limited support)</span>
              <span className="bg-blue-800/30 rounded-full px-3 py-1">AR.js (Marker-based)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="text-center mb-4">
        <h1 className="text-white text-2xl font-bold mb-2">
          {currentTest === 'mediapipe' && '🤲 Testing: MediaPipe Hands'}
          {currentTest === 'threejs' && '📹 Testing: Three.js/WebRTC'}
        </h1>
        <button
          onClick={testPhase === "running" ? finishTest : returnToMenu}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {testPhase === "running" ? '✓ Finish Test' : '← Back to Menu'}
        </button>
      </div>

      <div className="relative mb-4">
        <video
          ref={videoRef}
          className="hidden"
          width="640"
          height="480"
          autoPlay
          playsInline
        ></video>
        <canvas
          ref={canvasRef}
          className="rounded-2xl border-4 border-blue-400 shadow-2xl"
          width="640"
          height="480"
        ></canvas>

        {/* Real-time Metrics Overlay */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">FPS:</span>
              <span className={`font-bold ${fps >= 25 ? 'text-green-400' : fps >= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                {fps}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Latency:</span>
              <span className="text-blue-400 font-bold">{latency}ms</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-300">Time:</span>
              <span className="text-purple-400 font-bold">{testDuration}s</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-semibold">
              {testPhase === "running" ? "Recording..." : "Test Complete"}
            </span>
          </div>
        </div>

        {/* Accuracy/Detection Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <p className="text-white text-sm font-medium text-center">
              {accuracy}
            </p>
          </div>
        </div>

        {/* Instructions Overlay */}
        {testPhase === "running" && (
          <div className="absolute bottom-20 left-3 right-3">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-400/30">
              <p className="text-yellow-200 text-xs text-center">
                {currentTest === 'mediapipe' 
                  ? '👋 Move your hands around naturally. Watch the green lines track your movements!'
                  : '📍 See the AR overlays? Move around to test smoothness and responsiveness.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Test Progress & Instructions */}
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-bold mb-3">
            {currentTest === 'mediapipe' ? '🤲 Hand Tracking Test' : '📹 Camera Overlay Test'}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            {currentTest === 'mediapipe' ? (
              <>
                <p>✓ Green lines should follow your hand movements</p>
                <p>✓ Pink dots mark 21 hand landmarks</p>
                <p>✓ Positions are logged to console every 0.5s</p>
                <p>✓ Try different hand gestures and speeds</p>
              </>
            ) : (
              <>
                <p>✓ Animated arrow shows AR overlay rendering</p>
                <p>✓ Orange box indicates target area</p>
                <p>✓ Text demonstrates label placement</p>
                <p>✓ Move camera to test responsiveness</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-500/20 rounded-lg p-3 text-center">
              <p className="text-blue-300 text-xs mb-1">Target FPS</p>
              <p className="text-white font-bold">25-30</p>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-3 text-center">
              <p className="text-purple-300 text-xs mb-1">Max Latency</p>
              <p className="text-white font-bold">&lt;100ms</p>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <p className="text-green-300 text-xs mb-1">Test Time</p>
              <p className="text-white font-bold">20-30s</p>
            </div>
          </div>
        </div>

        {/* What's Being Measured */}
        <div className="mt-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2 text-sm">📊 Metrics Being Captured:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>FPS (Frames Per Second):</strong> How smooth the camera feed is</li>
            <li>• <strong>Latency:</strong> How quickly overlays respond to changes</li>
            <li>• <strong>Accuracy:</strong> Detection quality (MediaPipe only)</li>
            <li>• <strong>Stability:</strong> Consistency over time</li>
            {currentTest === 'mediapipe' && (
              <li>• <strong>Landmark Data:</strong> X, Y, Z coordinates logged for AI training</li>
            )}
          </ul>
        </div>

        {/* Console Log Info */}
        {currentTest === 'mediapipe' && (
          <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
            <p className="text-yellow-200 text-xs">
              💡 <strong>For developers:</strong> Open browser console (F12) to see detailed landmark position logs. 
              This data will be used for AI training in Phase 2.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}