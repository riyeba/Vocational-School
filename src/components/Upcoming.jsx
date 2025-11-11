// // import React, { useState } from 'react';
// // import { Home, Calendar, User, LogOut, Clock, MapPin, Users } from 'lucide-react';

// // export default function GreenLeafEvents() {
// //   const [rsvpStatus, setRsvpStatus] = useState({
// //     event1: { attending: 2, notAttending: 0 },
// //     event2: { attending: 0, notAttending: 0 }
// //   });

// //   const handleRSVP = (eventId, status) => {
// //     setRsvpStatus(prev => ({
// //       ...prev,
// //       [eventId]: {
// //         attending: status === 'attending' ? prev[eventId].attending + 1 : prev[eventId].attending,
// //         notAttending: status === 'not-attending' ? prev[eventId].notAttending + 1 : prev[eventId].notAttending
// //       }
// //     }));
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header Navigation */}
// //       {/* <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               <h1 className="text-2xl font-bold text-green-500">GreenLeaf</h1>
// //             </div>
// //             <nav className="flex items-center space-x-6">
// //               <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
// //                 <Home className="w-4 h-4 mr-1" />
// //                 Feed
// //               </a>
// //               <a href="#" className="flex items-center text-green-600 hover:text-green-700">
// //                 <Calendar className="w-4 h-4 mr-1" />
// //                 Events
// //               </a>
// //               <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
// //                 <User className="w-4 h-4 mr-1" />
// //                 Profile
// //               </a>
// //               <a href="#" className="flex items-center text-gray-600 hover:text-gray-800">
// //                 <LogOut className="w-4 h-4 mr-1" />
// //                 Sign Out
// //               </a>
// //             </nav>
// //           </div>
// //         </div>
// //       </header> */}

// //       {/* Main Content */}
// //       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {/* Page Header */}
// //         <div className="mb-8">
// //           <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
// //           <p className="text-gray-600">Discover and join community events</p>
// //         </div>

// //         {/* Events Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //           {/* Event 1 - What is Lorem Ipsum? */}
// //           <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //             <div className="p-6">
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h3 className="text-xl font-semibold text-gray-900 mb-2">What is Lorem Ipsum?</h3>
// //                   <div className="flex items-center text-sm text-gray-600 mb-1">
// //                     <Clock className="w-4 h-4 mr-1" />
// //                     July 15, 2025 at 02:38 AM
// //                   </div>
// //                   <div className="flex items-center text-sm text-gray-600 mb-2">
// //                     <MapPin className="w-4 h-4 mr-1" />
// //                     5th2Fl
// //                   </div>
// //                   <p className="text-sm text-gray-500">by @writersworkshops</p>
// //                 </div>
// //                 <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Event</span>
// //               </div>

// //               {/* Event Image */}
// //               <div className="mb-4">
// //                 <img 
// //                   src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop&crop=center" 
// //                   alt="Lorem Ipsum Event" 
// //                   className="w-full h-48 object-cover rounded-lg"
// //                 />
// //               </div>

// //               {/* RSVP Section */}
// //               <div className="mb-4">
// //                 <h4 className="font-medium text-gray-900 mb-3">RSVP</h4>
// //                 <div className="flex space-x-4 mb-4">
// //                   <button
// //                     onClick={() => handleRSVP('event1', 'attending')}
// //                     className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
// //                   >
// //                     Attending
// //                   </button>
// //                   {/* <button
// //                     onClick={() => handleRSVP('event1', 'not-attending')}
// //                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
// //                   >
// //                     Not Attending
// //                   </button> */}
// //                 </div>
// //                 <div className="flex justify-between text-sm text-gray-600">
// //                   <span className="flex items-center">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
// //                     {rsvpStatus.event1.attending} Attending
// //                   </span>
// //                   {/* <span className="flex items-center">
// //                     <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
// //                     {rsvpStatus.event1.notAttending} Not Attending
// //                   </span> */}
// //                 </div>
// //               </div>

