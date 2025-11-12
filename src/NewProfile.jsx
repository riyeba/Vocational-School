
// import React, { useEffect, useRef, useState } from "react";
// import * as drawingUtils from "@mediapipe/drawing_utils";


// export default function NewProfile() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [mode, setMode] = useState("menu"); // menu, handwashing, ppe, transfer
//   const [stepIndex, setStepIndex] = useState(0);
//   const [stepText, setStepText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [latency, setLatency] = useState(0);
  
//   const stepIndexRef = useRef(0);
//   const lastDetectionRef = useRef(0);
//   const lastFrameCaptureRef = useRef(0);
//   const cameraRef = useRef(null);
//   const handsRef = useRef(null);
//   const poseRef = useRef(null);
//   const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

//   const trainingModes = {
//     handwashing: [
//       {
//         text: "Step 1: Wet your hands and apply soap",
//         instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
//         gesture: "palms_together"
//       },
//       {
//         text: "Step 2: Rub palms together in circular motions",
//         instruction: "Place both palms together and rub them in circular motion for proper soap distribution.",
//         gesture: "palms_together"
//       },
//       {
//         text: "Step 3: Rub the back of each hand",
//         instruction: "Place one palm on the back of the other hand and rub, then switch hands.",
//         gesture: "back_of_hands"
//       },
//       {
//         text: "Step 4: Interlace fingers and clean between them",
//         instruction: "Interlock your fingers and rub them together to clean between the fingers.",
//         gesture: "interlaced"
//       },
//       {
//         text: "Step 5: Clean thumbs by rotating in opposite palm",
//         instruction: "Grasp each thumb with the opposite hand and rotate to clean thoroughly.",
//         gesture: "thumb_cleaning"
//       },
//       {
//         text: "Step 6: Rub fingertips on opposite palm",
//         instruction: "Place fingertips in opposite palm and rub in circular motion.",
//         gesture: "fingertips"
//       },
//       {
//         text: "Step 7: Rinse hands thoroughly",
//         instruction: "Hold hands under running water and ensure all soap is rinsed off.",
//         gesture: "rinsing"
//       },
//       {
//         text: "✅ Perfect! Handwashing complete - 20 seconds minimum",
//         instruction: "Great job! Your hands are now properly sanitized.",
//         gesture: "complete"
//       }
//     ],
//     ppe: [
//       {
//         text: "Step 1: Perform hand hygiene",
//         instruction: "Wash or sanitize your hands before touching any PPE equipment.",
//         gesture: "hands_visible"
//       },
//       {
//         text: "Step 2: Put on gown - tie at neck and waist",
//         instruction: "Hold gown, slip arms through sleeves, tie at neck first, then at waist. Cover torso fully.",
//         gesture: "arms_extended"
//       },
//       {
//         text: "Step 3: Put on face mask or respirator",
//         instruction: "Place mask over nose and mouth, secure elastic bands or ties. Mold nose piece to fit.",
//         gesture: "hands_at_face"
//       },
//       {
//         text: "Step 4: Put on eye protection (goggles or face shield)",
//         instruction: "Position goggles or face shield over eyes and secure to head. Adjust for comfort.",
//         gesture: "hands_at_face"
//       },
//       {
//         text: "Step 5: Put on gloves",
//         instruction: "Select correct size, insert hands, extend gloves over gown cuffs to create seal.",
//         gesture: "hands_forward"
//       },
//       {
//         text: "✅ PPE donning complete! You're protected.",
//         instruction: "All PPE is properly worn. Ready for patient care.",
//         gesture: "complete"
//       }
//     ],
//     transfer: [
//       {
//         text: "Step 1: Position yourself close to patient",
//         instruction: "Stand with feet shoulder-width apart, one foot slightly forward. Bend knees, not back.",
//         gesture: "standing_stable"
//       },
//       {
//         text: "Step 2: Communicate with patient",
//         instruction: "Explain what you're doing. Ask if they're ready. Count to 3 together.",
//         gesture: "hands_visible"
//       },
//       {
//         text: "Step 3: Use proper body mechanics",
//         instruction: "Keep back straight, bend at hips and knees. Hold patient close to your center of gravity.",
//         gesture: "bent_posture"
//       },
//       {
//         text: "Step 4: Lift with legs, not back",
//         instruction: "Straighten your legs to lift. Keep arms close to body. Do not twist your spine.",
//         gesture: "lifting_posture"
//       },
//       {
//         text: "Step 5: Pivot feet to turn, don't twist spine",
//         instruction: "Move your feet to turn direction. Keep patient close. Lower patient gently.",
//         gesture: "stable_stance"
//       },
//       {
//         text: "Step 6: Lower patient safely",
//         instruction: "Bend knees and hips, keeping back straight. Lower patient smoothly and gently.",
//         gesture: "lowering_posture"
//       },
//       {
//         text: "✅ Safe patient transfer complete!",
//         instruction: "Excellent technique! Patient is safe and comfortable.",
//         gesture: "complete"
//       }
//     ]
//   };

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.pitch = 1;
//     utterance.rate = 0.9;
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   const logPositions = (landmarks, type = "hand") => {
//     // Log landmark positions to console for AI training data collection
//     if (landmarks && landmarks.length > 0) {
//       const timestamp = Date.now();
//       console.log(`[${type.toUpperCase()} POSITIONS - ${timestamp}]`, {
//         timestamp,
//         mode,
//         step: stepIndex,
//         landmarks: landmarks.map((lm, idx) => ({
//           id: idx,
//           x: lm.x.toFixed(4),
//           y: lm.y.toFixed(4),
//           z: lm.z ? lm.z.toFixed(4) : null
//         }))
//       });
//     }
//   };

//   const updateFPS = () => {
//     const now = Date.now();
//     fpsCounterRef.current.frames++;
    
//     if (now - fpsCounterRef.current.lastTime >= 1000) {
//       setFps(fpsCounterRef.current.frames);
//       fpsCounterRef.current.frames = 0;
//       fpsCounterRef.current.lastTime = now;
//     }
//   };

//   const captureFrame = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;
//     return canvas.toDataURL('image/jpeg', 0.7);
//   };

//   const analyzeWithAI = async (imageData, currentStep) => {
//     if (!imageData || isProcessing) return;
    
//     const startTime = Date.now();
//     setIsProcessing(true);
//     setFeedback("🤖 AI analyzing technique...");

//     try {
//       const base64Data = imageData.split(',')[1];
//       const steps = trainingModes[mode];
      
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 1000,
//           messages: [
//             {
//               role: "user",
//               content: [
//                 {
//                   type: "image",
//                   source: {
//                     type: "base64",
//                     media_type: "image/jpeg",
//                     data: base64Data
//                   }
//                 },
//                 {
//                   type: "text",
//                   text: `You are an AI healthcare training instructor analyzing ${mode} technique.

// Current Step: ${steps[currentStep].text}
// Required Action: ${steps[currentStep].instruction}

// Analyze the image and provide guidance. Check if the person's body position, hand placement, or posture matches the requirements for this step.

// Respond ONLY in this JSON format:
// {
//   "correct": true/false,
//   "feedback": "Brief feedback (1-2 sentences)"
// }`
//                 }
//               ]
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const endTime = Date.now();
//       setLatency(endTime - startTime);
      
//       const textContent = data.content.find(item => item.type === "text")?.text || "";
//       const cleanText = textContent.replace(/```json|```/g, "").trim();
//       const result = JSON.parse(cleanText);
      
//       if (result.correct) {
//         setFeedback(`✅ ${result.feedback}`);
//         speak(result.feedback);
//         setTimeout(() => advanceStep(currentStep + 1), 2000);
//       } else {
//         setFeedback(`⚠️ ${result.feedback}`);
//         speak(result.feedback);
//       }
      
//     } catch (error) {
//       console.error("AI Analysis error:", error);
//       setFeedback(`❌ AI unavailable. Auto-advancing...`);
//       setTimeout(() => advanceStep(currentStep + 1), 3000);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const advanceStep = (newIndex) => {
//     const steps = trainingModes[mode];
//     if (newIndex < steps.length) {
//       stepIndexRef.current = newIndex;
//       setStepIndex(newIndex);
//       setStepText(steps[newIndex].text);
//       setFeedback("");
//       speak(steps[newIndex].text);
//       lastDetectionRef.current = Date.now();
//     }
//   };


//    const startTraining = (selectedMode) => {
//     setMode(selectedMode);
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setStepText("");
//     setFeedback("Starting camera...");
//     // Delay speaking first step until camera is ready
//     setTimeout(() => {
//       setStepText(trainingModes[selectedMode][0].text);
//       speak(trainingModes[selectedMode][0].text);
//       setFeedback("");
//     }, 2000);
//   };

//   const returnToMenu = () => {
//     setMode("menu");
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setStepText("");
//     setFeedback("");
//     window.speechSynthesis.cancel();
//   };

//   useEffect(() => {
//     if (mode === "menu") return;

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
//             locateFile: (file) =>
//               `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//           });

//           hands.setOptions({
//             maxNumHands: 2,
//             modelComplexity: 1,
//             minDetectionConfidence: 0.7,
//             minTrackingConfidence: 0.7,
//           });

//           hands.onResults((results) => {
//             updateFPS();
            
//             canvasCtx.save();
//             canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//             canvasCtx.drawImage(
//               results.image,
//               0,
//               0,
//               canvasElement.width,
//               canvasElement.height
//             );

//             if (results.multiHandLandmarks) {
//               for (const landmarks of results.multiHandLandmarks) {
//                 // Log positions every 2 seconds
//                 if (Date.now() - lastDetectionRef.current > 2000) {
//                   logPositions(landmarks, "hand");
//                 }
                
//                 // Draw hand skeleton
//                 const drawingUtils = window.drawingUtils || {
//                   drawConnectors: (ctx, lm, connections, style) => {
//                     for (const [start, end] of connections) {
//                       ctx.beginPath();
//                       ctx.moveTo(lm[start].x * canvasElement.width, lm[start].y * canvasElement.height);
//                       ctx.lineTo(lm[end].x * canvasElement.width, lm[end].y * canvasElement.height);
//                       ctx.strokeStyle = style.color;
//                       ctx.lineWidth = style.lineWidth || 2;
//                       ctx.stroke();
//                     }
//                   },
//                   drawLandmarks: (ctx, lm, style) => {
//                     for (const point of lm) {
//                       ctx.beginPath();
//                       ctx.arc(point.x * canvasElement.width, point.y * canvasElement.height, style.radius || 4, 0, 2 * Math.PI);
//                       ctx.fillStyle = style.color;
//                       ctx.fill();
//                     }
//                   }
//                 };

//                 // Draw connections
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
                
//                 // Draw landmarks
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

//               // AI Analysis every 4 seconds
//               const now = Date.now();
//               const currentStep = stepIndexRef.current;
//               const steps = trainingModes[mode];
              
//               if (results.multiHandLandmarks.length >= 1 && 
//                   now - lastFrameCaptureRef.current > 4000 && 
//                   currentStep < steps.length - 1 &&
//                   !isProcessing) {
                
//                 lastFrameCaptureRef.current = now;
//                 const frameData = captureFrame();
//                 analyzeWithAI(frameData, currentStep);
//               }
//             }

//             canvasCtx.restore();
//           });

//           handsRef.current = hands;

//           const camera = new window.Camera(videoElement, {
//             onFrame: async () => {
//               await hands.send({ image: videoElement });
//             },
//             width: 640,
//             height: 480,
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
//       window.speechSynthesis.cancel();
      
//       if (cameraRef.current && cameraRef.current.stop) {
//         cameraRef.current.stop();
//       }
      
//       if (handsRef.current && handsRef.current.close) {
//         handsRef.current.close();
//       }
//     };
//   }, [mode]);

//   if (mode === "menu") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//         <div className="text-center mb-8">
//           <h1 className="text-white text-4xl font-bold mb-3">
//             🏥 Vocational Healthcare Training
//           </h1>
//           <p className="text-blue-200 text-lg">
//             AI-Powered AR Training System
//           </p>
//           <p className="text-blue-300 text-sm mt-2">
//             Select a training module to begin
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
//           <button
//             onClick={() => startTraining("handwashing")}
//             className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all"
//           >
//             <div className="text-6xl mb-4">🧼</div>
//             <h2 className="text-2xl font-bold mb-2">Hand Hygiene</h2>
//             <p className="text-sm opacity-90">
//               Learn proper 7-step handwashing technique
//             </p>
//             <div className="mt-4 text-xs bg-white/20 rounded-full py-1 px-3 inline-block">
//               7 Steps • 20+ seconds
//             </div>
//           </button>

//           <button
//             onClick={() => startTraining("ppe")}
//             className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all"
//           >
//             <div className="text-6xl mb-4">🥽</div>
//             <h2 className="text-2xl font-bold mb-2">PPE Donning</h2>
//             <p className="text-sm opacity-90">
//               Master correct PPE sequence and technique
//             </p>
//             <div className="mt-4 text-xs bg-white/20 rounded-full py-1 px-3 inline-block">
//               5 Steps • Proper sequence
//             </div>
//           </button>

//           <button
//             onClick={() => startTraining("transfer")}
//             className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all"
//           >
//             <div className="text-6xl mb-4">🤝</div>
//             <h2 className="text-2xl font-bold mb-2">Patient Transfer</h2>
//             <p className="text-sm opacity-90">
//               Safe body mechanics for patient handling
//             </p>
//             <div className="mt-4 text-xs bg-white/20 rounded-full py-1 px-3 inline-block">
//               6 Steps • Safety first
//             </div>
//           </button>
//         </div>

//         <div className="mt-8 text-center">
//           <p className="text-blue-200 text-sm">
//             💡 Point your camera at yourself and follow AI voice guidance
//           </p>
//           <p className="text-blue-300 text-xs mt-2">
//             Works on iPhone Safari & Android Chrome
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const steps = trainingModes[mode];

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//       <div className="text-center mb-3">
//         <h1 className="text-white text-2xl font-bold mb-1">
//           {mode === "handwashing" && "🧼 Hand Hygiene Training"}
//           {mode === "ppe" && "🥽 PPE Donning Training"}
//           {mode === "transfer" && "🤝 Patient Transfer Training"}
//         </h1>
//         <button
//           onClick={returnToMenu}
//           className="text-blue-300 text-sm hover:text-blue-100 underline"
//         >
//           ← Back to Menu
//         </button>
//       </div>
      
//       <div className="relative">
//         <video
//           ref={videoRef}
//           className="hidden"
//           width="640"
//           height="480"
//           autoPlay
//           playsInline
//         ></video>
//         <canvas
//           ref={canvasRef}
//           className="rounded-2xl border-4 border-blue-400 shadow-2xl"
//           width="640"
//           height="480"
//         ></canvas>

//         {/* Performance Metrics */}
//         <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1 text-xs">
//           <div className="text-green-400">FPS: {fps}</div>
//           <div className="text-blue-400">Latency: {latency}ms</div>
//         </div>

//         {/* Progress Bar */}
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

//         {/* AI Feedback */}
//         {feedback && (
//           <div className="absolute bottom-4 left-4 right-4">
//             <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
//               <p className="text-white text-sm font-medium text-center">
//                 {feedback}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Processing Indicator */}
//         {isProcessing && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
//             <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
//               <p className="text-white font-semibold">🔄 AI Analyzing...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useRef, useState } from "react";

// export default function NewProfile() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stepIndex, setStepIndex] = useState(0);
//   const [stepText, setStepText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [latency, setLatency] = useState(0);
//   const [isStarted, setIsStarted] = useState(false);
  
//   const stepIndexRef = useRef(0);
//   const lastFrameCaptureRef = useRef(0);
//   const cameraRef = useRef(null);
//   const handsRef = useRef(null);
//   const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

//   const handwashingSteps = [
//     {
//       text: "Step 1: Wet your hands and apply soap",
//       instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
//     },
//     {
//       text: "Step 2: Rub palms together in circular motions",
//       instruction: "Place both palms together and rub them in circular motion for proper soap distribution.",
//     },
//     {
//       text: "Step 3: Rub the back of each hand",
//       instruction: "Place one palm on the back of the other hand and rub, then switch hands.",
//     },
//     {
//       text: "Step 4: Interlace fingers and clean between them",
//       instruction: "Interlock your fingers and rub them together to clean between the fingers.",
//     },
//     {
//       text: "Step 5: Clean thumbs by rotating in opposite palm",
//       instruction: "Grasp each thumb with the opposite hand and rotate to clean thoroughly.",
//     },
//     {
//       text: "Step 6: Rub fingertips on opposite palm",
//       instruction: "Place fingertips in opposite palm and rub in circular motion.",
//     },
//     {
//       text: "Step 7: Rinse hands thoroughly",
//       instruction: "Hold hands under running water and ensure all soap is rinsed off.",
//     },
//     {
//       text: "✅ Perfect! Handwashing complete - 20 seconds minimum",
//       instruction: "Great job! Your hands are now properly sanitized.",
//     }
//   ];

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "en-US";
//     utterance.pitch = 1;
//     utterance.rate = 0.9;
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   const updateFPS = () => {
//     const now = Date.now();
//     fpsCounterRef.current.frames++;
    
//     if (now - fpsCounterRef.current.lastTime >= 1000) {
//       setFps(fpsCounterRef.current.frames);
//       fpsCounterRef.current.frames = 0;
//       fpsCounterRef.current.lastTime = now;
//     }
//   };

//   const captureFrame = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;
//     return canvas.toDataURL('image/jpeg', 0.7);
//   };

//   const analyzeWithAI = (imageData, currentStep) => {
//     // Auto-advance to next step after delay
//     setTimeout(() => advanceStep(currentStep + 1), 2000);
//   };

//   const advanceStep = (newIndex) => {
//     if (newIndex < handwashingSteps.length) {
//       stepIndexRef.current = newIndex;
//       setStepIndex(newIndex);
//       setStepText(handwashingSteps[newIndex].text);
//       setFeedback("");
//       speak(handwashingSteps[newIndex].text);
//     }
//   };

//   const startTraining = () => {
//     setIsStarted(true);
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setFeedback("Starting camera...");
//     setTimeout(() => {
//       setStepText(handwashingSteps[0].text);
//       speak(handwashingSteps[0].text);
//       setFeedback("");
//     }, 2000);
//   };

//   const resetTraining = () => {
//     setIsStarted(false);
//     setStepIndex(0);
//     stepIndexRef.current = 0;
//     setStepText("");
//     setFeedback("");
//     window.speechSynthesis.cancel();
//   };

//   useEffect(() => {
//     if (!isStarted) return;

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
//             locateFile: (file) =>
//               `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//           });

//           hands.setOptions({
//             maxNumHands: 2,
//             modelComplexity: 1,
//             minDetectionConfidence: 0.7,
//             minTrackingConfidence: 0.7,
//           });

//           hands.onResults((results) => {
//             updateFPS();
            
//             canvasCtx.save();
//             canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//             canvasCtx.drawImage(
//               results.image,
//               0,
//               0,
//               canvasElement.width,
//               canvasElement.height
//             );

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

//               const now = Date.now();
//               const currentStep = stepIndexRef.current;
              
//               if (results.multiHandLandmarks.length >= 1 && 
//                   now - lastFrameCaptureRef.current > 4000 && 
//                   currentStep < handwashingSteps.length - 1 &&
//                   !isProcessing) {
                
//                 lastFrameCaptureRef.current = now;
//                 const frameData = captureFrame();
//                 analyzeWithAI(frameData, currentStep);
//               }
//             }

//             canvasCtx.restore();
//           });

//           handsRef.current = hands;

//           const camera = new window.Camera(videoElement, {
//             onFrame: async () => {
//               await hands.send({ image: videoElement });
//             },
//             width: 640,
//             height: 480,
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
//       window.speechSynthesis.cancel();
      
//       if (cameraRef.current && cameraRef.current.stop) {
//         cameraRef.current.stop();
//       }
      
//       if (handsRef.current && handsRef.current.close) {
//         handsRef.current.close();
//       }
//     };
//   }, [isStarted]);

//   if (!isStarted) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//         <div className="text-center mb-8">
//           <h1 className="text-white text-5xl font-bold mb-3">
//             🧼 Hand Washing Training
//           </h1>
//           <p className="text-blue-200 text-xl mb-2">
//             AI-Powered AR Training System
//           </p>
//           <p className="text-blue-300 text-base">
//             Learn the proper 7-step handwashing technique
//           </p>
//         </div>

//         <button
//           onClick={startTraining}
//           className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl px-12 py-6 text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all"
//         >
//           Start Training
//         </button>

//         <div className="mt-8 text-center max-w-md">
//           <p className="text-blue-200 text-base mb-4">
//             💡 Please raise your hands
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
//       <div className="text-center mb-3">
//         <h1 className="text-white text-2xl font-bold mb-1">
//           🧼 Hand Hygiene Training
//         </h1>
//         <button
//           onClick={resetTraining}
//           className="text-blue-300 text-sm hover:text-blue-100 underline"
//         >
//           ← Reset Training
//         </button>
//       </div>
      
//       <div className="relative">
//         <video
//           ref={videoRef}
//           className="hidden"
//           width="640"
//           height="480"
//           autoPlay
//           playsInline
//         ></video>
//         <canvas
//           ref={canvasRef}
//           className="rounded-2xl border-4 border-blue-400 shadow-2xl"
//           width="640"
//           height="480"
//         ></canvas>

//         <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1 text-xs">
//           <div className="text-green-400">FPS: {fps}</div>
//           <div className="text-blue-400">Latency: {latency}ms</div>
//         </div>

//         <div className="absolute top-4 left-4 right-4">
//           <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
//             <div className="flex justify-between mb-2">
//               {handwashingSteps.slice(0, -1).map((_, idx) => (
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

//         {feedback && (
//           <div className="absolute bottom-4 left-4 right-4">
//             <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
//               <p className="text-white text-sm font-medium text-center">
//                 {feedback}
//               </p>
//             </div>
//           </div>
//         )}

//         {isProcessing && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
//             <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
//               <p className="text-white font-semibold">🔄 AI Analyzing...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";

export default function NewProfile() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepText, setStepText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  
  const stepIndexRef = useRef(0);
  const lastFrameCaptureRef = useRef(0);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  const handwashingSteps = [
    {
      text: "Step 1: Wet your hands and apply soap",
      instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
    },
    {
      text: "Step 2: Rub palms together in circular motions",
      instruction: "Place both palms together and rub them in circular motion for proper soap distribution.",
    },
    {
      text: "Step 3: Rub the back of each hand",
      instruction: "Place one palm on the back of the other hand and rub, then switch hands.",
    },
    {
      text: "Step 4: Interlace fingers and clean between them",
      instruction: "Interlock your fingers and rub them together to clean between the fingers.",
    },
    {
      text: "Step 5: Clean thumbs by rotating in opposite palm",
      instruction: "Grasp each thumb with the opposite hand and rotate to clean thoroughly.",
    },
    {
      text: "Step 6: Rub fingertips on opposite palm",
      instruction: "Place fingertips in opposite palm and rub in circular motion.",
    },
    {
      text: "Step 7: Rinse hands thoroughly",
      instruction: "Hold hands under running water and ensure all soap is rinsed off.",
    },
    {
      text: "Perfect! Handwashing complete",
      instruction: "Great job! Your hands are now properly sanitized. The entire process should take at least 20 seconds.",
    }
  ];

  const speak = (text, isInstruction = false) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = isInstruction ? 1.1 : 1;
    utterance.rate = isInstruction ? 0.85 : 0.9;
    utterance.volume = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const updateFPS = () => {
    const now = Date.now();
    fpsCounterRef.current.frames++;
    
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      setFps(fpsCounterRef.current.frames);
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const analyzeWithAI = (imageData, currentStep) => {
    // Provide encouraging feedback
    const encouragements = [
      "Good technique! Moving to next step.",
      "Well done! Let's continue.",
      "Great job! Next step coming up.",
      "Perfect! Advancing now.",
      "Excellent work! Keep it up."
    ];
    
    const feedback = encouragements[Math.floor(Math.random() * encouragements.length)];
    setFeedback(feedback);
    speak(feedback);
    
    // Auto-advance to next step after delay
    setTimeout(() => advanceStep(currentStep + 1), 3000);
  };

  const advanceStep = (newIndex) => {
    if (newIndex < handwashingSteps.length) {
      stepIndexRef.current = newIndex;
      setStepIndex(newIndex);
      setStepText(handwashingSteps[newIndex].text);
      setFeedback("");
      
      // Speak the step title first
      speak(handwashingSteps[newIndex].text);
      
      // Then speak the detailed instruction after a short pause
      setTimeout(() => {
        speak(handwashingSteps[newIndex].instruction, true);
      }, 2500);
    }
  };

  const startTraining = () => {
    setIsStarted(true);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setFeedback("Starting camera...");
    speak("Welcome to hand washing training. Starting camera now.");
    setTimeout(() => {
      setStepText(handwashingSteps[0].text);
      speak(handwashingSteps[0].text);
      setTimeout(() => {
        speak(handwashingSteps[0].instruction, true);
      }, 2500);
      setFeedback("");
    }, 3000);
  };

  const resetTraining = () => {
    setIsStarted(false);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setStepText("");
    setFeedback("");
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    if (!isStarted) return;

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
              
              if (results.multiHandLandmarks.length >= 1 && 
                  now - lastFrameCaptureRef.current > 4000 && 
                  currentStep < handwashingSteps.length - 1 &&
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
      window.speechSynthesis.cancel();
      
      if (cameraRef.current && cameraRef.current.stop) {
        cameraRef.current.stop();
      }
      
      if (handsRef.current && handsRef.current.close) {
        handsRef.current.close();
      }
    };
  }, [isStarted]);

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-3">
            🧼 Hand Washing Training
          </h1>
          <p className="text-blue-200 text-xl mb-2">
            AI-Powered AR Training System
          </p>
          <p className="text-blue-300 text-base">
            Learn the proper 7-step handwashing technique
          </p>
        </div>

        <button
          onClick={startTraining}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl px-12 py-6 text-2xl font-bold shadow-2xl transform hover:scale-105 transition-all"
        >
          Start Training
        </button>

        <div className="mt-8 text-center max-w-md">
          <p className="text-blue-200 text-base mb-4">
            💡 Please raise your hands in front of the camera
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="text-center mb-3">
        <h1 className="text-white text-2xl font-bold mb-1">
          🧼 Hand Hygiene Training
        </h1>
        <button
          onClick={resetTraining}
          className="text-blue-300 text-sm hover:text-blue-100 underline"
        >
          ← Reset Training
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

        <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1 text-xs">
          <div className="text-green-400">FPS: {fps}</div>
          <div className="text-blue-400">Latency: {latency}ms</div>
        </div>

        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-blue-400/30">
            <div className="flex justify-between mb-2">
              {handwashingSteps.slice(0, -1).map((_, idx) => (
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

        {feedback && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-xl py-3 px-4 border border-white/20 shadow-lg">
              <p className="text-white text-sm font-medium text-center">
                {feedback}
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <div className="bg-blue-600/90 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
              {/* <p className="text-white font-semibold">🔄 AI Analyzing...</p> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}