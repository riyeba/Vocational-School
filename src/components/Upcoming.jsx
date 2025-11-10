

// import React, { useEffect, useRef, useState } from "react";

// export default function GreenLeafEvents() {
//   // Refs
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const threeContainerRef = useRef(null);
//   const stepIndexRef = useRef(0);
//   const lastFrameCaptureRef = useRef(0);
//   const cameraRef = useRef(null);
//   const handsRef = useRef(null);
//   const streamRef = useRef(null);
//   const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now(), samples: [] });
//   const latencySamplesRef = useRef([]);
//   const frameDropCounterRef = useRef(0);
//   const testStartTimeRef = useRef(0);
//   const threeSceneRef = useRef(null);
//   const threeRendererRef = useRef(null);
//   const threeCameraRef = useRef(null);
//   const threeObjectsRef = useRef([]);
//   const animationFrameRef = useRef(null);

//   // State
//   const [mode, setMode] = useState("menu");
//   const [arTestMode, setArTestMode] = useState(null);
//   const [stepIndex, setStepIndex] = useState(0);
//   const [stepText, setStepText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [latency, setLatency] = useState(0);
//   const [testResults, setTestResults] = useState([]);

//   // Training data
//   const trainingModes = {
//     handwashing: [
//       { text: "Step 1: Wet hands and apply soap", instruction: "Turn on water, wet both hands thoroughly, then apply soap.", gesture: "palms_together" },
//       { text: "Step 2: Rub palms together", instruction: "Place both palms together and rub in circular motion.", gesture: "palms_together" },
//       { text: "Step 3: Rub back of hands", instruction: "Place one palm on back of other hand and rub.", gesture: "back_of_hands" },
//       { text: "✅ Training Complete!", instruction: "Great job!", gesture: "complete" }
//     ]
//   };

//   // Helper Functions
//   const getDeviceInfo = () => {
//     const ua = navigator.userAgent;
//     const isIOS = /iPhone|iPad|iPod/.test(ua);
//     const isAndroid = /Android/.test(ua);
//     const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
//     const isChrome = /Chrome/.test(ua);
//     return {
//       platform: isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop',
//       browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other',
//       userAgent: ua
//     };
//   };

//   const updateFPS = () => {
//     const now = Date.now();
//     fpsCounterRef.current.frames++;
//     if (now - fpsCounterRef.current.lastTime >= 1000) {
//       const currentFps = fpsCounterRef.current.frames;
//       setFps(currentFps);
//       fpsCounterRef.current.samples.push(currentFps);
//       if (fpsCounterRef.current.samples.length > 30) fpsCounterRef.current.samples.shift();
//       if (currentFps < 25) frameDropCounterRef.current++;
//       fpsCounterRef.current.frames = 0;
//       fpsCounterRef.current.lastTime = now;
//     }
//   };

//   const calculateMetrics = () => {
//     const avgFps = fpsCounterRef.current.samples.length > 0 ? fpsCounterRef.current.samples.reduce((a, b) => a + b, 0) / fpsCounterRef.current.samples.length : 0;
//     const avgLatency = latencySamplesRef.current.length > 0 ? latencySamplesRef.current.reduce((a, b) => a + b, 0) / latencySamplesRef.current.length : 0;
//     const testDuration = (Date.now() - testStartTimeRef.current) / 1000;
//     const cameraQuality = avgFps >= 28 ? 'Excellent' : avgFps >= 24 ? 'Good' : avgFps >= 20 ? 'Fair' : 'Poor';
//     const overlayResponsiveness = avgLatency <= 100 ? 'Excellent' : avgLatency <= 200 ? 'Good' : avgLatency <= 400 ? 'Fair' : 'Poor';
//     return { 
//       avgFps: avgFps.toFixed(1), 
//       avgLatency: avgLatency.toFixed(0), 
//       frameDrops: frameDropCounterRef.current, 
//       cameraQuality, 
//       overlayResponsiveness, 
//       testDuration: testDuration.toFixed(1) 
//     };
//   };

//   const saveTestResults = (arTech) => {
//     const metrics = calculateMetrics();
//     const deviceInfo = getDeviceInfo();
//     const result = {
//       technology: arTech,
//       timestamp: new Date().toISOString(),
//       device: deviceInfo,
//       metrics: metrics,
//       verdict: {
//         smoothness: metrics.avgFps >= 25 ? 'Smooth' : 'Choppy',
//         responsiveness: metrics.avgLatency <= 200 ? 'Fast' : 'Slow',
//         stability: metrics.frameDrops <= 5 ? 'Stable' : 'Unstable'
//       }
//     };
//     setTestResults(prev => [...prev, result]);
//     console.log('=== AR TEST RESULTS ===');
//     console.log('Technology:', arTech);
//     console.log('Device:', deviceInfo);
//     console.log('Metrics:', metrics);
//     console.log('=====================');
//     return result;
//   };