// //               {/* Description */}
// //               <div>
// //                 <h4 className="font-medium text-gray-900 mb-2">Description</h4>
// //                 <p className="text-sm text-gray-600 leading-relaxed">
// //                   Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 
// //                   Ipsum has been the industry's standard dummy text ever since the 1500s, when an 
// //                   unknown printer took a galley of type and scrambled it to make a type specimen 
// //                   book. It has survived not only five centuries, but also the leap into electronic 
// //                   typesetting, remaining essentially unchanged.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Event 2 - Movie SHOW */}
// //           <div className="bg-white rounded-lg shadow-md overflow-hidden">
// //             <div className="p-6">
// //               <div className="flex justify-between items-start mb-4">
// //                 <div>
// //                   <h3 className="text-xl font-semibold text-gray-900 mb-2">Movie SHOW</h3>
// //                   <div className="flex items-center text-sm text-gray-600 mb-1">
// //                     <Clock className="w-4 h-4 mr-1" />
// //                     November 18, 2025 at 08:13 AM
// //                   </div>
// //                   <div className="flex items-center text-sm text-gray-600 mb-2">
// //                     <MapPin className="w-4 h-4 mr-1" />
// //                     North Central Avenue
// //                   </div>
// //                   <p className="text-sm text-gray-500">by @cinematicexperience</p>
// //                 </div>
// //                 <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Event</span>
// //               </div>

// //               {/* Event Image Grid */}
// //               <div className="mb-4">
// //                 <div className="grid grid-cols-2 gap-2 h-48">
// //                   <img 
// //                     src="https://images.unsplash.com/photo-1550591927-391fccf9934b?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
// //                     alt="Movie 1" 
// //                     className="w-full h-full object-cover rounded-lg"
// //                   />
// //                   <div className="grid grid-rows-2 gap-2">
// //                     <img 
// //                       src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&h=100&fit=crop&crop=center" 
// //                       alt="Movie 2" 
// //                       className="w-full h-full object-cover rounded-lg"
// //                     />
// //                     <img 
// //                       src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=100&fit=crop&crop=center" 
// //                       alt="Movie 3" 
// //                       className="w-full h-full object-cover rounded-lg"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* RSVP Section */}
// //               <div className="mb-4">
// //                 <h4 className="font-medium text-gray-900 mb-3">RSVP</h4>
// //                 <div className="flex space-x-4 mb-4">
// //                   <button
// //                     onClick={() => handleRSVP('event2', 'attending')}
// //                     className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
// //                   >
// //                     Attending
// //                   </button>
// //                   {/* <button
// //                     onClick={() => handleRSVP('event2', 'not-attending')}
// //                     className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
// //                   >
// //                     Not Attending
// //                   </button> */}
// //                 </div>
// //                 <div className="flex justify-between text-sm text-gray-600">
// //                   <span className="flex items-center">
// //                     <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
// //                     {rsvpStatus.event2.attending} Attending
// //                   </span>
// //                   {/* <span className="flex items-center">
// //                     <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
// //                     {rsvpStatus.event2.notAttending} Not Attending
// //                   </span> */}
// //                 </div>
// //               </div>

// //               {/* Description and Location */}
// //               <div className="space-y-4">
// //                 <div>
// //                   <h4 className="font-medium text-gray-900 mb-2">Description</h4>
// //                   <p className="text-sm text-gray-600">Movie show</p>
// //                 </div>
// //                 <div>
// //                   <h4 className="font-medium text-gray-900 mb-2">Location</h4>
// //                   <p className="text-sm text-gray-600">123 London street, London</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }


// // ProperThreeJSARTest.jsx
// // Complete WebAR Testing Platform - MediaPipe vs Three.js
// // FULL WORKING CODE - Copy this entire file

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

// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const steps = [
//   {
//     text: "Step 1: Wet your hands",
//     model: "/two_hands.glb",
//   },
//   {
//     text: "Step 2: Rub palms together",
//     model: "/two_hands.glb",
//   },
//   {
//     text: "Step 3: Scrub between fingers",
//     model: "/two_hands.glb",
//   },
// ];

// const GreenLeaveEvents = () => {
//   const mountRef = useRef(null);
//   const overlayRef = useRef(null);
//   const mixerRef = useRef(null);
//   const clock = useRef(new THREE.Clock());
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isARActive, setIsARActive] = useState(false);
//   const stepIndexRef = useRef(0);

//   useEffect(() => {
//     let scene, camera, renderer;
//     let animationId;

//     const init = () => {
//       // 1️⃣ Scene
//       scene = new THREE.Scene();

//       // 2️⃣ Camera
//       camera = new THREE.PerspectiveCamera(
//         70,
//         window.innerWidth / window.innerHeight,
//         0.01,
//         20
//       );

//       // 3️⃣ Renderer
//       renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.xr.enabled = true;
      
//       // Set renderer canvas style to ensure overlay works
//       renderer.domElement.style.position = 'absolute';
//       renderer.domElement.style.top = '0';
//       renderer.domElement.style.left = '0';
      
