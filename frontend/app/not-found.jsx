'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import * as THREE from 'three';
import Link from 'next/link';

export default function NotFound() {
  const mountRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Wireframe globe
    const globeGeometry = new THREE.SphereGeometry(3, 20, 20);
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

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
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

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      globe.rotation.y += 0.002;
      globe.rotation.x += 0.001;
      solidGlobe.rotation.y += 0.002;
      solidGlobe.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.0005;

      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 3;

      renderer.render(scene, camera);
    };
    animate();

    // ✅ Mark as loaded safely
    setTimeout(() => setIsLoaded(true), 100); // gives renderer a frame to settle

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
        <div className="text-center px-6 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            404 NOT FOUND
          </h2>
          <p className="text-lg text-gray-400 mb-8 drop-shadow-md">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link href="/" passHref legacyBehavior>
  <a className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
    <Home className="w-4 h-4" />
    Return Home
  </a>
</Link>

          </div>
        </div>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
