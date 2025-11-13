


// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const steps = [
//   { text: "Step 1: Wet your hands and apply soap", model: "/image/two_hands.glb" },
//   { text: "Step 2: Rub palms together in circular motions", model: "/image/two_hands.glb" },
//   { text: "Step 3: Rub the back of each hand", model: "/image/two_hands.glb" },
//   { text: "Step 4: Interlace fingers and clean between them", model: "/image/two_hands.glb" },
//   { text: "Step 5: Clean thumbs by rotating in opposite palm", model: "/image/two_hands.glb" },
//   { text: "Step 6: Rub fingertips on opposite palm", model: "/image/two_hands.glb" },
//   { text: "Step 7: Rinse hands thoroughly", model: "/image/two_hands.glb" },
// ];

// const Three = () => {
//   const mountRef = useRef(null);
//   const overlayRef = useRef(null);
//   const mixerRef = useRef(null);
//   const clock = useRef(new THREE.Clock());
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isARActive, setIsARActive] = useState(false);

//   useEffect(() => {
//     let scene, camera, renderer;

//     const init = () => {
//       scene = new THREE.Scene();

//       camera = new THREE.PerspectiveCamera(
//         70,
//         window.innerWidth / window.innerHeight,
//         0.01,
//         20
//       );

//       renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderer.xr.enabled = true;
//       renderer.setClearColor(0x000000, 0);
//       scene.background = null;
//       renderer.domElement.style.position = "absolute";
//       renderer.domElement.style.top = "0";
//       renderer.domElement.style.left = "0";
//       mountRef.current.appendChild(renderer.domElement);

//       // AR Button
//       // const arButton = ARButton.createButton(renderer, {
//       //   optionalFeatures: ["local-floor", "dom-overlay"],
//       //   domOverlay: { root: document.body },
//       // });
//       // arButton.style.position = "absolute";
//       // arButton.style.bottom = "20px";
//       // arButton.style.left = "50%";
//       // arButton.style.transform = "translateX(-50%)";
//       // arButton.style.zIndex = "100";
//       // mountRef.current.appendChild(arButton);

//       const arButton = ARButton.createButton(renderer, {
//   optionalFeatures: ["local-floor", "dom-overlay"],
//   domOverlay: { root: document.body },
// });

// // Responsive + clear Start AR button
// arButton.textContent = "Start AR";
// Object.assign(arButton.style, {
//   position: "fixed",
//   bottom: "5vh", // responsive spacing from bottom
//   left: "40%",
//   transform: "translateX(-50%)",
//   padding: "clamp(10px, 2vh, 16px) clamp(24px, 5vw, 40px)", // responsive padding
//   fontSize: "clamp(10px, 1.5vw, 14px)", // responsive font
//   fontWeight: "600",
//   backgroundColor: "#d70f6c", // Tailwind blue-600
//   color: "#ffffff",
//   border: "none",
//   borderRadius: "9999px", // fully rounded
//   cursor: "pointer",
 
//   boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
//   transition: "transform 0.2s ease, opacity 0.2s ease",
// });

// // Keep hover color same as background for clarity
// arButton.onmouseenter = () => (arButton.style.opacity = "0.9");
// arButton.onmouseleave = () => (arButton.style.opacity = "1");
// arButton.onmousedown = () => (arButton.style.transform = "translateX(-50%) scale(0.97)");
// arButton.onmouseup = () => (arButton.style.transform = "translateX(-50%) scale(1)");

// mountRef.current.appendChild(arButton);


//       // Lights
//       const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//       scene.add(hemiLight);
//       const dirLight = new THREE.DirectionalLight(0xffffff, 1);
//       dirLight.position.set(0, 5, 5);
//       scene.add(dirLight);

//       // 🔊 Speech synthesis
//       const speak = (text) => {
//         if (!("speechSynthesis" in window)) {
//           console.warn("Speech Synthesis not supported.");
//           return;
//         }
//         window.speechSynthesis.cancel();
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = "en-US";
//         utterance.pitch = 1;
//         utterance.rate = 1;
//         window.speechSynthesis.speak(utterance);
//       };

      
//       const unlockVoice = () => {
//         const silent = new SpeechSynthesisUtterance("");
//         window.speechSynthesis.speak(silent);
//         document.removeEventListener("click", unlockVoice);
//         console.log("Voice unlocked.");
        
//       };
//       document.addEventListener("click", unlockVoice, { once: true });