//       mountRef.current.appendChild(renderer.domElement);
      
//       const arButton = ARButton.createButton(renderer, { 
//         requiredFeatures: ["hit-test"] 
//       });
//       arButton.style.position = 'absolute';
//       arButton.style.bottom = '20px';
//       arButton.style.left = '50%';
//       arButton.style.transform = 'translateX(-50%)';
//       arButton.style.zIndex = '100';
      
//       mountRef.current.appendChild(arButton);

//       // 4️⃣ Light
//       const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//       scene.add(light);

//       // 5️⃣ Detect when AR session starts
//       renderer.xr.addEventListener('sessionstart', () => {
//         setIsARActive(true);
//         stepIndexRef.current = 0;
//         setCurrentStep(0);
//         showStep(0);
//       });

//       // 6️⃣ Detect when AR session ends
//       renderer.xr.addEventListener('sessionend', () => {
//         setIsARActive(false);
//         // Clear the scene
//         const objectsToRemove = [];
//         scene.children.forEach(child => {
//           if (!(child instanceof THREE.Light)) {
//             objectsToRemove.push(child);
//           }
//         });
//         objectsToRemove.forEach(obj => scene.remove(obj));
//       });

//       // 7️⃣ Animation loop
//       renderer.setAnimationLoop(() => {
//         const delta = clock.current.getDelta();
//         if (mixerRef.current) mixerRef.current.update(delta);
//         renderer.render(scene, camera);
//       });

//       // 8️⃣ Handle resize
//       const handleResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//       };
//       window.addEventListener("resize", handleResize);

//       // 9️⃣ Show step function
//       function showStep(index) {
//         // Clear old objects except lights
//         const objectsToRemove = [];
//         scene.children.forEach(child => {
//           if (!(child instanceof THREE.Light)) {
//             objectsToRemove.push(child);
//           }
//         });
//         objectsToRemove.forEach(obj => scene.remove(obj));

//         const step = steps[index];

//         // Load 3D model
//         const loader = new GLTFLoader();
//         loader.load(
//           step.model,
//           (gltf) => {
//             const model = gltf.scene;
//             model.position.set(0, -0.3, -1);
//             model.scale.set(0.4, 0.4, 0.4);
//             scene.add(model);

//             mixerRef.current = new THREE.AnimationMixer(model);
//             if (gltf.animations.length > 0) {
//               const action = mixerRef.current.clipAction(gltf.animations[0]);
//               action.play();
//             }
//           },
//           undefined,
//           (error) => console.error("Error loading model:", error)
//         );

//         // Schedule next step
//         if (index < steps.length - 1) {
//           setTimeout(() => {
//             const nextStep = index + 1;
//             stepIndexRef.current = nextStep;
//             setCurrentStep(nextStep);
//             showStep(nextStep);
//           }, 5000); // 5 seconds per step
//         }
//       }

//       // Cleanup function
//       return () => {
//         renderer.setAnimationLoop(null);
//         window.removeEventListener("resize", handleResize);
//       };
//     };

//     const cleanup = init();

//     return () => {
//       if (cleanup) cleanup();
//       if (mountRef.current) {
//         mountRef.current.innerHTML = "";
//       }
//     };
//   }, []);

//   return (
//     <div className="relative w-screen h-screen overflow-hidden bg-black">
//       {/* Three.js AR Canvas */}
//       <div ref={mountRef} className="absolute inset-0" />

//       {/* Show overlay only when AR is active */}
//       {isARActive && (
//         <div 
//           ref={overlayRef}
//           className="fixed top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg text-center pointer-events-none max-w-md"
//           style={{ zIndex: 9999 }}
//         >
//           <p className="text-lg font-semibold">
//             {steps[currentStep]?.text || "Loading..."}
//           </p>
//         </div>
//       )}

//       {/* Instructions before AR starts */}
//       {!isARActive && (
//         <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
//           <div className="bg-white bg-opacity-90 text-gray-800 px-8 py-6 rounded-lg text-center max-w-sm mx-4">
//             <h2 className="text-xl font-bold mb-2">Hand Washing AR Tutorial</h2>
//             <p className="text-sm">Click &quot;Start AR&quot; to begin the interactive hand washing guide</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GreenLeaveEvents;