//   const startARTest = (techType) => {
//     setArTestMode(techType);
//     setMode("handwashing");
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setStepText(trainingModes.handwashing[0].text);
//     setFeedback("Starting AR test...");
//     fpsCounterRef.current = { frames: 0, lastTime: Date.now(), samples: [] };
//     latencySamplesRef.current = [];
//     frameDropCounterRef.current = 0;
//     testStartTimeRef.current = Date.now();
//   };

//   const finishTest = () => {
//     const results = saveTestResults(arTestMode);
//     alert(`Test Complete!\n\nAvg FPS: ${results.metrics.avgFps}\nAvg Latency: ${results.metrics.avgLatency}ms\nCamera: ${results.metrics.cameraQuality}\nResponsiveness: ${results.metrics.overlayResponsiveness}`);
//   };

//   const returnToMenu = () => {
//     if (arTestMode) finishTest();
//     if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
//     if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
//     if (handsRef.current && handsRef.current.close) handsRef.current.close();
//     if (streamRef.current) { 
//       streamRef.current.getTracks().forEach(track => track.stop()); 
//       streamRef.current = null; 
//     }
//     if (threeRendererRef.current) { 
//       threeRendererRef.current.dispose(); 
//       threeRendererRef.current = null; 
//     }
//     setMode("menu");
//     setArTestMode(null);
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setStepText("");
//     setFeedback("");
//   };

//   const exportResults = () => {
//     const deviceInfo = getDeviceInfo();
//     const report = { 
//       testDate: new Date().toISOString(), 
//       device: deviceInfo, 
//       results: testResults, 
//       comparison: compareResults() 
//     };
//     const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `ar-test-results-${Date.now()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const compareResults = () => {
//     if (testResults.length < 2) return null;
//     const comparison = { winner: null, reasons: [] };
//     const mediapipeResult = testResults.find(r => r.technology === 'mediapipe');
//     const threejsResult = testResults.find(r => r.technology === 'threejs');
//     if (mediapipeResult && threejsResult) {
//       const mpFps = parseFloat(mediapipeResult.metrics.avgFps);
//       const tjFps = parseFloat(threejsResult.metrics.avgFps);
//       if (mpFps > tjFps) {
//         comparison.reasons.push(`MediaPipe has higher FPS (${mpFps} vs ${tjFps})`);
//         comparison.winner = 'MediaPipe';
//       } else {
//         comparison.reasons.push(`Three.js has higher FPS (${tjFps} vs ${mpFps})`);
//         comparison.winner = 'Three.js';
//       }
//     }
//     return comparison;
//   };

//   // MEDIAPIPE IMPLEMENTATION
//   useEffect(() => {
//     if (mode === "menu" || arTestMode !== 'mediapipe') return;

//     const videoElement = videoRef.current;
//     const canvasElement = canvasRef.current;
//     const canvasCtx = canvasElement.getContext("2d");
//     let scriptsLoaded = false;

//     const script1 = document.createElement("script");
//     const script2 = document.createElement("script");
//     const script3 = document.createElement("script");
    
//     script1.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
//     script2.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
//     script3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

//     script1.onload = () => {
//       script2.onload = () => {
//         script3.onload = () => {
//           if (scriptsLoaded) return;
//           scriptsLoaded = true;

//           const hands = new window.Hands({
//             locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
//           });

//           hands.setOptions({
//             maxNumHands: 2,
//             modelComplexity: 1,
//             minDetectionConfidence: 0.7,
//             minTrackingConfidence: 0.7
//           });

//           hands.onResults((results) => {
//             const startTime = performance.now();
//             updateFPS();
            
//             canvasCtx.save();
//             canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//             canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

//             if (results.multiHandLandmarks) {
//               for (const landmarks of results.multiHandLandmarks) {
//                 const connections = [
//                   [0,1],[1,2],[2,3],[3,4],
//                   [0,5],[5,6],[6,7],[7,8],
//                   [0,9],[9,10],[10,11],[11,12],
//                   [0,13],[13,14],[14,15],[15,16],
//                   [0,17],[17,18],[18,19],[19,20],
//                   [5,9],[9,13],[13,17]
//                 ];
                