//       // AR session events
//       // renderer.xr.addEventListener("sessionstart", () => {
//       //   console.log("AR Session Started!");
//       //   setIsARActive(true);
//       //   setCurrentStep(0);
//       //   showStep(0);
//       // });

//       // AR session events
// renderer.xr.addEventListener("sessionstart", () => {
//   console.log("AR Session Started!");
  
//   // Unlock and start voice immediately
//   const silent = new SpeechSynthesisUtterance("");
//   window.speechSynthesis.speak(silent);
  
//   setIsARActive(true);
//   setCurrentStep(0);
//   showStep(0);
  
   
// });

//       renderer.xr.addEventListener("sessionend", () => {
//         setIsARActive(false);
//         scene.children
//           .filter((child) => !(child instanceof THREE.Light))
//           .forEach((child) => scene.remove(child));
//       });

//       // Animation loop
//       renderer.setAnimationLoop(() => {
//         const delta = clock.current.getDelta();
//         if (mixerRef.current) mixerRef.current.update(delta);
//         renderer.render(scene, camera);
//       });

//       // Handle resize
//       const handleResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//       };
//       window.addEventListener("resize", handleResize);

//       // Show steps
//       function showStep(index) {
//         setCurrentStep(index);
//         scene.children
//           .filter((child) => !(child instanceof THREE.Light))
//           .forEach((child) => scene.remove(child));

//         const step = steps[index];
//         const loader = new GLTFLoader();
//         loader.load(
//           step.model,
//           (gltf) => {
//             const model = gltf.scene;
//             model.position.set(0, 0, -1.5);
//             model.scale.set(0.2, 0.2, 0.2);
//             model.rotation.y = Math.PI;
//             scene.add(model);

//             mixerRef.current = new THREE.AnimationMixer(model);
//             if (gltf.animations.length > 0) {
//               mixerRef.current.clipAction(gltf.animations[0]).play();
//             }
//           },
//           undefined,
//           (error) => console.error("Error loading model:", error)
//         );

//         // 🔊 Speak the step text
//         speak(step.text);

//         if (index < steps.length - 1) {
//           setTimeout(() => showStep(index + 1), 5000);
//         }
//       }

//       return () => {
//         renderer.setAnimationLoop(null);
//         window.removeEventListener("resize", handleResize);
//       };
//     };

//     const cleanup = init();
//     return () => {
//       if (cleanup) cleanup();
//       if (mountRef.current) mountRef.current.innerHTML = "";
//     };
//   }, []);

//   return (
//     <div className="relative w-screen h-screen overflow-hidden">
//       {/* Three.js AR Canvas */}
//       <div ref={mountRef} className="absolute inset-0" />

//       {/* Overlay for current step */}
//       {isARActive && (
//         <div
//           ref={overlayRef}
//           className="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-center pointer-events-none max-w-md shadow-2xl border-4 border-white"
//           style={{ zIndex: 9999 }}
//         >
//           <p className="text-2xl font-bold">
//             {steps[currentStep]?.text || "Loading..."}
//           </p>
//         </div>
//       )}

//       {/* Pre-AR instructions */}
//       {!isARActive && (
//         <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
//           <div className="bg-white bg-opacity-90 text-gray-800 px-8 py-6 rounded-lg text-center max-w-sm mx-4 mb-6">
//             <h2 className="text-xl font-bold mb-2">Hand Washing AR Tutorial</h2>
//           </div>

//           {/* Updated instruction box */}
//           <div className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg shadow-lg max-w-xs mx-4 relative -mt-8">
//             <p className="text-base font-medium">
//                Tap <strong>“Start AR”</strong> below to begin your
//               interactive hand-washing guide.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Three;


import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const steps = [
  { text: "Step 1: Wet your hands and apply soap", model: "/image/two_hands.glb" },
  { text: "Step 2: Rub palms together in circular motions", model: "/image/two_hands.glb" },
  { text: "Step 3: Rub the back of each hand", model: "/image/two_hands.glb" },
  { text: "Step 4: Interlace fingers and clean between them", model: "/image/two_hands.glb" },
  { text: "Step 5: Clean thumbs by rotating in opposite palm", model: "/image/two_hands.glb" },
  { text: "Step 6: Rub fingertips on opposite palm", model: "/image/two_hands.glb" },
  { text: "Step 7: Rinse hands thoroughly", model: "/image/two_hands.glb" },
];

