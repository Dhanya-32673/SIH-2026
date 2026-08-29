import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RiskStatus } from '../../types/health.types';
import { ShieldCheck, Activity, AlertTriangle, AlertOctagon } from 'lucide-react';

interface WearableVisualizer3DProps {
  status: RiskStatus;
  heartRate: number;
  riskScore: number;
  className?: string;
}

export const WearableVisualizer3D: React.FC<WearableVisualizer3DProps> = ({
  status,
  heartRate,
  riskScore,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useSplineEmbed, setUseSplineEmbed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Status color mapping
  const colors = {
    NORMAL: {
      primary: 0x10b981,
      glow: '#10B981',
      speed: 1.0,
      particleSpeed: 0.005,
      pulseIntensity: 1.0,
    },
    WARNING: {
      primary: 0xf59e0b,
      glow: '#F59E0B',
      speed: 2.2,
      particleSpeed: 0.012,
      pulseIntensity: 1.4,
    },
    CRITICAL: {
      primary: 0xef4444,
      glow: '#EF4444',
      speed: 4.0,
      particleSpeed: 0.025,
      pulseIntensity: 2.2,
    },
  }[status];

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 360;
    const height = mountRef.current.clientHeight || 360;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Group for entire wearable assembly
    const wearableGroup = new THREE.Group();
    scene.add(wearableGroup);

    // 1. Futuristic Smart Wearable Ring Torus (Titanium / Bio-Polymer)
    const ringGeo = new THREE.TorusGeometry(1.8, 0.22, 32, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1a233a,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    mainRing.rotation.x = Math.PI / 3;
    wearableGroup.add(mainRing);

    // 2. Optical Sensor Bezel Matrix (Inner Biometric Core)
    const innerRingGeo = new THREE.TorusGeometry(1.55, 0.08, 16, 80);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.primary,
      emissiveIntensity: status === 'CRITICAL' ? 0.8 : 0.4,
      metalness: 0.5,
      roughness: 0.2,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 3;
    wearableGroup.add(innerRing);

    // 2b. Outer Dotted Orbital Satellite Ring [NEW]
    const orbitRingGeo = new THREE.RingGeometry(2.1, 2.13, 64);
    const orbitRingMat = new THREE.LineBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing = new THREE.LineLoop(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.5;
    wearableGroup.add(orbitRing);

    // 3. Central AI Neural Health Core (Icosahedron pulsating with vitals)
    const coreGeo = new THREE.IcosahedronGeometry(0.75, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.primary,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    wearableGroup.add(coreMesh);

    // 4. Bio-Pulse Waveform Orbit Ring
    const waveGeo = new THREE.TorusGeometry(2.4, 0.03, 16, 120);
    const waveMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.5,
    });
    const waveRing = new THREE.Mesh(waveGeo, waveMat);
    waveRing.rotation.x = Math.PI / 2.2;
    waveRing.rotation.y = Math.PI / 6;
    wearableGroup.add(waveRing);

    // 5. Surrounding Telemetry Particles (With custom velocity properties for gravity)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 1.4 + Math.random() * 2.0;
      particleHeights[i] = (Math.random() - 0.5) * 2.0;
      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = particleHeights[i];
      particlePositions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colors.primary,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    wearableGroup.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colors.primary, 3, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    const blueRimLight = new THREE.PointLight(0x3b82f6, 2, 8);
    blueRimLight.position.set(-3, 3, -2);
    scene.add(blueRimLight);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Dynamic rotation speed based on status
      const rotSpeed = 0.5 * colors.speed;
      wearableGroup.rotation.y += rotSpeed * delta;
      
      // Interpolate core rotation towards mouse direction for high-fidelity 3D parallax
      wearableGroup.rotation.x = THREE.MathUtils.lerp(wearableGroup.rotation.x, Math.sin(time * 0.5) * 0.15 + (mousePos.y * 0.4), 0.1);
      wearableGroup.rotation.z = THREE.MathUtils.lerp(wearableGroup.rotation.z, Math.cos(time * 0.4) * 0.1 + (mousePos.x * 0.4), 0.1);

      // Heartbeat pulse cycle
      const bpmFreq = (heartRate || 75) / 60;
      const pulsePhase = (time * bpmFreq * Math.PI * 2) % (Math.PI * 2);
      const pulseScale = 1 + 0.12 * Math.sin(pulsePhase) * colors.pulseIntensity;
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      coreMesh.rotation.y += 0.8 * delta * colors.speed;
      coreMesh.rotation.x += 0.4 * delta;

      // Pulse wave expansion
      const waveScale = 1 + 0.08 * Math.cos(time * 2.5);
      waveRing.scale.set(waveScale, waveScale, waveScale);
      waveRing.rotation.z += 0.3 * delta;

      // Rotate outer orbital ring opposite to inner components
      orbitRing.rotation.z -= 0.15 * delta * colors.speed;

      // Animate particles along cylindrical orbital shells + apply cursor gravity pull
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        particleAngles[i] += colors.particleSpeed * (1 + (i % 3) * 0.3);
        
        // Base orbit dimensions
        const baseR = particleRadii[i] + Math.sin(time * 2 + i) * 0.05;
        const baseY = particleHeights[i] + Math.cos(time * 1.5 + i) * 0.08;
        
        // Dynamic mouse attraction/gravity offset
        // We pull the positions slightly towards the 3D plane projection of mouse Pos
        const targetX = Math.cos(particleAngles[i]) * baseR;
        const targetY = baseY;
        const targetZ = Math.sin(particleAngles[i]) * baseR;
        
        // Cursor gravity pull: pull towards mouse offset
        const mouseStrength = 0.25;
        positions[i * 3] = THREE.MathUtils.lerp(positions[i * 3], targetX + (mousePos.x * mouseStrength * baseR), 0.08);
        positions[i * 3 + 1] = THREE.MathUtils.lerp(positions[i * 3 + 1], targetY + (mousePos.y * mouseStrength * 1.5), 0.08);
        positions[i * 3 + 2] = THREE.MathUtils.lerp(positions[i * 3 + 2], targetZ, 0.08);
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Dynamic color responsiveness
      innerRingMat.color.setHex(colors.primary);
      innerRingMat.emissive.setHex(colors.primary);
      orbitRingMat.color.setHex(colors.primary);
      coreMat.color.setHex(colors.primary);
      coreMat.emissive.setHex(colors.primary);
      particleMat.color.setHex(colors.primary);
      pointLight.color.setHex(colors.primary);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [status, heartRate, colors, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className}`}
    >
      {/* Background radial aura */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full min-h-[300px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10" />

      {/* Floating Medical HUD Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-medium">
        {status === 'NORMAL' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
        {status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
        {status === 'CRITICAL' && <AlertOctagon className="w-4 h-4 text-red-400 animate-bounce" />}
        <span className="tracking-wider uppercase text-slate-300">
          BIO-CORE: <span className="font-bold text-white">{status}</span>
        </span>
      </div>

      {/* Heart rate & telemetry badge */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-mono">
        <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-slate-400">TELEMETRY:</span>
        <span className="font-bold text-cyan-300">{heartRate} BPM</span>
      </div>
    </div>
  );
};