//                 canvasCtx.strokeStyle = "rgba(0, 200, 255, 0.7)";
//                 canvasCtx.lineWidth = 2;
//                 for (const [start, end] of connections) {
//                   canvasCtx.beginPath();
//                   canvasCtx.moveTo(
//                     landmarks[start].x * canvasElement.width,
//                     landmarks[start].y * canvasElement.height
//                   );
//                   canvasCtx.lineTo(
//                     landmarks[end].x * canvasElement.width,
//                     landmarks[end].y * canvasElement.height
//                   );
//                   canvasCtx.stroke();
//                 }
                
//                 canvasCtx.fillStyle = "rgba(0, 255, 100, 0.9)";
//                 for (const point of landmarks) {
//                   canvasCtx.beginPath();
//                   canvasCtx.arc(
//                     point.x * canvasElement.width,
//                     point.y * canvasElement.height,
//                     4,
//                     0,
//                     2 * Math.PI
//                   );
//                   canvasCtx.fill();
//                 }
//               }
//             }

//             const processingTime = performance.now() - startTime;
//             latencySamplesRef.current.push(processingTime);
//             if (latencySamplesRef.current.length > 20) latencySamplesRef.current.shift();
//             setLatency(processingTime.toFixed(1));

//             canvasCtx.restore();
//           });

//           handsRef.current = hands;

//           const camera = new window.Camera(videoElement, {
//             onFrame: async () => {
//               await hands.send({ image: videoElement });
//             },
//             width: 640,
//             height: 480
//           });
          
//           cameraRef.current = camera;
//           camera.start();
//         };
//         document.body.appendChild(script3);
//       };
//       document.body.appendChild(script2);
//     };
//     document.body.appendChild(script1);

//     return () => {
//       if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop();
//       if (handsRef.current && handsRef.current.close) handsRef.current.close();
//     };
//   }, [mode, arTestMode]);

//   // THREE.JS IMPLEMENTATION
//   useEffect(() => {
//     if (mode === "menu" || arTestMode !== 'threejs') return;

//     const videoElement = videoRef.current;
//     const container = threeContainerRef.current;

//     const threeScript = document.createElement("script");
//     threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    
//     threeScript.onload = () => {
//       const THREE = window.THREE;
//       console.log('✅ Three.js loaded successfully');
//       console.log('Three.js version:', THREE.REVISION);
      
//       navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: 'user',
//           width: { ideal: 640 },
//           height: { ideal: 480 }
//         } 
//       })
//       .then(stream => {
//         streamRef.current = stream;
//         videoElement.srcObject = stream;
//         videoElement.play();
//         console.log('✅ Camera feed started');
        
//         // Create WebGL Renderer
//         const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//         renderer.setSize(640, 480);
//         renderer.setClearColor(0x000000, 0);
//         container.appendChild(renderer.domElement);
//         threeRendererRef.current = renderer;
//         console.log('✅ WebGL Renderer created');
        
//         // Build 3D Scene
//         const scene = new THREE.Scene();
//         threeSceneRef.current = scene;
        
//         const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
//         camera.position.z = 3;
//         threeCameraRef.current = camera;
//         console.log('✅ 3D Scene and Camera created');
        
//         // Create 3D Meshes
        
//         // 1. Rotating Cube
//         const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
//         const cubeMaterial = new THREE.MeshBasicMaterial({ 
//           color: 0x00ff00,
//           wireframe: true,
//           transparent: true,
//           opacity: 0.8
//         });
//         const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//         cube.position.set(-1.2, 0, 0);
//         scene.add(cube);
        
//         // 2. Pulsing Sphere
//         const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
//         const sphereMaterial = new THREE.MeshBasicMaterial({ 
//           color: 0xff6600,
//           transparent: true,
//           opacity: 0.7
//         });
//         const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//         sphere.position.set(1.2, 0, 0);
//         scene.add(sphere);
        
//         // 3. Animated Arrow
//         const arrowGroup = new THREE.Group();
        
//         const arrowShaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 32);
//         const arrowShaftMaterial = new THREE.MeshBasicMaterial({ color: 0x0099ff });
//         const arrowShaft = new THREE.Mesh(arrowShaftGeometry, arrowShaftMaterial);
//         arrowShaft.rotation.z = Math.PI / 2;
//         arrowGroup.add(arrowShaft);
        
//         const arrowHeadGeometry = new THREE.ConeGeometry(0.15, 0.3, 32);
//         const arrowHeadMaterial = new THREE.MeshBasicMaterial({ color: 0x0099ff });
//         const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
//         arrowHead.rotation.z = -Math.PI / 2;
//         arrowHead.position.x = 0.45;
//         arrowGroup.add(arrowHead);
        
