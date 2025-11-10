import React, { useEffect, useRef, useState } from "react";

export default function MediawithThree() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [currentTest, setCurrentTest] = useState("menu");
  const [testPhase, setTestPhase] = useState("setup");
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
  const threeSceneRef = useRef(null);
  const threeRendererRef = useRef(null);
  const threeCameraRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
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
    
    console.log("=== TEST COMPLETE ===");
    console.log("Test:", currentTest);
    console.log("Metrics:", metrics);
    console.log("Landmark samples:", landmarkLog.current.length);
    console.log("====================");
  };

  const returnToMenu = () => {
    // Cleanup
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
    if (threeRendererRef.current) {
      threeRendererRef.current.dispose();
      threeRendererRef.current = null;
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

  // Option A: MediaPipe + 2D Canvas
  useEffect(() => {
    if (currentTest !== "mediapipe-2d" || testPhase !== "running") return;

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
                if (landmarkLog.current.length === 0 || 
                    Date.now() - testStartTime.current - landmarkLog.current[landmarkLog.current.length - 1].timestamp > 500) {
                  logLandmarks(landmarks, "hand");
                }
                
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
              setAccuracy(`${results.multiHandLandmarks.length} hand(s) - 2D Canvas`);
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

  // Option B: MediaPipe + Three.js (3D)
  useEffect(() => {
    if (currentTest !== "mediapipe-3d" || testPhase !== "running") return;

    const videoElement = videoRef.current;
    const container = threeContainerRef.current;

    // Load Three.js
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    
    threeScript.onload = () => {
      const THREE = window.THREE;
      
      // Setup Three.js scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
      camera.position.z = 2;
      
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(640, 480);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      
      threeSceneRef.current = scene;
      threeRendererRef.current = renderer;
      threeCameraRef.current = camera;
      
      // Create 3D objects for hand landmarks
      const spheres = [];
      for (let i = 0; i < 21; i++) {
        const geometry = new THREE.SphereGeometry(0.02, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
          color: i === 0 || i === 5 || i === 9 || i === 13 || i === 17 ? 0xff00ff : 0x00ffff 
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.visible = false;
        scene.add(sphere);
        spheres.push(sphere);
      }
      
      // Create lines for hand skeleton
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
      const connections = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [0,9],[9,10],[10,11],[11,12],
        [0,13],[13,14],[14,15],[15,16],
        [0,17],[17,18],[18,19],[19,20],
        [5,9],[9,13],[13,17]
      ];
      
      const lines = [];
      connections.forEach(() => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const line = new THREE.Line(geometry, lineMaterial);
        line.visible = false;
        scene.add(line);
        lines.push(line);
      });

      // Load MediaPipe
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

              // Hide all 3D objects first
              spheres.forEach(s => s.visible = false);
              lines.forEach(l => l.visible = false);

              if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                  if (landmarkLog.current.length === 0 || 
                      Date.now() - testStartTime.current - landmarkLog.current[landmarkLog.current.length - 1].timestamp > 500) {
                    logLandmarks(landmarks, "hand");
                  }
                  
                  // Update 3D sphere positions
                  landmarks.forEach((lm, idx) => {
                    if (spheres[idx]) {
                      spheres[idx].position.set(
                        (lm.x - 0.5) * 4,
                        -(lm.y - 0.5) * 3,
                        -lm.z * 2
                      );
                      spheres[idx].visible = true;
                    }
                  });
                  
                  // Update 3D line positions
                  connections.forEach((conn, idx) => {
                    if (lines[idx]) {
                      const [start, end] = conn;
                      const positions = lines[idx].geometry.attributes.position.array;
                      positions[0] = (landmarks[start].x - 0.5) * 4;
                      positions[1] = -(landmarks[start].y - 0.5) * 3;
                      positions[2] = -landmarks[start].z * 2;
                      positions[3] = (landmarks[end].x - 0.5) * 4;
                      positions[4] = -(landmarks[end].y - 0.5) * 3;
                      positions[5] = -landmarks[end].z * 2;
                      lines[idx].geometry.attributes.position.needsUpdate = true;
                      lines[idx].visible = true;
                    }
                  });
                }
                
                const processingTime = performance.now() - startTime;
                latencyHistory.current.push(processingTime);
                setLatency(processingTime.toFixed(1));
                setAccuracy(`${results.multiHandLandmarks.length} hand(s) - Three.js 3D`);
              } else {
                setAccuracy("No hands detected");
              }

              // Render Three.js scene
              renderer.render(scene, camera);
            });

            handsRef.current = hands;

            const mpCamera = new window.Camera(videoElement, {
              onFrame: async () => {
                await hands.send({ image: videoElement });
              },
              width: 640,
              height: 480,
            });
            
            cameraRef.current = mpCamera;
            mpCamera.start();
          };
          document.body.appendChild(script3);
        };
        document.body.appendChild(script2);
      };
      document.body.appendChild(script1);
    };
    
    document.body.appendChild(threeScript);

    return () => {
      if (cameraRef.current && cameraRef.current.stop) {
        cameraRef.current.stop();
      }
      if (handsRef.current && handsRef.current.close) {
        handsRef.current.close();
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
  }, [currentTest, testPhase]);

  // Option C: Three.js Only (No tracking)
  useEffect(() => {
    if (currentTest !== "threejs-only" || testPhase !== "running") return;

    const videoElement = videoRef.current;
    const container = threeContainerRef.current;

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

      // Load Three.js
      const threeScript = document.createElement("script");
      threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      
      threeScript.onload = () => {
        const THREE = window.THREE;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
        camera.position.z = 2;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(640, 480);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        threeRendererRef.current = renderer;
        
        // Create 3D AR objects (no tracking)
        const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 32);
        const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        arrow.rotation.z = -Math.PI / 2;
        arrow.position.set(-0.5, 0, 0);
        scene.add(arrow);
        
        const boxGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const boxMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xff6600, 
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(0.5, 0, 0);
        scene.add(box);
        
        // Add text sprite (simplified)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'white';
        context.font = 'bold 32px Arial';
        context.fillText('Place hands here', 10, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(0, -0.7, 0);
        sprite.scale.set(1, 0.25, 1);
        scene.add(sprite);
        
        const animate = () => {
          if (currentTest !== "threejs-only" || testPhase !== "running") return;
          
          const startTime = performance.now();
          updateFPS();
          
          const time = Date.now() * 0.001;
          arrow.position.x = -0.5 + Math.sin(time * 2) * 0.2;
          box.rotation.x += 0.01;
          box.rotation.y += 0.01;
          
          renderer.render(scene, camera);
          
          const processingTime = performance.now() - startTime;
          latencyHistory.current.push(processingTime);
          setLatency(processingTime.toFixed(1));
          setAccuracy("3D overlays - No tracking");
          
          animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animate();
      };
      
      document.body.appendChild(threeScript);
    })
    .catch(err => {
      console.error('Camera error:', err);
      setAccuracy('Camera access denied');
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
  }, [currentTest, testPhase]);

  // Timer
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
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold mb-3">
              📱 WebAR Research Platform
            </h1>
            <p className="text-blue-200 text-lg mb-2">
              Complete Technology Comparison for Vocational Training
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
              🧪 Test All Three Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => startTest("mediapipe-2d")}
                className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Option A</h3>
                  <span className="text-3xl">🖌️</span>
                </div>
                <h4 className="font-bold mb-2">MediaPipe + Canvas 2D</h4>
                <p className="text-sm opacity-90 mb-3">
                  Hand tracking with traditional 2D canvas rendering
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">FREE</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">21 Points</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">2D</span>
                </div>
                <p className="text-xs opacity-75">
                  ✓ Pose detection ✓ Position logging
                </p>
              </button>

              <button
                onClick={() => startTest("mediapipe-3d")}
                className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Option B</h3>
                  <span className="text-3xl">🎨</span>
                </div>
                <h4 className="font-bold mb-2">MediaPipe + Three.js</h4>
                <p className="text-sm opacity-90 mb-3">
                  Hand tracking with 3D WebGL graphics rendering
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">FREE</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">21 Points</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">3D</span>
                </div>
                <p className="text-xs opacity-75">
                  ✓ Pose detection ✓ 3D graphics
                </p>
              </button>

              <button
                onClick={() => startTest("threejs-only")}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Option C</h3>
                  <span className="text-3xl">📹</span>
                </div>
                <h4 className="font-bold mb-2">Three.js Only</h4>
                <p className="text-sm opacity-90 mb-3">
                  Camera feed with 3D overlays, no pose tracking
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">FREE</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">No Tracking</span>
                  <span className="bg-white/20 rounded-full px-2 py-1 text-xs">3D</span>
                </div>
                <p className="text-xs opacity-75">
                  ✓ Simple overlays only
                </p>
              </button>
            </div>

            <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>💡 Test Instructions:</strong> Each test runs for 20-30 seconds. 
                Move your hands naturally. Open console (F12) to see landmark data logs.
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
                          {testName === 'mediapipe-2d' && '🖌️ MediaPipe + Canvas 2D'}
                          {testName === 'mediapipe-3d' && '🎨 MediaPipe + Three.js 3D'}
                          {testName === 'threejs-only' && '📹 Three.js Only (No Tracking)'}
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
                  <h3 className="text-white font-bold text-lg mb-3">
                    🏆 Comparison Analysis
                  </h3>
                  {(() => {
                    const tests = Object.values(testData);
                    const sorted = [...tests].sort((a, b) => 
                      parseFloat(b.metrics.avgFps) - parseFloat(a.metrics.avgFps)
                    );
                    
                    return (
                      <div className="space-y-3">
                        <div className="bg-black/30 rounded-lg p-3">
                          <p className="text-green-300 font-semibold mb-2">Best Performance (FPS):</p>
                          <p className="text-white text-sm">
                            {sorted[0].testType === 'mediapipe-2d' && '🖌️ MediaPipe + Canvas 2D'}
                            {sorted[0].testType === 'mediapipe-3d' && '🎨 MediaPipe + Three.js'}
                            {sorted[0].testType === 'threejs-only' && '📹 Three.js Only'}
                            {' '}- {sorted[0].metrics.avgFps} FPS average
                          </p>
                        </div>
                        
                        {tests.find(t => t.testType.includes('mediapipe')) && (
                          <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-blue-300 font-semibold mb-2">Pose Detection:</p>
                            <p className="text-white text-sm">
                              {tests.filter(t => t.testType.includes('mediapipe')).map(t => 
                                `${t.testType === 'mediapipe-2d' ? '2D Canvas' : '3D Three.js'}: ${t.metrics.landmarkCount} samples`
                              ).join(' | ')}
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-black/30 rounded-lg p-3">
                          <p className="text-purple-300 font-semibold mb-2">Recommendation:</p>
                          <p className="text-white text-sm">
                            {(() => {
                              const mp2d = tests.find(t => t.testType === 'mediapipe-2d');
                              const mp3d = tests.find(t => t.testType === 'mediapipe-3d');
                              const tj = tests.find(t => t.testType === 'threejs-only');
                              
                              if (mp2d && mp3d) {
                                const fps2d = parseFloat(mp2d.metrics.avgFps);
                                const fps3d = parseFloat(mp3d.metrics.avgFps);
                                
                                if (fps2d > fps3d + 3) {
                                  return '🖌️ MediaPipe + Canvas 2D offers better performance with full hand tracking. Best for production.';
                                } else if (fps3d > fps2d) {
                                  return '🎨 MediaPipe + Three.js provides better visuals with acceptable performance. Good for immersive training.';
                                } else {
                                  return '🖌️ Both MediaPipe options perform similarly. Choose Canvas 2D for simpler code, Three.js for advanced 3D graphics.';
                                }
                              } else if (mp2d && tj) {
                                return '🖌️ MediaPipe + Canvas 2D recommended - includes essential hand tracking for healthcare training.';
                              } else if (mp3d && tj) {
                                return '🎨 MediaPipe + Three.js recommended - includes hand tracking with better visual appeal.';
                              }
                              return 'Run all three tests for complete comparison.';
                            })()}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-4">
            <h3 className="text-white text-xl font-bold mb-3">📋 Additional Options to Research</h3>
            <p className="text-gray-300 text-sm mb-3">
              These require manual testing with separate accounts/SDKs:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-1">8th Wall</h4>
                <p className="text-gray-400 text-xs mb-2">~$100/month • Professional WebAR platform</p>
                <p className="text-blue-300 text-xs">✓ Image tracking ✓ World effects ✓ Face tracking</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-1">Zappar</h4>
                <p className="text-gray-400 text-xs mb-2">Free tier available • Marker-based AR</p>
                <p className="text-blue-300 text-xs">✓ QR/Marker tracking ✓ Face tracking</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-1">WebXR Device API</h4>
                <p className="text-gray-400 text-xs mb-2">FREE • Native browser standard</p>
                <p className="text-yellow-300 text-xs">⚠️ Limited iOS Safari support</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <h4 className="text-white font-semibold mb-1">AR.js</h4>
                <p className="text-gray-400 text-xs mb-2">FREE • Open source</p>
                <p className="text-blue-300 text-xs">✓ Marker-based ⚠️ No pose detection</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-blue-200">
            <p>🎯 Goal: Find the best WebAR solution for vocational healthcare training</p>
            <p className="text-xs mt-2 text-blue-300">Test all three options above on both iOS Safari and Android Chrome</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="text-center mb-4">
        <h1 className="text-white text-2xl font-bold mb-2">
          {currentTest === 'mediapipe-2d' && '🖌️ Testing: MediaPipe + Canvas 2D'}
          {currentTest === 'mediapipe-3d' && '🎨 Testing: MediaPipe + Three.js 3D'}
          {currentTest === 'threejs-only' && '📹 Testing: Three.js Only'}
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
          className={currentTest === 'threejs-only' ? 'rounded-2xl border-4 border-blue-400 shadow-2xl' : 'hidden'}
          width="640"
          height="480"
          autoPlay
          playsInline
        ></video>
        
        {currentTest !== 'threejs-only' && (
          <canvas
            ref={canvasRef}
            className="rounded-2xl border-4 border-blue-400 shadow-2xl"
            width="640"
            height="480"
          ></canvas>
        )}
        
        <div 
          ref={threeContainerRef}
          className="absolute top-0 left-0 rounded-2xl overflow-hidden"
          style={{ 
            pointerEvents: 'none',
            width: '640px',
            height: '480px'
          }}
        ></div>

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
                {currentTest.includes('mediapipe') 
                  ? `👋 Move your hands naturally. ${currentTest === 'mediapipe-2d' ? '2D lines' : '3D spheres'} should track movements!`
                  : '📍 See the 3D overlays? Move around to test smoothness.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Test Details */}
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-bold mb-3">
            {currentTest === 'mediapipe-2d' && '🖌️ Canvas 2D Rendering Test'}
            {currentTest === 'mediapipe-3d' && '🎨 Three.js 3D Rendering Test'}
            {currentTest === 'threejs-only' && '📹 Basic Overlay Test'}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            {currentTest === 'mediapipe-2d' ? (
              <>
                <p>✓ Green lines drawn with 2D Canvas API</p>
                <p>✓ Pink dots mark 21 hand landmarks</p>
                <p>✓ Traditional 2D rendering (fastest)</p>
                <p>✓ Positions logged to console every 0.5s</p>
              </>
            ) : currentTest === 'mediapipe-3d' ? (
              <>
                <p>✓ Cyan/magenta 3D spheres using Three.js</p>
                <p>✓ Green 3D lines connecting landmarks</p>
                <p>✓ WebGL rendering (more GPU intensive)</p>
                <p>✓ Positions logged to console every 0.5s</p>
              </>
            ) : (
              <>
                <p>✓ 3D cone arrow (animated movement)</p>
                <p>✓ 3D wireframe box (rotating)</p>
                <p>✓ Text sprite overlay</p>
                <p>✓ No tracking - just graphics performance</p>
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

        {/* Comparison Info */}
        <div className="mt-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-2 text-sm">🔍 What We're Comparing:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• <strong>Canvas 2D:</strong> Simple, fast, traditional drawing API</li>
            <li>• <strong>Three.js 3D:</strong> Advanced WebGL, better visuals, more GPU load</li>
            <li>• <strong>Three.js Only:</strong> Baseline performance without tracking overhead</li>
            <li>• <strong>Key Question:</strong> Is 3D worth the performance cost?</li>
          </ul>
        </div>

        {/* Console Log Info */}
        {currentTest.includes('mediapipe') && (
          <div className="mt-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
            <p className="text-yellow-200 text-xs">
              💡 <strong>Console logging active:</strong> Open browser console (F12) to see hand landmark coordinates. 
              This data is essential for AI training in phase 2!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}