const Three = () => {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const mixerRef = useRef(null);
  const clock = useRef(new THREE.Clock());
  const [currentStep, setCurrentStep] = useState(0);
  const [isARActive, setIsARActive] = useState(false);

  useEffect(() => {
    let scene, camera, renderer;
    let stepTimer = null;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      renderer.setClearColor(0x000000, 0);
      scene.background = null;
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      mountRef.current.appendChild(renderer.domElement);

      // AR Button
      const arButton = ARButton.createButton(renderer, {
        optionalFeatures: ["local-floor", "dom-overlay"],
        domOverlay: { root: document.body },
      });

      // Responsive + clear Start AR button
      arButton.textContent = "Start AR";
      Object.assign(arButton.style, {
        position: "fixed",
        bottom: "5vh",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "clamp(10px, 2vh, 16px) clamp(24px, 5vw, 40px)",
        fontSize: "clamp(10px, 1.5vw, 14px)",
        fontWeight: "600",
        backgroundColor: "#d70f6c",
        color: "#ffffff",
        border: "none",
        borderRadius: "9999px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease, opacity 0.2s ease",
        zIndex: "100",
      });

      arButton.onmouseenter = () => (arButton.style.opacity = "0.9");
      arButton.onmouseleave = () => (arButton.style.opacity = "1");
      arButton.onmousedown = () => (arButton.style.transform = "translateX(-50%) scale(0.97)");
      arButton.onmouseup = () => (arButton.style.transform = "translateX(-50%) scale(1)");

      mountRef.current.appendChild(arButton);

      // Lights
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(hemiLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(0, 5, 5);
      scene.add(dirLight);

      // Speech synthesis
      const speak = (text) => {
        if (!("speechSynthesis" in window)) {
          console.warn("Speech Synthesis not supported.");
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.pitch = 1;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      };

      // Show steps function
      function showStep(index) {
        // Clear any existing timer first
        if (stepTimer) {
          clearTimeout(stepTimer);
          stepTimer = null;
        }

        setCurrentStep(index);
        
        // Remove previous models (keep lights)
        scene.children
          .filter((child) => !(child instanceof THREE.Light))
          .forEach((child) => scene.remove(child));

        const step = steps[index];
        const loader = new GLTFLoader();
        
        loader.load(
          step.model,
          (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.2, 0.2, 0.2);
            model.rotation.y = Math.PI;
            scene.add(model);

            mixerRef.current = new THREE.AnimationMixer(model);
            if (gltf.animations.length > 0) {
              mixerRef.current.clipAction(gltf.animations[0]).play();
            }
          },
          undefined,
          (error) => console.error("Error loading model:", error)
        );

        // Speak the step text
        speak(step.text);

        // Move to next step after 5 seconds
        if (index < steps.length - 1) {
          stepTimer = setTimeout(() => showStep(index + 1), 5000);
        }
      }

      // AR session start
      renderer.xr.addEventListener("sessionstart", () => {
        console.log("AR Session Started!");
        
        // Unlock voice with silent utterance
        const silent = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(silent);
        
        setIsARActive(true);
        
        // Small delay to ensure voice is unlocked, then start from step 0
        setTimeout(() => {
          setCurrentStep(0);
          showStep(0);
        }, 150);
      });

      // AR session end
      renderer.xr.addEventListener("sessionend", () => {
        console.log("AR Session Ended!");
        
        // Clear timer and stop voice
        if (stepTimer) {
          clearTimeout(stepTimer);
          stepTimer = null;
        }
        window.speechSynthesis.cancel();
        
        setIsARActive(false);
        setCurrentStep(0);
        
        // Clean up scene
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

      return () => {
        if (stepTimer) clearTimeout(stepTimer);
        window.speechSynthesis.cancel();
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

      {/* Overlay for current step */}
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

      {/* Pre-AR instructions */}
      {!isARActive && (
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-90 text-gray-800 px-8 py-6 rounded-lg text-center max-w-sm mx-4 mb-6">
            <h2 className="text-xl font-bold mb-2">Hand Washing AR Tutorial</h2>
          </div>

          <div className="bg-blue-600 text-white text-center px-6 py-3 rounded-lg shadow-lg max-w-xs mx-4 relative -mt-8">
            <p className="text-base font-medium">
              Tap <strong>"Start AR"</strong> below to begin your
              interactive hand-washing guide.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Three;
