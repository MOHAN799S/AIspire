'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import * as THREE from 'three';
import Link from 'next/link';

export default function NotFound() {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 20);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Responsive camera positioning
    camera.position.z = window.innerWidth < 768 ? 6 : 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
    mount.appendChild(renderer.domElement);

    // Wireframe globe - responsive size
    const globeSize = window.innerWidth < 768 ? 2.5 : 3;
    const globeGeometry = new THREE.SphereGeometry(globeSize, 20, 20);
    const globeWireframe = new THREE.WireframeGeometry(globeGeometry);
    const globeLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const globe = new THREE.LineSegments(globeWireframe, globeLineMaterial);
    scene.add(globe);

    // Solid globe overlay
    const solidGlobeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
    });
    const solidGlobe = new THREE.Mesh(globeGeometry, solidGlobeMaterial);
    scene.add(solidGlobe);

    // Particles - responsive count
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 100 : 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.02 : 0.015,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight1.position.set(3, 3, 3);
    const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
    pointLight2.position.set(-3, -3, 3);
    scene.add(ambientLight, pointLight1, pointLight2);

    // Mouse and touch interaction
    const mouse = { x: 0, y: 0 };
    
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      globe.rotation.y += 0.002;
      globe.rotation.x += 0.001;
      solidGlobe.rotation.y += 0.002;
      solidGlobe.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.0005;

      // Reduced mouse effect on mobile
      const mouseEffect = window.innerWidth < 768 ? 0.15 : 0.3;
      camera.position.x += (mouse.x * mouseEffect - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * mouseEffect - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 3;

      renderer.render(scene, camera);
    };
    animate();

    setTimeout(() => setIsLoaded(true), 100);

    // Resize handling with responsive updates
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = window.innerWidth < 768 ? 6 : 5;
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(animationId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      globeGeometry.dispose();
      globeWireframe.dispose();
      globeLineMaterial.dispose();
      solidGlobeMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center px-4 sm:px-6 md:px-8 max-w-xs sm:max-w-md md:max-w-2xl w-full">
          {/* Responsive heading */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">
            404 NOT FOUND
          </h2>
          
          {/* Responsive description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 drop-shadow-md">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          {/* Responsive button container */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full sm:w-auto">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link
              href="/"
              className="group flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Return Home
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive loading spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}