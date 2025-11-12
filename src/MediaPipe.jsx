


// import React, { useEffect, useRef, useState } from "react";

// export default function MediaPipe() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [isStarted, setIsStarted] = useState(false);
//   const [stepIndex, setStepIndex] = useState(0);
//   const [stepText, setStepText] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fps, setFps] = useState(0);
//   const [latency, setLatency] = useState(0);
//   const [handsDetected, setHandsDetected] = useState(0);
//   const [landmarkPositions, setLandmarkPositions] = useState([]);
  
//   const stepIndexRef = useRef(0);
//   const lastFrameCaptureRef = useRef(0);
//   const lastLogTimeRef = useRef(0);
//   const cameraRef = useRef(null);
//   const handsRef = useRef(null);
//   const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

//   const handwashingSteps = [
//     {
//       text: "Step 1: Wet your hands and apply soap",
//       instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
//       gesture: "palms_together"
//     },
//     {
//       text: "Step 2: Rub palms together in circular motions",
//       instruction: "Place both palms together and rub them in circular motion for proper soap distribution.",
//       gesture: "palms_together"
//     },
//     {
//       text: "Step 3: Rub the back of each hand",
//       instruction: "Place one palm on the back of the other hand and rub, then switch hands.",
//       gesture: "back_of_hands"
//     },
//     {
//       text: "Step 4: Interlace fingers and clean between them",
//       instruction: "Interlock your fingers and rub them together to clean between the fingers.",
//       gesture: "interlaced"
//     },
//     {
//       text: "Step 5: Clean thumbs by rotating in opposite palm",
//       instruction: "Grasp each thumb with the opposite hand and rotate to clean thoroughly.",
//       gesture: "thumb_cleaning"
//     },
//     {
//       text: "Step 6: Rub fingertips on opposite palm",
//       instruction: "Place fingertips in opposite palm and rub in circular motion.",
//       gesture: "fingertips"
//     },
//     {
//       text: "Step 7: Rinse hands thoroughly",
//       instruction: "Hold hands under running water and ensure all soap is rinsed off.",
//       gesture: "rinsing"
//     },
//     {
//       text: "✅ Perfect! Handwashing complete - 20 seconds minimum",
//       instruction: "Great job! Your hands are now properly sanitized.",
//       gesture: "complete"
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

//   const logPositions = (landmarks, handIndex) => {
//     const now = Date.now();
//     if (now - lastLogTimeRef.current > 2000) {
//       lastLogTimeRef.current = now;
      
//       const positionData = {
//         timestamp: now,
//         mode: "handwashing",
//         step: stepIndexRef.current,
//         hand: handIndex,
//         landmarks: landmarks.map((lm, idx) => ({
//           id: idx,
//           x: lm.x.toFixed(4),
//           y: lm.y.toFixed(4),
//           z: lm.z ? lm.z.toFixed(4) : null
//         }))
//       };
      
//       console.log(`[HAND ${handIndex} POSITIONS - ${now}]`, positionData);
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
//                   text: `You are an AI healthcare training instructor analyzing handwashing technique.

// Current Step: ${handwashingSteps[currentStep].text}
// Required Action: ${handwashingSteps[currentStep].instruction}

// Analyze the image and provide guidance. Check if the person's hand position and movements match the requirements for this step.

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
//     setStepText("");
//     setFeedback("Starting camera...");
//     setTimeout(() => {
//       setStepText(handwashingSteps[0].text);
//       speak(handwashingSteps[0].text);
//       setFeedback("");
//     }, 2000);
//   };

//   const returnToStart = () => {
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
//               setHandsDetected(results.multiHandLandmarks.length);
              
//               // Update landmark positions for display
//               if (results.multiHandLandmarks.length > 0) {
//                 const firstHandLandmarks = results.multiHandLandmarks[0];
//                 setLandmarkPositions([
//                   { label: 'Wrist', x: firstHandLandmarks[0].x, y: firstHandLandmarks[0].y },
//                   { label: 'Thumb Tip', x: firstHandLandmarks[4].x, y: firstHandLandmarks[4].y },
//                   { label: 'Index Tip', x: firstHandLandmarks[8].x, y: firstHandLandmarks[8].y },
//                   { label: 'Middle Tip', x: firstHandLandmarks[12].x, y: firstHandLandmarks[12].y }
//                 ]);
//               }
              