//         arrowGroup.position.set(0, -0.8, 0);
//         scene.add(arrowGroup);
        
//         // 4. 3D Text Plane
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.width = 512;
//         canvas.height = 128;
//         context.fillStyle = 'rgba(255, 255, 255, 0.9)';
//         context.fillRect(0, 0, canvas.width, canvas.height);
//         context.fillStyle = 'black';
//         context.font = 'bold 40px Arial';
//         context.textAlign = 'center';
//         context.fillText('Place Hands Here', 256, 80);
        
//         const texture = new THREE.CanvasTexture(canvas);
//         const planeMaterial = new THREE.MeshBasicMaterial({ 
//           map: texture,
//           transparent: true,
//           side: THREE.DoubleSide
//         });
//         const planeGeometry = new THREE.PlaneGeometry(2, 0.5);
//         const textPlane = new THREE.Mesh(planeGeometry, planeMaterial);
//         textPlane.position.set(0, 1.2, 0);
//         scene.add(textPlane);
        
//         // 5. Particle System
//         const particlesGeometry = new THREE.BufferGeometry();
//         const particlesCount = 100;
//         const positions = new Float32Array(particlesCount * 3);
        
//         for (let i = 0; i < particlesCount * 3; i++) {
//           positions[i] = (Math.random() - 0.5) * 5;
//         }
        
//         particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//         const particlesMaterial = new THREE.PointsMaterial({
//           color: 0xffffff,
//           size: 0.05,
//           transparent: true,
//           opacity: 0.6
//         });
//         const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//         scene.add(particles);
        
//         threeObjectsRef.current = { cube, sphere, arrowGroup, textPlane, particles };
//         console.log('✅ 3D Meshes created and added to scene');
        
//         // Render Loop with WebGL
//         const animate = () => {
//           if (arTestMode !== 'threejs' || mode === 'menu') return;
          
//           const renderStartTime = performance.now();
//           updateFPS();
          
//           const time = Date.now() * 0.001;
          
//           // Animate objects
//           cube.rotation.x += 0.02;
//           cube.rotation.y += 0.02;
          
//           const pulseScale = 1 + Math.sin(time * 3) * 0.2;
//           sphere.scale.set(pulseScale, pulseScale, pulseScale);
          
//           arrowGroup.position.y = -0.8 + Math.sin(time * 2) * 0.15;
          
//           textPlane.rotation.y = Math.sin(time * 0.5) * 0.1;
          
//           particles.rotation.y += 0.001;
//           const positions = particles.geometry.attributes.position.array;
//           for (let i = 1; i < positions.length; i += 3) {
//             positions[i] += Math.sin(time + i) * 0.001;
//           }
//           particles.geometry.attributes.position.needsUpdate = true;
          
//           // Render with WebGL
//           renderer.render(scene, camera);
          
//           const renderEndTime = performance.now();
//           const renderLatency = renderEndTime - renderStartTime;
          
//           latencySamplesRef.current.push(renderLatency);
//           if (latencySamplesRef.current.length > 20) latencySamplesRef.current.shift();
//           setLatency(renderLatency.toFixed(1));
          
//           animationFrameRef.current = requestAnimationFrame(animate);
//         };
        
//         animate();
//         console.log('✅ Animation loop started');
        
//       })
//       .catch(err => {
//         console.error('❌ Camera error:', err);
//         setFeedback('Camera access denied');
//       });
//     };
    
//     threeScript.onerror = () => {
//       console.error('❌ Failed to load Three.js');
//       setFeedback('Failed to load Three.js library');
//     };
    
//     document.body.appendChild(threeScript);

//     return () => {
//       if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//       }
//       if (threeRendererRef.current) {
//         const rendererElement = threeRendererRef.current.domElement;
//         if (rendererElement && rendererElement.parentNode) {
//           rendererElement.parentNode.removeChild(rendererElement);
//         }
//         threeRendererRef.current.dispose();
//         threeRendererRef.current = null;
//       }
//       console.log('✅ Three.js cleanup complete');
//     };
//   }, [mode, arTestMode]);

//   // RENDER - MENU UI
//   if (mode === "menu") {
//     const deviceInfo = getDeviceInfo();
    
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//         <div className="text-center mb-6">
//           <h1 className="text-white text-4xl font-bold mb-2">
//             🎯 Proper Three.js WebAR Test
//           </h1>
//           <p className="text-blue-200 text-lg">
//             Real WebGL 3D Rendering vs MediaPipe
//           </p>
//           <div className="mt-3 bg-blue-800/50 rounded-lg px-4 py-2 inline-block">
//             <p className="text-white text-sm">
//               📱 {deviceInfo.platform} • {deviceInfo.browser}
//             </p>
//           </div>
//         </div>