import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const steps = [
  { text: "Step 1: Wet your hands", model: "/image/two_hands.glb" },
  { text: "Step 2: Rub palms together", model: "/image/two_hands.glb" },
  { text: "Step 3: Scrub between fingers", model: "/image/two_hands.glb" }, 
];

const GreenLeaveEvents = () => {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const mixerRef = useRef(null);
  const clock = useRef(new THREE.Clock());
  const [currentStep, setCurrentStep] = useState(0);
  const [isARActive, setIsARActive] = useState(false);

  useEffect(() => {
    let scene, camera, renderer;

    const init = () => {
      // Scene
      scene = new THREE.Scene();
      

      // Camera
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;

      renderer.setClearColor(0x000000, 0); // Makes background transparent
      scene.background = null; //
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      mountRef.current.appendChild(renderer.domElement);

      // AR Button
      const arButton = ARButton.createButton(renderer, {
        optionalFeatures: ["local-floor", "dom-overlay"],
        domOverlay: { root: document.body },
      });
      arButton.style.position = "absolute";
      arButton.style.bottom = "20px";
      arButton.style.left = "50%";
      arButton.style.transform = "translateX(-50%)";
      arButton.style.zIndex = "100";
      mountRef.current.appendChild(arButton);

      // Light
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(0, 5, 5);
      scene.add(dirLight);

      // AR session start
      renderer.xr.addEventListener("sessionstart", () => {
        console.log("AR Session Started!");
        setIsARActive(true);
        setCurrentStep(0);
        showStep(0);
      });

      // AR session end
      renderer.xr.addEventListener("sessionend", () => {
        setIsARActive(false);
        // Remove all objects except lights
        scene.children
          .filter((child) => !(child instanceof THREE.Light))
          .forEach((child) => scene.remove(child));
      });

      // Animation loop
      renderer.setAnimationLoop(() => {
        const delta = clock.current.getDelta();
        if (mixerRef.current) mixerRef.current.update(delta);
        renderer.render(scene, camera);
      });

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      // Show each step
      function showStep(index) {
        setCurrentStep(index); // Update overlay

        // Remove previous models
        scene.children
          .filter((child) => !(child instanceof THREE.Light))
          .forEach((child) => scene.remove(child));

        const step = steps[index];
        // const loader = new GLTFLoader();
        // loader.load(
        //   step.model,
        //   (gltf) => {
        //     const model = gltf.scene;
        //     model.position.set(0, -0.2, -0.5); // In front of camera
        //     model.scale.set(0.5, 0.5, 0.5);
        //     scene.add(model);

        //     mixerRef.current = new THREE.AnimationMixer(model);
        //     if (gltf.animations.length > 0) {
        //       mixerRef.current.clipAction(gltf.animations[0]).play();
        //     }
        //   },
        //   undefined,
        //   (error) => console.error("Error loading model:", error)
        // );
       const loader = new GLTFLoader();
loader.load(
  step.model,
  (gltf) => {
    const model = gltf.scene;

    // Adjust scale for visibility
    model.scale.set(0.4, 0.4, 0.4);

    // 👇 Attach the model directly to the camera
    camera.add(model);
    model.position.set(0, -0.2, -0.5); // slightly below and in front of camera

    // 👇 Ensure camera is in the scene
    scene.add(camera);

    // Optional: play any animations
    mixerRef.current = new THREE.AnimationMixer(model);
    if (gltf.animations.length > 0) {
      mixerRef.current.clipAction(gltf.animations[0]).play();
    }

    console.log("✅ Model added and attached to camera:", step.model);
  },
  (xhr) => console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`),
  (error) => console.error("❌ Error loading model:", error)
);

        // Next step after 5 seconds
        if (index < steps.length - 1) {
          setTimeout(() => showStep(index + 1), 5000);
        }
      }

      // Cleanup
      return () => {
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanup = init();
    return () => {
      if (cleanup) cleanup();
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Three.js AR Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Overlay */}
      {isARActive && (
        <div
          ref={overlayRef}
          className="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-center pointer-events-none max-w-md shadow-2xl border-4 border-white"
          style={{ zIndex: 9999 }}
        >
          <p className="text-2xl font-bold">
            {steps[currentStep]?.text || "Loading..."}
          </p>
        </div>
      )}

      {/* Instructions before AR starts */}
      {!isARActive && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-90 text-gray-800 px-8 py-6 rounded-lg text-center max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-2">Hand Washing AR Tutorial</h2>
            <p className="text-sm">
              Click &quot;Start AR&quot; to begin the interactive hand washing guide
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenLeaveEvents;