//               for (let handIndex = 0; handIndex < results.multiHandLandmarks.length; handIndex++) {
//                 const landmarks = results.multiHandLandmarks[handIndex];
                
//                 // Log positions every 2 seconds
//                 logPositions(landmarks, handIndex);
                
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
//             } else {
//               setHandsDetected(0);
//               setLandmarkPositions([]);
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
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-4">
//         <div className="text-center mb-8">
//           <div className="text-8xl mb-6">🧼</div>
//           <h1 className="text-white text-5xl font-bold mb-4">
//             Hand Hygiene Training
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
//           className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-2xl font-bold rounded-2xl px-12 py-6 shadow-2xl transform hover:scale-105 transition-all"
//         >
//           🚀 Start Training
//         </button>

//         <div className="mt-8 text-center">
//           <p className="text-blue-200 text-base">
//             💡 Point your camera at your hands
//           </p>
         
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-4">
//       <div className="text-center mb-3">
//         <h1 className="text-white text-2xl font-bold mb-1">
//           🧼 Hand Hygiene Training
//         </h1>
//         <button
//           onClick={returnToStart}
//           className="text-blue-300 text-sm hover:text-blue-100 underline"
//         >
//           ← Back to Start
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
//           className="rounded-2xl border-4 border-cyan-400 shadow-2xl"
//           width="640"
//           height="480"
//         ></canvas>

//         {/* Performance Metrics Panel */}
//         <div className="absolute top-[90px] right-2 bg-black/80 rounded-lg px-3 py-2 text-xs space-y-1 border border-cyan-400/30">
//           <div className="text-green-400 font-bold">FPS: {fps}</div>
//           <div className="text-yellow-400">Hands: {handsDetected}</div>
//           <div className="text-purple-400 text-[10px]">MediaPipe</div>
//         </div>

//         {/* Landmark Positions Panel */}
//         {landmarkPositions.length > 0 && (
//           <div className="absolute top-[90px] left-2 bg-black/80 rounded-lg px-3 py-2 text-xs space-y-1 border border-cyan-400/30 max-w-[200px]">
//             <div className="text-cyan-400 font-bold mb-1">Key Positions</div>
//             {landmarkPositions.map((pos, idx) => (
//               <div key={idx} className="text-white/90 text-[10px]">
//                 <span className="text-cyan-300">{pos.label}:</span>
//                 <div className="ml-2">
//                   X: {pos.x.toFixed(3)} Y: {pos.y.toFixed(3)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="absolute top-4 left-4 right-4">
//           <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 border border-cyan-400/30">
//             <div className="flex justify-between mb-2">
//               {handwashingSteps.slice(0, -1).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className={`h-2 flex-1 mx-1 rounded-full transition-all ${
//                     idx < stepIndex
//                       ? "bg-green-400"
//                       : idx === stepIndex
//                       ? "bg-cyan-400 animate-pulse"
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

        

       
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";

