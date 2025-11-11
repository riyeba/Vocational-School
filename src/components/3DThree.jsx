import React, { useEffect, useRef, useState } from "react";

export default function GreenLeafEven() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const stepIndexRef = useRef(0);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const streamRef = useRef(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now(), samples: [] });
  const latencySamplesRef = useRef([]);
  const frameDropCounterRef = useRef(0);
  const testStartTimeRef = useRef(0);
  const threeSceneRef = useRef(null);
  const threeRendererRef = useRef(null);
  const threeCameraRef = useRef(null);
  const threeObjectsRef = useRef({});
  const animationFrameRef = useRef(null);
  const autoProgressTimerRef = useRef(null);

  const [mode, setMode] = useState("menu");
  const [arTestMode, setArTestMode] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepText, setStepText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [testResults, setTestResults] = useState([]);

  const trainingModes = {
    handwashing: [
      { text: "Step 1: Wet hands and apply soap", instruction: "Turn on water, wet both hands thoroughly, then apply soap.", gesture: "hands_open" },
      { text: "Step 2: Rub palms together", instruction: "Place both palms together and rub in circular motion.", gesture: "hands_closed" },
      { text: "Step 3: Rub back of hands", instruction: "Place one palm on back of other hand and rub.", gesture: "hands_closed" },
      { text: "✅ Training Complete!", instruction: "Great job!", gesture: "hands_open" }
    ]
  };

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
      fpsCounterRef.current.samples.push(currentFps);
      if (fpsCounterRef.current.samples.length > 30) fpsCounterRef.current.samples.shift();
      if (currentFps < 25) frameDropCounterRef.current++;
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
  };

  const calculateMetrics = () => {
    const avgFps = fpsCounterRef.current.samples.length > 0 ? fpsCounterRef.current.samples.reduce((a, b) => a + b, 0) / fpsCounterRef.current.samples.length : 0;
    const avgLatency = latencySamplesRef.current.length > 0 ? latencySamplesRef.current.reduce((a, b) => a + b, 0) / latencySamplesRef.current.length : 0;
    const testDuration = (Date.now() - testStartTimeRef.current) / 1000;
    const cameraQuality = avgFps >= 28 ? 'Excellent' : avgFps >= 24 ? 'Good' : avgFps >= 20 ? 'Fair' : 'Poor';
    const overlayResponsiveness = avgLatency <= 100 ? 'Excellent' : avgLatency <= 200 ? 'Good' : avgLatency <= 400 ? 'Fair' : 'Poor';
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
    return result;
  };

  const startARTest = (techType) => {
    setArTestMode(techType);
    setMode("handwashing");
    setStepIndex(0);
    stepIndexRef.current = 0;
    setStepText(trainingModes.handwashing[0].text);
    setFeedback("Starting AR test...");
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
    if (arTestMode) finishTest();
    if (autoProgressTimerRef.current) clearInterval(autoProgressTimerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
    if (handsRef.current && handsRef.current.close) handsRef.current.close();
    if (streamRef.current) { 
      streamRef.current.getTracks().forEach(track => track.stop()); 
      streamRef.current = null; 
    }
    if (threeRendererRef.current) { 
      threeRendererRef.current.dispose(); 
      threeRendererRef.current = null; 
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
    URL.revokeObjectURL(url);
  };

  const compareResults = () => {
    if (testResults.length < 2) return null;
    const comparison = { winner: null, reasons: [] };
    const mediapipeResult = testResults.find(r => r.technology === 'mediapipe');
    const threejsResult = testResults.find(r => r.technology === 'threejs');
    if (mediapipeResult && threejsResult) {
      const mpFps = parseFloat(mediapipeResult.metrics.avgFps);
      const tjFps = parseFloat(threejsResult.metrics.avgFps);
      if (mpFps > tjFps) {
        comparison.reasons.push(`MediaPipe has higher FPS (${mpFps} vs ${tjFps})`);
        comparison.winner = 'MediaPipe';
      } else {
        comparison.reasons.push(`Three.js has higher FPS (${tjFps} vs ${mpFps})`);
        comparison.winner = 'Three.js';
      }
    }
    return comparison;
  };

  useEffect(() => {
    if (mode === "menu" || arTestMode !== 'mediapipe') return;

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
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          });

          hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
          });

          hands.onResults((results) => {
            const startTime = performance.now();
            updateFPS();
            
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

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
            }

            const processingTime = performance.now() - startTime;
            latencySamplesRef.current.push(processingTime);
            if (latencySamplesRef.current.length > 20) latencySamplesRef.current.shift();
            setLatency(processingTime.toFixed(1));

            canvasCtx.restore();
          });

          handsRef.current = hands;

          const camera = new window.Camera(videoElement, {
            onFrame: async () => {
              await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480
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
      if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
      if (handsRef.current && handsRef.current.close) handsRef.current.close();
    };
  }, [mode, arTestMode]);

  useEffect(() => {
    if (mode === "menu" || arTestMode !== 'threejs') return;

    const videoElement = videoRef.current;
    const container = threeContainerRef.current;

    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    
    threeScript.onload = () => {
      const THREE = window.THREE;
      console.log('✅ Three.js loaded');
      
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      })
      .then(stream => {
        streamRef.current = stream;
        videoElement.srcObject = stream;
        videoElement.play();
        
        autoProgressTimerRef.current = setInterval(() => {
          const currentStep = stepIndexRef.current;
          const nextIndex = currentStep + 1;
          
          if (nextIndex < trainingModes.handwashing.length) {
            stepIndexRef.current = nextIndex;
            setStepIndex(nextIndex);
            setStepText(trainingModes.handwashing[nextIndex].text);
          } else {
            clearInterval(autoProgressTimerRef.current);
          }
        }, 5000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(640, 480);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        threeRendererRef.current = renderer;
        
        const scene = new THREE.Scene();
        threeSceneRef.current = scene;
        
        const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
        camera.position.z = 3;
        threeCameraRef.current = camera;
        
        const createHandIndicator = (color, label) => {
          const group = new THREE.Group();
          
          const palmGeometry = new THREE.SphereGeometry(0.3, 32, 32);
          const palmMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
          const palm = new THREE.Mesh(palmGeometry, palmMaterial);
          group.add(palm);
          
          for (let i = 0; i < 5; i++) {
            const fingerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
            const fingerMaterial = new THREE.MeshBasicMaterial({ color: color });
            const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
            finger.position.set((i - 2) * 0.15, 0.3, 0);
            group.add(finger);
          }
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 256;
          canvas.height = 64;
          context.fillStyle = 'rgba(255, 255, 255, 0.9)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'black';
          context.font = 'bold 30px Arial';
          context.textAlign = 'center';
          context.fillText(label, 128, 42);
          
          const texture = new THREE.CanvasTexture(canvas);
          const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const labelGeometry = new THREE.PlaneGeometry(1, 0.25);
          const labelPlane = new THREE.Mesh(labelGeometry, labelMaterial);
          labelPlane.position.y = -0.6;
          group.add(labelPlane);
          
          return group;
        };
        
        const leftHand = createHandIndicator(0x00ff00, 'Left Hand');
        leftHand.position.set(-1.5, 0, 0);
        scene.add(leftHand);
        
        const rightHand = createHandIndicator(0x00ff00, 'Right Hand');
        rightHand.position.set(1.5, 0, 0);
        scene.add(rightHand);
        
        const instructionCanvas = document.createElement('canvas');
        const instructionContext = instructionCanvas.getContext('2d');
        instructionCanvas.width = 1024;
        instructionCanvas.height = 128;
        
        const updateInstructionText = (text) => {
          instructionContext.fillStyle = 'rgba(0, 0, 0, 0.8)';
          instructionContext.fillRect(0, 0, instructionCanvas.width, instructionCanvas.height);
          instructionContext.fillStyle = 'white';
          instructionContext.font = 'bold 40px Arial';
          instructionContext.textAlign = 'center';
          instructionContext.fillText(text, 512, 70);
          instructionTexture.needsUpdate = true;
        };
        
        const instructionTexture = new THREE.CanvasTexture(instructionCanvas);
        const instructionMaterial = new THREE.MeshBasicMaterial({ map: instructionTexture, transparent: true, side: THREE.DoubleSide });
        const instructionGeometry = new THREE.PlaneGeometry(4, 0.5);
        const instructionPlane = new THREE.Mesh(instructionGeometry, instructionMaterial);
        instructionPlane.position.set(0, 1.5, 0);
        scene.add(instructionPlane);
        
        updateInstructionText('Wet hands and apply soap (OPEN)');
        
        const progressSpheres = [];
        for (let i = 0; i < 3; i++) {
          const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.5 });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set((i - 1) * 0.6, -1.5, 0);
          scene.add(sphere);
          progressSpheres.push(sphere);
        }
        
        threeObjectsRef.current = { leftHand, rightHand, instructionPlane, progressSpheres, updateInstructionText };
        
        const animate = () => {
          if (arTestMode !== 'threejs' || mode === 'menu') return;
          
          const renderStartTime = performance.now();
          updateFPS();
          
          const time = Date.now() * 0.001;
          const currentStep = stepIndexRef.current;
          const { leftHand, rightHand, progressSpheres, updateInstructionText } = threeObjectsRef.current;
          
          if (currentStep === 0 || currentStep === 3) {
            leftHand.children.forEach((child, idx) => {
              if (idx > 0 && idx <= 5) {
                child.position.x = ((idx - 1) - 2) * 0.2;
                child.rotation.z = ((idx - 1) - 2) * 0.3;
              }
            });
            rightHand.children.forEach((child, idx) => {
              if (idx > 0 && idx <= 5) {
                child.position.x = ((idx - 1) - 2) * 0.2;
                child.rotation.z = ((idx - 1) - 2) * 0.3;
              }
            });
            leftHand.children[0].material.color.setHex(0x00ff00);
            rightHand.children[0].material.color.setHex(0x00ff00);
          } else if (currentStep === 1 || currentStep === 2) {
            leftHand.children.forEach((child, idx) => {
              if (idx > 0 && idx <= 5) {
                child.position.x = 0;
                child.rotation.z = 0;
              }
            });
            rightHand.children.forEach((child, idx) => {
              if (idx > 0 && idx <= 5) {
                child.position.x = 0;
                child.rotation.z = 0;
              }
            });
            leftHand.children[0].material.color.setHex(0xff6600);
            rightHand.children[0].material.color.setHex(0xff6600);
          }
          
          const pulseScale = 1 + Math.sin(time * 3) * 0.1;
          leftHand.children[0].scale.set(pulseScale, pulseScale, pulseScale);
          rightHand.children[0].scale.set(pulseScale, pulseScale, pulseScale);
          
          leftHand.rotation.y = Math.sin(time * 0.5) * 0.2;
          rightHand.rotation.y = Math.sin(time * 0.5) * 0.2;
          
          progressSpheres.forEach((sphere, idx) => {
            if (idx < currentStep) {
              sphere.material.color.setHex(0x00ff00);
              sphere.material.opacity = 1;
            } else if (idx === currentStep) {
              sphere.material.color.setHex(0xffff00);
              sphere.material.opacity = 0.8 + Math.sin(time * 5) * 0.2;
            } else {
              sphere.material.color.setHex(0x666666);
              sphere.material.opacity = 0.5;
            }
            sphere.position.y = -1.5 + Math.sin(time * 2 + idx) * 0.05;
          });
          
          const instructions = [
            'Wet hands and apply soap (OPEN)',
            'Rub palms together (CLOSED)',
            'Rub back of hands (CLOSED)',
            'Training Complete! (OPEN)'
          ];
          if (currentStep < instructions.length) {
            updateInstructionText(instructions[currentStep]);
          }
          
          renderer.render(scene, camera);
          
          const renderEndTime = performance.now();
          const renderLatency = renderEndTime - renderStartTime;
          
          latencySamplesRef.current.push(renderLatency);
          if (latencySamplesRef.current.length > 20) latencySamplesRef.current.shift();
          setLatency(renderLatency.toFixed(1));
          
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate();
      })
      .catch(err => {
        console.error('Camera error:', err);
        setFeedback('Camera access denied');
      });
    };
    
    threeScript.onerror = () => {
      console.error('Failed to load Three.js');
      setFeedback('Failed to load Three.js library');
    };
    
    document.body.appendChild(threeScript);

    return () => {
      if (autoProgressTimerRef.current) clearInterval(autoProgressTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (threeRendererRef.current) {
        const rendererElement = threeRendererRef.current.domElement;
        if (rendererElement && rendererElement.parentNode) {
          rendererElement.parentNode.removeChild(rendererElement);
        }
        threeRendererRef.current.dispose();
        threeRendererRef.current = null;
      }
    };
  }, [mode, arTestMode]);

  if (mode === "menu") {
    const deviceInfo = getDeviceInfo();
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="text-center mb-6">
          <h1 className="text-white text-4xl font-bold mb-2">🎯 AR Technology Test</h1>
          <p className="text-blue-200 text-lg">WebGL 3D vs MediaPipe Hand Tracking</p>
          <div className="mt-3 bg-blue-800/50 rounded-lg px-4 py-2 inline-block">
            <p className="text-white text-sm">📱 {deviceInfo.platform} • {deviceInfo.browser}</p>
          </div>
        </div>

        <div className="max-w-5xl w-full mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-white text-2xl font-bold mb-4">🧪 Compare Technologies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button onClick={() => startARTest('mediapipe')} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left">
                <h3 className="text-xl font-bold mb-2">MediaPipe + 2D Canvas</h3>
                <p className="text-sm opacity-90 mb-3">Hand tracking with Canvas 2D API</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Hand Tracking</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">2D Canvas</span>
                </div>
                <p className="text-xs opacity-75 bg-black/30 rounded p-2">✓ CPU rendering<br/>✓ 21 landmarks per hand</p>
              </button>

              <button onClick={() => startARTest('threejs')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left">
                <h3 className="text-xl font-bold mb-2">Three.js + WebGL 3D</h3>
                <p className="text-sm opacity-90 mb-3">3D graphics with auto-progression</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">WebGL</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">3D Hands</span>
                  <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Auto</span>
                </div>
                <p className="text-xs opacity-75 bg-black/30 rounded p-2">✓ GPU accelerated<br/>✓ Auto-progress every 5s</p>
              </button>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm"><strong>💡</strong> Three.js shows 3D hand animations that progress automatically!</p>
            </div>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="max-w-5xl w-full mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">📊 Test Results</h2>
                <button onClick={exportResults} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">📥 Export JSON</button>
              </div>
              
              <div className="space-y-4">
                {testResults.map((result, idx) => (
                  <div key={idx} className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg">{result.technology === 'mediapipe' ? '🔵 MediaPipe' : '🟣 Three.js'}</h3>
                        <p className="text-blue-300 text-xs">{new Date(result.timestamp).toLocaleString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${result.verdict.smoothness === 'Smooth' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'}`}>
                        {result.verdict.smoothness}
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
                        <p className="text-green-300 text-xs mb-1">Quality</p>
                        <p className="text-white text-sm font-bold">{result.metrics.cameraQuality}</p>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-3">
                        <p className="text-orange-300 text-xs mb-1">Drops</p>
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
                    <h3 className="text-white font-bold text-lg mb-2">🏆 Winner: {comparison.winner}</h3>
                    <ul className="space-y-1">
                      {comparison.reasons.map((reason, idx) => (
                        <li key={idx} className="text-green-200 text-sm">• {reason}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-5xl w-full">
          <h3 className="text-white font-bold mb-2">🔍 Technical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-black/30 rounded p-3">
              <p className="text-blue-300 font-semibold mb-1">MediaPipe:</p>
              <p className="text-gray-300 text-xs">• Hand tracking library</p>
              <p className="text-gray-300 text-xs">• Canvas 2D rendering</p>
              <p className="text-gray-300 text-xs">• CPU-based</p>
            </div>
            <div className="bg-black/30 rounded p-3">
              <p className="text-purple-300 font-semibold mb-1">Three.js:</p>
              <p className="text-gray-300 text-xs">• WebGL renderer</p>
              <p className="text-gray-300 text-xs">• 3D hand models</p>
              <p className="text-gray-300 text-xs">• GPU accelerated</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-blue-200 text-sm">📋 Open console (F12) for logs</p>
          <p className="text-blue-300 text-xs mt-2">{deviceInfo.platform} • {deviceInfo.browser}</p>
        </div>
      </div>
    );
  }

  const steps = trainingModes[mode];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="text-center mb-3">
        <h1 className="text-white text-2xl font-bold mb-1">
          {arTestMode === 'mediapipe' && '🔵 Testing: MediaPipe + Canvas 2D'}
          {arTestMode === 'threejs' && '🟣 Testing: Three.js + WebGL'}
        </h1>
        <button onClick={returnToMenu} className="text-blue-300 text-sm hover:text-blue-100 underline">
          ← Finish Test & View Results
        </button>
      </div>
      
      <div className="relative">
        <video ref={videoRef} className={arTestMode === 'threejs' ? 'rounded-2xl border-4 border-purple-400 shadow-2xl' : 'hidden'} width="640" height="480" autoPlay playsInline></video>
        
        {arTestMode === 'mediapipe' && (
          <canvas ref={canvasRef} className="rounded-2xl border-4 border-blue-400 shadow-2xl" width="640" height="480"></canvas>
        )}
        
        <div ref={threeContainerRef} className="absolute top-0 left-0 rounded-2xl overflow-hidden" style={{ pointerEvents: 'none', width: '640px', height: '480px' }}></div>

        <div className="absolute top-2 right-2 bg-black/90 rounded-lg px-3 py-2 text-xs space-y-1 border border-white/20">
          <div className="text-green-400 font-bold">FPS: {fps}</div>
          <div className="text-blue-400">Latency: {latency}ms</div>
          <div className="text-purple-400">Drops: {frameDropCounterRef.current}</div>
          <div className={`font-semibold ${fps >= 25 ? 'text-green-400' : 'text-red-400'}`}>
            {fps >= 25 ? '✓ Smooth' : '⚠ Choppy'}
          </div>
          <div className="text-yellow-300 text-xs mt-2 pt-2 border-t border-white/20">
            {arTestMode === 'mediapipe' ? '2D Canvas' : 'WebGL 3D'}
          </div>
        </div>

        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
            <div className="flex justify-between mb-2">
              {steps.slice(0, -1).map((_, idx) => (
                <div key={idx} className={`h-2 flex-1 mx-1 rounded-full transition-all ${idx < stepIndex ? "bg-green-400" : idx === stepIndex ? "bg-blue-400 animate-pulse" : "bg-gray-600"}`} />
              ))}
            </div>
            <p className="text-white text-sm font-semibold text-center">{stepText}</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
            <p className="text-white text-sm font-medium text-center">
              {arTestMode === 'mediapipe' ? '👋 Move your hands - watch tracking!' : '🎨 3D hands animate! Auto-progress every 5s'}
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              <p className="text-white font-semibold">🔄 Processing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-bold mb-3">{arTestMode === 'mediapipe' ? '🔵 What You See' : '🟣 What You See'}</h3>
          
          <div className="space-y-2 text-sm text-gray-300">
            {arTestMode === 'mediapipe' ? (
              <>
                <p>✓ <strong>Camera feed</strong> on Canvas</p>
                <p>✓ <strong>Green lines</strong> connecting joints</p>
                <p>✓ <strong>Pink dots</strong> marking landmarks</p>
                <p>✓ <strong>CPU rendering</strong></p>
              </>
            ) : (
              <>
                <p>✓ <strong>Camera feed</strong> background</p>
                <p>✓ <strong>Two 3D hand models</strong></p>
                <p>✓ <strong>Animated gestures</strong> per step</p>
                <p>✓ <strong>Progress spheres</strong> at bottom</p>
                <p>✓ <strong>Auto-progression</strong> every 5s</p>
                <p className="mt-2 text-yellow-300">🎯 <strong>Steps:</strong> OPEN → CLOSED → CLOSED → OPEN</p>
                <p>✓ <strong>GPU rendering</strong></p>
              </>
            )}
          </div>

          <div className="mt-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
            <p className="text-yellow-200 text-xs"><strong>💡</strong> Check console (F12) for detailed logs</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-blue-200 text-sm">Testing {arTestMode === 'mediapipe' ? 'MediaPipe' : 'Three.js'} • Steps auto-progress every 5s</p>
      </div>
    </div>
  );
}