//         <div className="max-w-5xl w-full mb-6">
//           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//             <h2 className="text-white text-2xl font-bold mb-4">
//               🧪 Compare Technologies
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <button
//                 onClick={() => startARTest('mediapipe')}
//                 className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
//               >
//                 <h3 className="text-xl font-bold mb-2">Option A: MediaPipe + 2D Canvas</h3>
//                 <p className="text-sm opacity-90 mb-3">
//                   Hand tracking with traditional Canvas 2D API
//                 </p>
//                 <div className="flex gap-2 flex-wrap mb-3">
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">Hand Tracking</span>
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">2D Canvas</span>
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">FREE</span>
//                 </div>
//                 <p className="text-xs opacity-75 bg-black/30 rounded p-2">
//                   ✓ Uses Canvas 2D fillRect() and arc()<br/>
//                   ✓ CPU rendering<br/>
//                   ✓ 21 landmark points
//                 </p>
//               </button>

//               <button
//                 onClick={() => startARTest('threejs')}
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left"
//               >
//                 <h3 className="text-xl font-bold mb-2">Option B: Three.js + WebGL 3D</h3>
//                 <p className="text-sm opacity-90 mb-3">
//                   Real 3D graphics with WebGL renderer
//                 </p>
//                 <div className="flex gap-2 flex-wrap mb-3">
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">WebGL</span>
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">3D Meshes</span>
//                   <span className="bg-white/20 rounded-full px-3 py-1 text-xs">FREE</span>
//                 </div>
//                 <p className="text-xs opacity-75 bg-black/30 rounded p-2">
//                   ✓ Uses THREE.WebGLRenderer<br/>
//                   ✓ GPU accelerated<br/>
//                   ✓ Real 3D objects (cube, sphere, particles)
//                 </p>
//               </button>
//             </div>

//             <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
//               <p className="text-yellow-200 text-sm">
//                 <strong>💡 What's Different:</strong> This time, Three.js actually loads the library and renders with WebGL! 
//                 Check browser console to see "Three.js loaded successfully" message.
//               </p>
//             </div>
//           </div>
//         </div>