export default function MediaPipe() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepText, setStepText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [handsDetected, setHandsDetected] = useState(0);
  const [landmarkPositions, setLandmarkPositions] = useState([]);
  
  const stepIndexRef = useRef(0);
  const lastFrameCaptureRef = useRef(0);
  const lastLogTimeRef = useRef(0);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  const handwashingSteps = [
    {
      text: "Step 1: Wet your hands and apply soap",
      instruction: "Turn on water, wet both hands thoroughly, then apply soap to your palms.",
      gesture: "palms_together"
    },
    {
      text: "Step 2: Rub palms together in circular motions",
      instruction: "Place both palms together and rub them in circular motion for proper soap distribution.",
      gesture: "palms_together"
    },
    {
      text: "Step 3: Rub the back of each hand",
      instruction: "Place one palm on the back of the other hand and rub, then switch hands.",
      gesture: "back_of_hands"
    },
    {
      text: "Step 4: Interlace fingers and clean between them",
      instruction: "Interlock your fingers and rub them together to clean between the fingers.",
      gesture: "interlaced"
    },
    {
      text: "Step 5: Clean thumbs by rotating in opposite palm",
      instruction: "Grasp each thumb with the opposite hand and rotate to clean thoroughly.",
      gesture: "thumb_cleaning"
    },
    {
      text: "Step 6: Rub fingertips on opposite palm",
      instruction: "Place fingertips in opposite palm and rub in circular motion.",
      gesture: "fingertips"
    },
    {
      text: "Step 7: Rinse hands thoroughly",
      instruction: "Hold hands under running water and ensure all soap is rinsed off.",
      gesture: "rinsing"
    },
    {
      text: "✅ Perfect! Handwashing complete - 20 seconds minimum",
      instruction: "Great job! Your hands are now properly sanitized.",
      gesture: "complete"
    }
  ];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 0.9;
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

  const logPositions = (landmarks, handIndex) => {
    const now = Date.now();
    if (now - lastLogTimeRef.current > 2000) {
      lastLogTimeRef.current = now;
      
      const positionData = {
        timestamp: now,
        mode: "handwashing",
        step: stepIndexRef.current,
        hand: handIndex,
        landmarks: landmarks.map((lm, idx) => ({
          id: idx,
          x: lm.x.toFixed(4),
          y: lm.y.toFixed(4),
          z: lm.z ? lm.z.toFixed(4) : null
        }))
      };
      
      console.log(`[HAND ${handIndex} POSITIONS - ${now}]`, positionData);
    }
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
    setFeedback("🤖 AI analyzing technique...");

    try {
      const base64Data = imageData.split(',')[1];
      
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
                  text: `You are an AI healthcare training instructor analyzing handwashing technique.

Current Step: ${handwashingSteps[currentStep].text}
Required Action: ${handwashingSteps[currentStep].instruction}

Analyze the image and provide guidance. Check if the person's hand position and movements match the requirements for this step.

Respond ONLY in this JSON format:
{
  "correct": true/false,
  "feedback": "Brief feedback (1-2 sentences)"
}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const endTime = Date.now();
      setLatency(endTime - startTime);
      
      const textContent = data.content.find(item => item.type === "text")?.text || "";
      const cleanText = textContent.replace(/```json|```/g, "").trim();
      const result = JSON.parse(cleanText);
      
      if (result.correct) {
        setFeedback(`✅ ${result.feedback}`);
        speak(result.feedback);
        setTimeout(() => advanceStep(currentStep + 1), 2000);
      } else {
        setFeedback(`⚠️ ${result.feedback}`);
        speak(result.feedback);
      }
      
    } catch (error) {
      console.error("AI Analysis error:", error);
      setFeedback(`❌ AI unavailable. Auto-advancing...`);
      setTimeout(() => advanceStep(currentStep + 1), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const advanceStep = (newIndex) => {
    if (newIndex < handwashingSteps.length) {
      stepIndexRef.current = newIndex;
      setStepIndex(newIndex);
      setStepText(handwashingSteps[newIndex].text);
      setFeedback("");
      speak(handwashingSteps[newIndex].text);
    }
  };

  const startTraining = () => {
    setIsStarted(true);
    setStepIndex(0);
    stepIndexRef.current = 0;
    setStepText("");
    setFeedback("Starting camera...");
    setTimeout(() => {
      setStepText(handwashingSteps[0].text);
      speak(handwashingSteps[0].text);
      setFeedback("");
    }, 2000);
  };

  const returnToStart = () => {
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
              setHandsDetected(results.multiHandLandmarks.length);
              
              // Update landmark positions for display
              if (results.multiHandLandmarks.length > 0) {
                const firstHandLandmarks = results.multiHandLandmarks[0];
                setLandmarkPositions([
                  { label: 'Wrist', x: firstHandLandmarks[0].x, y: firstHandLandmarks[0].y },
                  { label: 'Thumb Tip', x: firstHandLandmarks[4].x, y: firstHandLandmarks[4].y },
                  { label: 'Index Tip', x: firstHandLandmarks[8].x, y: firstHandLandmarks[8].y },
                  { label: 'Middle Tip', x: firstHandLandmarks[12].x, y: firstHandLandmarks[12].y }
                ]);
              }
              
              for (let handIndex = 0; handIndex < results.multiHandLandmarks.length; handIndex++) {
                const landmarks = results.multiHandLandmarks[handIndex];
                
                // Log positions every 2 seconds
                logPositions(landmarks, handIndex);
                
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
            } else {
              setHandsDetected(0);
              setLandmarkPositions([]);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-5xl sm:text-6xl md:text-8xl mb-4 md:mb-6">🧼</div>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 px-2">
            Hand Hygiene Training
          </h1>
          <p className="text-blue-200 text-base sm:text-lg md:text-xl mb-2 px-4">
            AI-Powered AR Training System
          </p>
          <p className="text-blue-300 text-sm sm:text-base px-4">
            Learn the proper 7-step handwashing technique
          </p>
        </div>

        <button
          onClick={startTraining}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg sm:text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 shadow-2xl transform hover:scale-105 transition-all"
        >
          🚀 Start Training
        </button>

        <div className="mt-6 md:mt-8 text-center px-4">
          <p className="text-blue-200 text-sm sm:text-base">
            💡 Point your camera at your hands
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 p-2 sm:p-4">
      <div className="text-center mb-2 sm:mb-3">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1">
          🧼 Hand Hygiene Training
        </h1>
        <button
          onClick={returnToStart}
          className="text-blue-300 text-xs sm:text-sm hover:text-blue-100 underline"
        >
          ← Back to Start
        </button>
      </div>
      
      <div className="relative w-full max-w-[640px]">
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
          className="rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-4 border-cyan-400 shadow-2xl w-full h-auto"
          width="640"
          height="480"
        ></canvas>

        {/* Performance Metrics Panel */}
        <div className="absolute top-[45px] sm:top-[60px] md:top-[80px] lg:top-[90px] right-1 sm:right-2 bg-black/90 rounded px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 space-y-1 border-2 border-cyan-400/50 shadow-lg min-w-[65px] sm:min-w-[75px] md:min-w-[85px] z-10">
          <div className="text-green-400 font-bold text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap">FPS: {fps}</div>
          <div className="text-yellow-400 text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap">Hands: {handsDetected}</div>
          <div className="text-purple-400 text-[9px] sm:text-[10px] md:text-[11px] whitespace-nowrap">MediaPipe</div>
        </div>

        {/* Landmark Positions Panel */}
        {landmarkPositions.length > 0 && (
          <div className="absolute top-[45px] sm:top-[60px] md:top-[80px] lg:top-[90px] left-1 sm:left-2 bg-black/90 rounded px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 space-y-1 border-2 border-cyan-400/50 shadow-lg w-[125px] sm:w-[145px] md:w-[165px] lg:w-[185px] z-10">
            <div className="text-cyan-400 font-bold mb-1 text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap">Key Positions</div>
            {landmarkPositions.map((pos, idx) => (
              <div key={idx} className="text-white text-[9px] sm:text-[10px] md:text-[11px] leading-[1.4]">
                <div className="text-cyan-300 font-semibold whitespace-nowrap">{pos.label}:</div>
                <div className="ml-1 whitespace-nowrap">
                  X: {pos.x.toFixed(3)} Y: {pos.y.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-cyan-400/30">
            <div className="flex justify-between mb-1.5 sm:mb-2">
              {handwashingSteps.slice(0, -1).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 sm:h-2 flex-1 mx-0.5 sm:mx-1 rounded-full transition-all ${
                    idx < stepIndex
                      ? "bg-green-400"
                      : idx === stepIndex
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">
              {stepText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}