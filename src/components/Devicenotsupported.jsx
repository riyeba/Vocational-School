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

export default function Hand washing() {
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