//         {testResults.length > 0 && (
//           <div className="max-w-5xl w-full mb-6">
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-white text-2xl font-bold">📊 Test Results</h2>
//                 <button
//                   onClick={exportResults}
//                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
//                 >
//                   📥 Export JSON
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 {testResults.map((result, idx) => (
//                   <div key={idx} className="bg-black/30 rounded-xl p-4 border border-white/10">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <h3 className="text-white font-bold text-lg">
//                           {result.technology === 'mediapipe' ? '🔵 MediaPipe + Canvas 2D' : '🟣 Three.js + WebGL'}
//                         </h3>
//                         <p className="text-blue-300 text-xs">
//                           {new Date(result.timestamp).toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           result.verdict.smoothness === 'Smooth' 
//                             ? 'bg-green-500/30 text-green-200' 
//                             : 'bg-red-500/30 text-red-200'
//                         }`}>
//                           {result.verdict.smoothness}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       <div className="bg-blue-500/20 rounded-lg p-3">
//                         <p className="text-blue-300 text-xs mb-1">Avg FPS</p>
//                         <p className="text-white text-xl font-bold">{result.metrics.avgFps}</p>
//                       </div>
//                       <div className="bg-purple-500/20 rounded-lg p-3">
//                         <p className="text-purple-300 text-xs mb-1">Avg Latency</p>
//                         <p className="text-white text-xl font-bold">{result.metrics.avgLatency}ms</p>
//                       </div>
//                       <div className="bg-green-500/20 rounded-lg p-3">
//                         <p className="text-green-300 text-xs mb-1">Camera Quality</p>
//                         <p className="text-white text-sm font-bold">{result.metrics.cameraQuality}</p>
//                       </div>
//                       <div className="bg-orange-500/20 rounded-lg p-3">
//                         <p className="text-orange-300 text-xs mb-1">Frame Drops</p>
//                         <p className="text-white text-xl font-bold">{result.metrics.frameDrops}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {testResults.length >= 2 && (() => {
//                 const comparison = compareResults();
//                 return comparison && (
//                   <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4">
//                     <h3 className="text-white font-bold text-lg mb-2">
//                       🏆 Winner: {comparison.winner}
//                     </h3>
//                     <ul className="space-y-1">
//                       {comparison.reasons.map((reason, idx) => (
//                         <li key={idx} className="text-green-200 text-sm">
//                           • {reason}
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="mt-3 bg-black/30 rounded-lg p-3">
//                       <p className="text-white text-sm">
//                         <strong>Analysis:</strong> {comparison.winner === 'MediaPipe' 
//                           ? 'MediaPipe performs better despite hand tracking overhead, thanks to efficient 2D Canvas rendering.' 
//                           : 'Three.js WebGL rendering is surprisingly efficient! 3D graphics may be worth the visual upgrade.'}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           </div>
//         )}

//         <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 max-w-5xl w-full">
//           <h3 className="text-white font-bold mb-2">🔍 Technical Details</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
//             <div className="bg-black/30 rounded p-3">
//               <p className="text-blue-300 font-semibold mb-1">MediaPipe Implementation:</p>
//               <p className="text-gray-300 text-xs">• Loads MediaPipe Hands library</p>
//               <p className="text-gray-300 text-xs">• Uses Canvas 2D context</p>
//               <p className="text-gray-300 text-xs">• Draws with ctx.fillRect(), ctx.arc()</p>
//               <p className="text-gray-300 text-xs">• CPU-based rendering</p>
//             </div>
//             <div className="bg-black/30 rounded p-3">
//               <p className="text-purple-300 font-semibold mb-1">Three.js Implementation:</p>
//               <p className="text-gray-300 text-xs">• Loads Three.js r128 library</p>
//               <p className="text-gray-300 text-xs">• Creates WebGLRenderer</p>
//               <p className="text-gray-300 text-xs">• Builds 3D scene with meshes</p>
//               <p className="text-gray-300 text-xs">• GPU-accelerated rendering</p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 text-center">
//           <p className="text-blue-200 text-sm">
//             📋 Open browser console (F12) to see detailed Three.js loading logs
//           </p>
//           <p className="text-blue-300 text-xs mt-2">
//             {deviceInfo.platform} • {deviceInfo.browser} • WebAR Performance Testing
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // RENDER - TEST UI
//   const steps = trainingModes[mode];

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//       <div className="text-center mb-3">
//         <h1 className="text-white text-2xl font-bold mb-1">
//           {arTestMode === 'mediapipe' && '🔵 Testing: MediaPipe + Canvas 2D'}
//           {arTestMode === 'threejs' && '🟣 Testing: Three.js + WebGL'}
//         </h1>
//         <button
//           onClick={returnToMenu}
//           className="text-blue-300 text-sm hover:text-blue-100 underline"
//         >
//           ← Finish Test & View Results
//         </button>
//       </div>
      
//       <div className="relative">
//         <video
//           ref={videoRef}
//           className={arTestMode === 'threejs' ? 'rounded-2xl border-4 border-purple-400 shadow-2xl' : 'hidden'}
//           width="640"
//           height="480"
//           autoPlay
//           playsInline
//         ></video>
        
//         {arTestMode === 'mediapipe' && (
//           <canvas
//             ref={canvasRef}
//             className="rounded-2xl border-4 border-blue-400 shadow-2xl"
//             width="640"
//             height="480"
//           ></canvas>
//         )}
        
//         <div 
//           ref={threeContainerRef}
//           className="absolute top-0 left-0 rounded-2xl overflow-hidden"
//           style={{ 
//             pointerEvents: 'none',
//             width: '640px',
//             height: '480px'
//           }}
//         ></div>

//         <div className="absolute top-2 right-2 bg-black/90 rounded-lg px-3 py-2 text-xs space-y-1 border border-white/20">
//           <div className="text-green-400 font-bold">FPS: {fps}</div>
//           <div className="text-blue-400">Latency: {latency}ms</div>
//           <div className="text-purple-400">Drops: {frameDropCounterRef.current}</div>
//           <div className={`font-semibold ${fps >= 25 ? 'text-green-400' : 'text-red-400'}`}>
//             {fps >= 25 ? '✓ Smooth' : '⚠ Choppy'}
//           </div>
//           <div className="text-yellow-300 text-xs mt-2 pt-2 border-t border-white/20">
//             {arTestMode === 'mediapipe' ? '2D Canvas' : 'WebGL 3D'}
//           </div>
//         </div>

//         <div className="absolute top-4 left-4 right-4">
//           <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
//             <div className="flex justify-between mb-2">
//               {steps.slice(0, -1).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className={`h-2 flex-1 mx-1 rounded-full transition-all ${
//                     idx < stepIndex
//                       ? "bg-green-400"
//                       : idx === stepIndex
//                       ? "bg-blue-400 animate-pulse"
//                       : "bg-gray-600"
//                   }`}
//                 />
//               ))}
//             </div>
//             <p className="text-white text-sm font-semibold text-center">
//               {stepText}
//             </p>
//           </div>
//         </div>

//         <div className="absolute top-4 left-4">
//           <div className="bg-black/80 rounded-lg px-3 py-2 border border-white/20">
//             <p className={`text-xs font-semibold ${arTestMode === 'mediapipe' ? 'text-blue-300' : 'text-purple-300'}`}>
//               {arTestMode === 'mediapipe' ? '🖌️ Canvas 2D API' : '🎨 WebGL Renderer'}
//             </p>
//             <p className="text-white text-xs">
//               {arTestMode === 'mediapipe' ? 'CPU Rendering' : 'GPU Accelerated'}
//             </p>
//           </div>
//         </div>

//         <div className="absolute bottom-4 left-4 right-4">
//           <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
//             <p className="text-white text-sm font-medium text-center">
//               {arTestMode === 'mediapipe' 
//                 ? '👋 Move your hands - watch green lines track your movements!' 
//                 : '🎨 See 3D objects? Cube, sphere, arrow, particles all rendered with WebGL!'}
//             </p>
//           </div>
//         </div>

//         {isProcessing && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
//             <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
//               <p className="text-white font-semibold">🔄 Processing...</p>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="mt-4 max-w-2xl w-full">
//         <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//           <h3 className="text-white font-bold mb-3">
//             {arTestMode === 'mediapipe' ? '🔵 What You\'re Seeing' : '🟣 What You\'re Seeing'}
//           </h3>
          
//           <div className="space-y-2 text-sm text-gray-300">
//             {arTestMode === 'mediapipe' ? (
//               <>
//                 <p>✓ <strong>Camera feed</strong> drawn to Canvas</p>
//                 <p>✓ <strong>Green lines</strong> connecting hand joints (Canvas 2D)</p>
//                 <p>✓ <strong>Pink dots</strong> marking 21 landmarks (Canvas 2D)</p>
//                 <p>✓ <strong>CPU rendering</strong> - using ctx.stroke() and ctx.fill()</p>
//               </>
//             ) : (
//               <>
//                 <p>✓ <strong>Camera feed</strong> as video background</p>
//                 <p>✓ <strong>Green wireframe cube</strong> rotating (THREE.Mesh)</p>
//                 <p>✓ <strong>Orange sphere</strong> pulsing (THREE.Mesh)</p>
//                 <p>✓ <strong>Blue arrow</strong> animating up/down (THREE.Group)</p>
//                 <p>✓ <strong>White particles</strong> floating (THREE.Points)</p>
//                 <p>✓ <strong>Text label</strong> on 3D plane (THREE.CanvasTexture)</p>
//                 <p>✓ <strong>GPU rendering</strong> - using THREE.WebGLRenderer</p>
//               </>
//             )}
//           </div>

//           <div className="mt-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
//             <p className="text-yellow-200 text-xs">
//               <strong>💡 Check Console:</strong> Open browser DevTools (F12) to see {arTestMode === 'threejs' ? 'Three.js loading logs and version number' : 'MediaPipe initialization messages'}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 text-center">
//         <p className="text-blue-200 text-sm">
//           Testing {arTestMode === 'mediapipe' ? 'MediaPipe + 2D Canvas' : 'Three.js + WebGL'} • Run for 20-30 seconds
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const HANDWASHING_STEPS = [
  { step: 1, instruction: "Wet your hands with clean water", duration: 3 },
  { step: 2, instruction: "Apply soap - rub palms together", duration: 5 },
  { step: 3, instruction: "Rub backs of hands with fingers interlaced", duration: 5 },
  { step: 4, instruction: "Rub between fingers - palms facing", duration: 5 },
  { step: 5, instruction: "Rub thumbs in circular motion", duration: 5 },
  { step: 6, instruction: "Rinse thoroughly with clean water", duration: 5 }
];

export default function GreenLeaveEvents() {
  const [isARActive, setIsARActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [fps, setFps] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [arSupported, setArSupported] = useState(false);
  
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const arrowRef = useRef(null);
  const stepStartTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  // Check WebXR support
  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setArSupported(supported);
        if (!supported) {
          setErrorMsg('WebXR AR not supported. This works best on Android Chrome. iOS Safari has limited support.');
        }
      }).catch(() => {
        setArSupported(false);
        setErrorMsg('Could not check AR support. Try on a mobile device with Chrome or Safari.');
      });
    } else {
      setErrorMsg('WebXR not available. Please use a modern mobile browser (Chrome on Android recommended).');
    }
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // Create AR guide arrow
    const arrowGroup = createARArrow();
    arrowGroup.position.set(0, 1.4, -0.8);
    scene.add(arrowGroup);
    arrowRef.current = arrowGroup;

    // Add instruction text
    const textMesh = createTextPlane('Position hands here');
    textMesh.position.set(0, 1.6, -0.8);
    scene.add(textMesh);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      renderer.setAnimationLoop(() => {
        // Update FPS
        frameCountRef.current++;
        const now = performance.now();
        if (now >= lastFpsTimeRef.current + 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsTimeRef.current = now;
        }

        // Animate arrow (bobbing motion)
        if (arrowRef.current) {
          arrowRef.current.rotation.y += 0.02;
          arrowRef.current.position.y = 1.4 + Math.sin(Date.now() * 0.002) * 0.05;
        }

        // Update step progress
        if (isARActive && stepStartTimeRef.current) {
          const elapsed = (Date.now() - stepStartTimeRef.current) / 1000;
          const duration = HANDWASHING_STEPS[currentStep].duration;
          const progress = Math.min((elapsed / duration) * 100, 100);
          setStepProgress(progress);

          if (progress >= 100) {
            advanceStep();
          }
        }

        renderer.render(scene, camera);
      });
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isARActive, currentStep]);

  // Create 3D arrow
  function createARArrow() {
    const group = new THREE.Group();

    // Arrow shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16);
    const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.x = Math.PI / 2;
    group.add(shaft);

    // Arrow head
    const headGeometry = new THREE.ConeGeometry(0.05, 0.1, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.z = -0.2;
    head.rotation.x = Math.PI / 2;
    group.add(head);

    return group;
  }

  // Create text plane (simplified - in production use TextGeometry or canvas texture)
  function createTextPlane(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = 'white';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true 
    });
    const geometry = new THREE.PlaneGeometry(1, 0.25);
    
    return new THREE.Mesh(geometry, material);
  }

  // Start AR session
  async function startAR() {
    if (!rendererRef.current) return;

    try {
      const renderer = rendererRef.current;
      
      // Request AR session
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });

      await renderer.xr.setSession(session);
      
      setIsARActive(true);
      setCurrentStep(0);
      stepStartTimeRef.current = Date.now();
      setErrorMsg('');

      session.addEventListener('end', () => {
        setIsARActive(false);
        stepStartTimeRef.current = 0;
      });

    } catch (error) {
      console.error('AR Error:', error);
      setErrorMsg(`Failed to start AR: ${error.message}. Try using Chrome on Android.`);
    }
  }

  // Advance to next step
  function advanceStep() {
    if (currentStep < HANDWASHING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      stepStartTimeRef.current = Date.now();
      setStepProgress(0);
    } else {
      completeTraining();
    }
  }

  // Complete training
  function completeTraining() {
    setIsARActive(false);
    alert('Training Complete! Great job! 🎉');
    setCurrentStep(0);
    setStepProgress(0);
    stepStartTimeRef.current = 0;
  }

  const currentStepData = HANDWASHING_STEPS[currentStep];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Three.js container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Start Button */}
        {!isARActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <button
              onClick={startAR}
              disabled={!arSupported && !errorMsg.includes('Chrome')}
              className="px-8 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {arSupported ? 'Start AR Training' : 'AR Check...'}
            </button>
          </div>
        )}

        {/* Instructions Panel */}
        {isARActive && (
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white p-6 rounded-xl max-w-md backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-2 text-green-400">Handwashing Training</h2>
            <p className="text-lg leading-relaxed">{currentStepData.instruction}</p>
          </div>
        )}

        {/* Step Indicator */}
        {isARActive && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold">
            Step {currentStepData.step} of {HANDWASHING_STEPS.length}
            <div className="mt-2 w-full bg-green-900 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Panel */}
        <div className="absolute bottom-5 left-5 bg-black bg-opacity-70 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div>FPS: {fps}</div>
          <div>Status: {isARActive ? 'Active' : 'Ready'}</div>
          <div>Progress: {Math.round(stepProgress)}%</div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg max-w-md text-center">
            {errorMsg}
          </div>
        )}

        {/* Info Banner */}
        <div className="absolute bottom-5 right-5 bg-blue-500 bg-opacity-80 text-white p-3 rounded-lg text-sm max-w-xs">
          <strong>Option B Demo:</strong> Three.js + WebXR
          <br />
          <span className="text-xs">Best on Android Chrome. iOS Safari has limited AR support.</span>
        </div>

      </div>
    </div>
  );
}