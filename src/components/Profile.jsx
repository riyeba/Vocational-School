

import React, { useEffect, useRef, useState } from "react";

export default function GreenLeafProfile() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("menu");
  const [arTestMode, setArTestMode] = useState(null); // 'mediapipe', 'threejs', 'webxr'
  const [stepIndex, setStepIndex] = useState(0);
  const [stepText, setStepText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Performance metrics
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [arMetrics, setArMetrics] = useState({
    avgFps: 0,
    avgLatency: 0,
    frameDrops: 0,
    cameraQuality: 'unknown',
    overlayResponsiveness: 0
  });
  const [testResults, setTestResults] = useState([]);
  
  const stepIndexRef = useRef(0);
  const lastDetectionRef = useRef(0);
  const lastFrameCaptureRef = useRef(0);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now(), samples: [] });
  const latencySamplesRef = useRef([]);
  const frameDropCounterRef = useRef(0);
  const testStartTimeRef = useRef(0);

  const trainingModes = {
    handwashing: [
      {
        text: "Step 1: Wet hands and apply soap",
        instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
        gesture: "palms_together"
      },
      {
        text: "Step 2: Rub palms together",
        instruction: "Place both palms together and rub them in circular motion.",
        gesture: "palms_together"
      },
      {
        text: "Step 3: Rub back of hands",
        instruction: "Place one palm on back of other hand and rub, then switch.",
        gesture: "back_of_hands"
      },
      {
        text: "Step 4: Interlace fingers",
        instruction: "Interlock your fingers and rub them together.",
        gesture: "interlaced"
      },
      {
        text: "✅ Training Complete!",
        instruction: "Great job!",
        gesture: "complete"
      }
    ]
  };

  // Detect device and browser
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isChrome = /Chrome/.test(ua);
    
    return {
      platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop',
      browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other',
      userAgent: ua
    };
  };

  const updateFPS = () => {
    const now = Date.now();
    fpsCounterRef.current.frames++;
    
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      const currentFps = fpsCounterRef.current.frames;
      setFps(currentFps);
      
      // Track for averaging
      fpsCounterRef.current.samples.push(currentFps);
      if (fpsCounterRef.current.samples.length > 30) {
        fpsCounterRef.current.samples.shift();
      }
      
      // Detect frame drops (FPS < 25 is considered dropped)
      if (currentFps < 25) {
        frameDropCounterRef.current++;
      }
      
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
  };

  const calculateMetrics = () => {
    const avgFps = fpsCounterRef.current.samples.length > 0
      ? fpsCounterRef.current.samples.reduce((a, b) => a + b, 0) / fpsCounterRef.current.samples.length
      : 0;
    
    const avgLatency = latencySamplesRef.current.length > 0
      ? latencySamplesRef.current.reduce((a, b) => a + b, 0) / latencySamplesRef.current.length
      : 0;
    
    const testDuration = (Date.now() - testStartTimeRef.current) / 1000;
    
    const cameraQuality = avgFps >= 28 ? 'Excellent' :
                         avgFps >= 24 ? 'Good' :
                         avgFps >= 20 ? 'Fair' : 'Poor';
    
    const overlayResponsiveness = avgLatency <= 100 ? 'Excellent' :
                                  avgLatency <= 200 ? 'Good' :
                                  avgLatency <= 400 ? 'Fair' : 'Poor';
    
    return {
      avgFps: avgFps.toFixed(1),
      avgLatency: avgLatency.toFixed(0),
      frameDrops: frameDropCounterRef.current,
      cameraQuality,
      overlayResponsiveness,
      testDuration: testDuration.toFixed(1)
    };
  };

  const saveTestResults = (arTech) => {
    const metrics = calculateMetrics();
    const deviceInfo = getDeviceInfo();
    
    const result = {
      technology: arTech,
      timestamp: new Date().toISOString(),
      device: deviceInfo,
      metrics: metrics,
      verdict: {
        smoothness: metrics.avgFps >= 25 ? 'Smooth' : 'Choppy',
        responsiveness: metrics.avgLatency <= 200 ? 'Fast' : 'Slow',
        stability: metrics.frameDrops <= 5 ? 'Stable' : 'Unstable'
      }
    };
    
    setTestResults(prev => [...prev, result]);
    setArMetrics(metrics);
    
    // Log detailed results to console
    console.log('=== AR TEST RESULTS ===');
    console.log('Technology:', arTech);
    console.log('Device:', deviceInfo);
    console.log('Metrics:', metrics);
    console.log('=====================');
    
    return result;
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const analyzeWithAI = async (imageData, currentStep) => {
    if (!imageData || isProcessing) return;
    
    const startTime = Date.now();
    setIsProcessing(true);
    setFeedback("🤖 AI analyzing...");

    try {
      const base64Data = imageData.split(',')[1];
      const steps = trainingModes[mode];
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: "image/jpeg",
                    data: base64Data
                  }
                },
                {
                  type: "text",
                  text: `Analyze ${mode} technique for: ${steps[currentStep].instruction}

Respond ONLY in JSON:
{
  "correct": true/false,
  "feedback": "Brief feedback (1 sentence)"
}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const endTime = Date.now();
      const currentLatency = endTime - startTime;
      setLatency(currentLatency);
      
      // Track latency samples
      latencySamplesRef.current.push(currentLatency);
      if (latencySamplesRef.current.length > 20) {
        latencySamplesRef.current.shift();
      }
      
      const textContent = data.content.find(item => item.type === "text")?.text || "";
      const cleanText = textContent.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanText);
      
      if (result.correct) {
        setFeedback(`✅ ${result.feedback}`);
        setTimeout(() => advanceStep(currentStep + 1), 1500);
      } else {
        setFeedback(`⚠️ ${result.feedback}`);
      }
      
    } catch (error) {
      console.error("AI error:", error);
      setFeedback(`Auto-advancing...`);
      setTimeout(() => advanceStep(currentStep + 1), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const advanceStep = (newIndex) => {
    const steps = trainingModes[mode];
    if (newIndex < steps.length) {
      stepIndexRef.current = newIndex;
      setStepIndex(newIndex);
      setStepText(steps[newIndex].text);
      setFeedback("");
      lastDetectionRef.current = Date.now();
    }
  };

  const startARTest = (techType) => {
    setArTestMode(techType);
    setMode("handwashing");
    setStepIndex(0);
    stepIndexRef.current = 0;
    setStepText(trainingModes.handwashing[0].text);
    setFeedback("Starting AR test...");
    
    // Reset metrics
    fpsCounterRef.current = { frames: 0, lastTime: Date.now(), samples: [] };
    latencySamplesRef.current = [];
    frameDropCounterRef.current = 0;
    testStartTimeRef.current = Date.now();
  };

  const finishTest = () => {
    const results = saveTestResults(arTestMode);
    alert(`Test Complete!\n\nAvg FPS: ${results.metrics.avgFps}\nAvg Latency: ${results.metrics.avgLatency}ms\nCamera: ${results.metrics.cameraQuality}\nResponsiveness: ${results.metrics.overlayResponsiveness}`);
  };

  const returnToMenu = () => {
    if (arTestMode) {
      finishTest();
    }
    setMode("menu");
    setArTestMode(null);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setStepText("");
    setFeedback("");
  };

  const exportResults = () => {
    const deviceInfo = getDeviceInfo();
    const report = {
      testDate: new Date().toISOString(),
      device: deviceInfo,
      results: testResults,
      comparison: compareResults()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ar-test-results-${Date.now()}.json`;
    a.click();
  };

  const compareResults = () => {
    if (testResults.length < 2) return null;
    
    const comparison = {
      winner: null,
      reasons: []
    };
    
    const mediapipeResult = testResults.find(r => r.technology === 'mediapipe');
    const threejsResult = testResults.find(r => r.technology === 'threejs');
    
    if (mediapipeResult && threejsResult) {
      const mpFps = parseFloat(mediapipeResult.metrics.avgFps);
      const tjFps = parseFloat(threejsResult.metrics.avgFps);
      const mpLatency = parseFloat(mediapipeResult.metrics.avgLatency);
      const tjLatency = parseFloat(threejsResult.metrics.avgLatency);
      
      let mpScore = 0;
      let tjScore = 0;
      
      if (mpFps > tjFps) {
        mpScore++;
        comparison.reasons.push(`MediaPipe has higher FPS (${mpFps} vs ${tjFps})`);
      } else {
        tjScore++;
        comparison.reasons.push(`Three.js has higher FPS (${tjFps} vs ${mpFps})`);
      }
      
      if (mpLatency < tjLatency) {
        mpScore++;
        comparison.reasons.push(`MediaPipe has lower latency (${mpLatency}ms vs ${tjLatency}ms)`);
      } else {
        tjScore++;
        comparison.reasons.push(`Three.js has lower latency (${tjLatency}ms vs ${mpLatency}ms)`);
      }
      
      comparison.winner = mpScore > tjScore ? 'MediaPipe' : 'Three.js';
    }
    
    return comparison;
  };

  useEffect(() => {
    if (mode === "menu") return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    if (arTestMode === 'mediapipe') {
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
              minDetectionConfidence: 0.7,
              minTrackingConfidence: 0.7,
            });

            hands.onResults((results) => {
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
                  const connections = [
                    [0,1],[1,2],[2,3],[3,4],
                    [0,5],[5,6],[6,7],[7,8],
                    [0,9],[9,10],[10,11],[11,12],
                    [0,13],[13,14],[14,15],[15,16],
                    [0,17],[17,18],[18,19],[19,20],
                    [5,9],[9,13],[13,17]
                  ];
                  
                  canvasCtx.strokeStyle = "rgba(0, 200, 255, 0.7)";
                  canvasCtx.lineWidth = 2;
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
                  
                  canvasCtx.fillStyle = "rgba(0, 255, 100, 0.9)";
                  for (const point of landmarks) {
                    canvasCtx.beginPath();
                    canvasCtx.arc(
                      point.x * canvasElement.width,
                      point.y * canvasElement.height,
                      4,
                      0,
                      2 * Math.PI
                    );
                    canvasCtx.fill();
                  }
                }

                const now = Date.now();
                const currentStep = stepIndexRef.current;
                const steps = trainingModes[mode];
                
                if (results.multiHandLandmarks.length >= 1 && 
                    now - lastFrameCaptureRef.current > 4000 && 
                    currentStep < steps.length - 1 &&
                    !isProcessing) {
                  
                  lastFrameCaptureRef.current = now;
                  const frameData = captureFrame();
                  analyzeWithAI(frameData, currentStep);
                }
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
    } else if (arTestMode === 'threejs') {
      // Simplified Three.js AR simulation
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      })
      .then(stream => {
        videoElement.srcObject = stream;
        videoElement.play();
        
        const renderLoop = () => {
          updateFPS();
          
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          
          // Simulate AR overlay with simple shapes
          canvasCtx.fillStyle = 'rgba(0, 255, 0, 0.3)';
          canvasCtx.fillRect(100, 100, 100, 100);
          canvasCtx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
          canvasCtx.lineWidth = 3;
          canvasCtx.strokeRect(320 - 50, 240 - 50, 100, 100);
          
          canvasCtx.restore();
          requestAnimationFrame(renderLoop);
        };
        
        renderLoop();
      })
      .catch(err => {
        console.error('Camera error:', err);
        setFeedback('Camera access denied');
      });
      
      return () => {
        if (videoElement.srcObject) {
          videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [mode, arTestMode]);

  if (mode === "menu") {
    const deviceInfo = getDeviceInfo();
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="text-center mb-6">
          <h1 className="text-white text-4xl font-bold mb-2">
            🏥 WebAR Testing Platform
          </h1>
          <p className="text-blue-200 text-lg">
            Healthcare Training with AR Comparison
          </p>
          <div className="mt-3 bg-blue-800/50 rounded-lg px-4 py-2 inline-block">
            <p className="text-white text-sm">
              📱 {deviceInfo.platform} • {deviceInfo.browser}
            </p>
          </div>
        </div>

        <div className="max-w-5xl w-full mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-white text-2xl font-bold mb-4">
              🧪 AR Technology Tests
            </h2>
            <p className="text-blue-200 mb-4">
              Test different WebAR approaches and compare performance metrics
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => startARTest('mediapipe')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">Option A: MediaPipe Hands</h3>
                <p className="text-sm opacity-90 mb-3">
                  Google's hand tracking solution with ML models
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Hand Tracking</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">21 Landmarks</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Free CDN</span>
                </div>
              </button>

              <button
                onClick={() => startARTest('threejs')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">Option B: Three.js Camera</h3>
                <p className="text-sm opacity-90 mb-3">
                  Custom WebGL overlays with camera feed
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">3D Graphics</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Custom AR</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Lightweight</span>
                </div>
              </button>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                💡 <strong>Test Instructions:</strong> Each test runs for ~20-30 seconds. 
                Move your hands around to test tracking. Metrics are captured automatically.
              </p>
            </div>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="max-w-5xl w-full mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">📊 Test Results</h2>
                <button
                  onClick={exportResults}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  📥 Export JSON
                </button>
              </div>
              
              <div className="space-y-4">
                {testResults.map((result, idx) => (
                  <div key={idx} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          {result.technology === 'mediapipe' ? '🔵 MediaPipe Hands' : '🟣 Three.js Camera'}
                        </h3>
                        <p className="text-blue-300 text-xs">
                          {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          result.verdict.smoothness === 'Smooth' 
                            ? 'bg-green-500/30 text-green-200' 
                            : 'bg-red-500/30 text-red-200'
                        }`}>
                          {result.verdict.smoothness}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-500/20 rounded-lg p-3">
                        <p className="text-blue-300 text-xs mb-1">Avg FPS</p>
                        <p className="text-white text-xl font-bold">{result.metrics.avgFps}</p>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-3">
                        <p className="text-purple-300 text-xs mb-1">Avg Latency</p>
                        <p className="text-white text-xl font-bold">{result.metrics.avgLatency}ms</p>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-3">
                        <p className="text-green-300 text-xs mb-1">Camera Quality</p>
                        <p className="text-white text-sm font-bold">{result.metrics.cameraQuality}</p>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-3">
                        <p className="text-orange-300 text-xs mb-1">Frame Drops</p>
                        <p className="text-white text-xl font-bold">{result.metrics.frameDrops}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {testResults.length >= 2 && (() => {
                const comparison = compareResults();
                return comparison && (
                  <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4">
                    <h3 className="text-white font-bold text-lg mb-2">
                      🏆 Winner: {comparison.winner}
                    </h3>
                    <ul className="space-y-1">
                      {comparison.reasons.map((reason, idx) => (
                        <li key={idx} className="text-green-200 text-sm">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-blue-200 text-sm">
            📋 Metrics tracked: FPS, Latency, Frame Drops, Camera Quality, Responsiveness
          </p>
          <p className="text-blue-300 text-xs mt-2">
            {deviceInfo.platform} • {deviceInfo.browser} • WebAR Performance Testing
          </p>
        </div>
      </div>
    );
  }

  const steps = trainingModes[mode];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="text-center mb-3">
        <h1 className="text-white text-2xl font-bold mb-1">
          {arTestMode === 'mediapipe' && '🔵 Testing: MediaPipe Hands'}
          {arTestMode === 'threejs' && '🟣 Testing: Three.js Camera'}
        </h1>
        <button
          onClick={returnToMenu}
          className="text-blue-300 text-sm hover:text-blue-100 underline"
        >
          ← Finish Test & View Results
        </button>
      </div>
      
      <div className="relative">
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

        {/* Real-time Performance Metrics */}
        <div className="absolute top-2 right-2 bg-black/80 rounded-lg px-3 py-2 text-xs space-y-1">
          <div className="text-green-400 font-bold">FPS: {fps}</div>
          <div className="text-blue-400">Latency: {latency}ms</div>
          <div className="text-purple-400">Drops: {frameDropCounterRef.current}</div>
          <div className={`font-semibold ${fps >= 25 ? 'text-green-400' : 'text-red-400'}`}>
            {fps >= 25 ? '✓ Smooth' : '⚠ Choppy'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
            <div className="flex justify-between mb-2">
              {steps.slice(0, -1).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 mx-1 rounded-full transition-all ${
                    idx < stepIndex
                      ? "bg-green-400"
                      : idx === stepIndex
                      ? "bg-blue-400 animate-pulse"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-white text-sm font-semibold text-center">
              {stepText}
            </p>
          </div>
        </div>

        {/* AI Feedback */}
        {feedback && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
              <p className="text-white text-sm font-medium text-center">
                {feedback}
              </p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              <p className="text-white font-semibold">🔄 AI Analyzing...</p>
            </div>
          </div>
        )}

        {/* Test Status Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-black/80 rounded-lg px-3 py-2">
            <p className="text-yellow-300 text-xs font-semibold">
              🧪 AR Test in Progress
            </p>
            <p className="text-white text-xs">
              Move hands naturally
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-blue-200 text-sm">
          Testing {arTestMode === 'mediapipe' ? 'MediaPipe' : 'Three.js'} • Capturing metrics...
        </p>
      </div>
    </div>
  );
}