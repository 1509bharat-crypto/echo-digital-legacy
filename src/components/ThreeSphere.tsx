'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IMAGE_PATHS } from '@/lib/imagePaths';
import imageMetadata from '@/lib/imageMetadata.json';

export default function ThreeSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [phase4Progress, setPhase4Progress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Basic setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 18;
    camera.position.x = -4; // Initial offset to align with "O" in "echo"
    camera.position.y = 1; // Move down slightly

    // Load textures
    const textureLoader = new THREE.TextureLoader();


    // Create sphere of points
    const pointCount = 1500;
    const radius = 2;
    const group = new THREE.Group();
    const meshes: Array<{
      mesh: THREE.Group;
      baseScale: number;
      imageOpacity: number;
      targetImageOpacity: number;
      textOpacity: number;
      targetTextOpacity: number;
    }> = [];

    for (let i = 0; i < pointCount; i++) {
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Add random offset to radius for varied depth
      const randomOffset = (Math.random() - 0.5) * 1.2;
      const r = radius + randomOffset;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Create a group for each square (white base + image overlay)
      const squareGroup = new THREE.Group();

      // Base white square
      const geometry = new THREE.PlaneGeometry(0.08, 0.08);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const baseSquare = new THREE.Mesh(geometry, baseMaterial);
      squareGroup.add(baseSquare);

      // Image overlay (initially transparent)
      const imageMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });

      // Load random image texture
      const randomImagePath = IMAGE_PATHS[Math.floor(Math.random() * IMAGE_PATHS.length)];

      // Store the image path for this mesh to retrieve metadata later
      const currentImagePath = randomImagePath;

      textureLoader.load(
        randomImagePath,
        (texture) => {
          // Ensure image fills the square without stretching
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          // Calculate UV mapping to fill square while maintaining aspect ratio
          const imageAspect = texture.image.width / texture.image.height;

          if (imageAspect > 1) {
            // Image is wider than tall - crop horizontally
            texture.repeat.set(1 / imageAspect, 1);
            texture.offset.set((1 - 1 / imageAspect) / 2, 0);
          } else {
            // Image is taller than wide - crop vertically
            texture.repeat.set(1, imageAspect);
            texture.offset.set(0, (1 - imageAspect) / 2);
          }

          imageMaterial.map = texture;
          imageMaterial.needsUpdate = true;
        },
        undefined,
        () => {
          // Fallback: use a color if image fails to load
          imageMaterial.color = new THREE.Color(0x888888);
        }
      );

      const imageSquare = new THREE.Mesh(geometry.clone(), imageMaterial);
      imageSquare.position.z = 0.001; // Slightly in front of base square
      squareGroup.add(imageSquare);

      // Create text label below image with real metadata
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;

      // Get metadata for this specific image
      const metadata = imageMetadata[currentImagePath as keyof typeof imageMetadata];

      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.font = '16px "Google Sans", sans-serif';
      context.textAlign = 'left';

      if (metadata) {
        context.fillText(metadata.location, 10, 24);
        context.fillText(metadata.date, 10, 44);
      }

      const textTexture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const textGeometry = new THREE.PlaneGeometry(0.08, 0.02);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.y = -0.05; // Position below the image
      textMesh.position.z = 0.002; // Slightly in front
      squareGroup.add(textMesh);

      squareGroup.position.set(x, y, z);
      squareGroup.lookAt(0, 0, 0);

      group.add(squareGroup);

      // Store mesh data for interactivity
      meshes.push({
        mesh: squareGroup,
        baseScale: 1,
        imageOpacity: 0,
        targetImageOpacity: 0,
        textOpacity: 0,
        targetTextOpacity: 0,
      });
    }

    scene.add(group);

    // Scroll tracking with lerp
    let scrollProgress = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let currentZ = 18;
    let currentX = -4;
    let currentY = 1;
    let targetZ = 18;
    let targetX = -4;
    let targetY = 1;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentSphereScale = 1;
    let targetSphereScale = 1;

    // Update scroll-based targets in animation loop for smoothness
    const updateScrollTargets = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = window.scrollY / scrollHeight;

      // Phase 1: 0% - 33% scroll = zoom in (z: 18 to 0.3)
      // Organic rotation: Start slow, accelerate (left to right)
      if (scrollProgress <= 0.33) {
        const phase1Progress = scrollProgress / 0.33;
        targetZ = 18 - phase1Progress * 17.7;
        targetX = -4 + phase1Progress * 4; // Move from -4 to 0
        targetY = 1 - phase1Progress * 0.5; // Move from 1 to 0.5
        targetRotationY = -phase1Progress * Math.PI * 1.4; // 0° to -252° (left to right rotation)
        targetRotationX = 0;

        // Logo fade out
        if (logoRef.current) {
          logoRef.current.style.opacity = String(1 - phase1Progress);
        }
      } else if (scrollProgress <= 0.40) {
        // Phase 2: 33% - 40% scroll = zoom in closer to see the wall of photos
        // Organic rotation: Gentle continuation (left to right)
        const phase2Progress = (scrollProgress - 0.33) / 0.07;
        targetZ = 0.3 - phase2Progress * 1.0; // Zoom from 0.3 to -0.7 (deep inside the wall)
        targetX = 0; // Keep centered
        targetY = 0.5; // Keep centered vertically
        targetRotationY = -Math.PI * 1.4 - phase2Progress * Math.PI * 0.35; // -252° to -315° (gentle 63° turn)
        targetRotationX = 0;

        // Keep logo hidden
        if (logoRef.current) {
          logoRef.current.style.opacity = '0';
        }
      } else if (scrollProgress <= 0.60) {
        // Phase 3: 40% - 60% scroll = interactive rotation while zooming deeper
        // Organic rotation: Slow down for exploration (left to right)
        const phase3Progress = (scrollProgress - 0.40) / 0.20;
        targetZ = -0.7 - phase3Progress * 0.4; // Zoom from -0.7 to -1.1 (deeper inside)
        targetX = 0; // Keep centered
        targetY = 0.5; // Keep centered vertically
        targetRotationY = -Math.PI * 1.75 - phase3Progress * Math.PI * 0.6; // -315° to -423° (108° for exploration)
        targetRotationX = 0;

        // Keep logo hidden
        if (logoRef.current) {
          logoRef.current.style.opacity = '0';
        }
      } else if (scrollProgress <= 0.80) {
        // Phase 4: 60% - 80% scroll = scale up sphere, fade out squares, fade in text
        const phase4Progress = (scrollProgress - 0.60) / 0.20;
        targetZ = -1.1; // Keep deep zoom
        targetX = 0;
        targetY = 0.5;
        // Continue organic rotation: -423° to -567° (144° gentle turn)
        targetRotationY = -Math.PI * 2.35 - phase4Progress * Math.PI * 0.8; // -423° to -567°
        targetRotationX = 0;
        targetSphereScale = 1 + phase4Progress * 2; // Scale from 1 to 3

        // Keep logo hidden
        if (logoRef.current) {
          logoRef.current.style.opacity = '0';
        }
      } else {
        // After Phase 4
        targetZ = -1.1;
        targetX = 0;
        targetY = 0.5;
        targetRotationY = -Math.PI * 3.15; // Keep final rotation at -567°
        targetRotationX = 0;
        targetSphereScale = 3; // Keep scaled

        if (logoRef.current) {
          logoRef.current.style.opacity = '0';
        }
      }
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Group | null = null;
    let rotationPaused = false;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);

      if (intersects.length > 0) {
        // Find the parent group (squareGroup)
        let parentGroup = intersects[0].object.parent;
        while (parentGroup && !(parentGroup.parent === group)) {
          parentGroup = parentGroup.parent;
        }

        if (parentGroup && parentGroup !== hoveredMesh) {
          // Reset previous hovered mesh
          if (hoveredMesh) {
            const prevData = meshes.find(m => m.mesh === hoveredMesh);
            if (prevData) {
              prevData.baseScale = 1;
            }
          }

          hoveredMesh = parentGroup as THREE.Group;
          rotationPaused = true;

          // Scale up hovered mesh
          const meshData = meshes.find(m => m.mesh === hoveredMesh);
          if (meshData) {
            meshData.baseScale = 2;
          }
        }
      } else {
        // No hover
        if (hoveredMesh) {
          const prevData = meshes.find(m => m.mesh === hoveredMesh);
          if (prevData) {
            prevData.baseScale = 1;
          }
          hoveredMesh = null;
          rotationPaused = false;
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let autoRotation = 0;

    function animate() {
      requestAnimationFrame(animate);

      // Update scroll targets every frame for smooth animation
      updateScrollTargets();

      // Gentle auto rotation (pause when hovering) - left to right
      if (!rotationPaused) {
        autoRotation -= 0.0005;
      }

      // Smooth lerp to targets
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentZ += (targetZ - currentZ) * 0.05;
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      currentSphereScale += (targetSphereScale - currentSphereScale) * 0.05;

      group.rotation.y = currentRotationY + autoRotation;
      group.rotation.x = currentRotationX;
      group.scale.set(currentSphereScale, currentSphereScale, currentSphereScale);
      camera.position.z = currentZ;
      camera.position.x = currentX;
      camera.position.y = currentY;

      // Image fade-in during Phase 2 (33%-40%)
      const imageFadeProgress = scrollProgress > 0.33 && scrollProgress <= 0.40
        ? (scrollProgress - 0.33) / 0.07
        : scrollProgress > 0.40 ? 1 : 0;

      // Text fade-in during Phase 3 (40%-60%)
      const textFadeProgress = scrollProgress > 0.40 && scrollProgress <= 0.60
        ? (scrollProgress - 0.40) / 0.20
        : scrollProgress > 0.60 ? 1 : 0;

      // Phase 4 effects (60%-80%)
      const phase4ProgressValue = scrollProgress > 0.60 && scrollProgress <= 0.80
        ? (scrollProgress - 0.60) / 0.20
        : scrollProgress > 0.80 ? 1 : 0;

      // Update state for React component
      setPhase4Progress(phase4ProgressValue);

      // Update each mesh
      meshes.forEach((meshData) => {
        const squareGroup = meshData.mesh;
        const worldPos = new THREE.Vector3();
        squareGroup.getWorldPosition(worldPos);

        // Calculate depth for base white square opacity
        const depth = worldPos.z;
        const normalizedDepth = (depth + radius) / (radius * 2);
        let baseOpacity = 0.1 + normalizedDepth * 0.9;

        // Fade out squares during Phase 4
        if (scrollProgress > 0.60) {
          baseOpacity *= (1 - phase4ProgressValue);
        }

        // Update base square opacity
        const baseSquare = squareGroup.children[0] as THREE.Mesh;
        if (baseSquare.material) {
          (baseSquare.material as THREE.MeshBasicMaterial).opacity = baseOpacity;
        }

        // Show images on all squares once in Phase 2 or later
        const showImages = scrollProgress >= 0.33 && scrollProgress < 0.60;

        // Fade in images during Phase 2, fade out during Phase 4
        let targetImageOpacity = showImages ? imageFadeProgress : 0;
        if (scrollProgress >= 0.60) {
          targetImageOpacity = imageFadeProgress * (1 - phase4ProgressValue);
        }
        meshData.targetImageOpacity = targetImageOpacity;
        meshData.imageOpacity += (meshData.targetImageOpacity - meshData.imageOpacity) * 0.1;

        // Update image square opacity
        const imageSquare = squareGroup.children[1] as THREE.Mesh;
        if (imageSquare.material) {
          (imageSquare.material as THREE.MeshBasicMaterial).opacity = meshData.imageOpacity;
        }

        // Fade in text during Phase 3, fade out during Phase 4
        let targetTextOpacity = textFadeProgress;
        if (scrollProgress >= 0.60) {
          targetTextOpacity = textFadeProgress * (1 - phase4ProgressValue);
        }
        meshData.targetTextOpacity = targetTextOpacity;
        meshData.textOpacity += (meshData.targetTextOpacity - meshData.textOpacity) * 0.1;

        // Update text opacity
        const textMesh = squareGroup.children[2] as THREE.Mesh;
        if (textMesh && textMesh.material) {
          (textMesh.material as THREE.MeshBasicMaterial).opacity = meshData.textOpacity * 0.8;
        }

        // Apply scale (smooth transition)
        const targetScale = meshData.baseScale;
        const currentScale = squareGroup.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.1;
        squareGroup.scale.set(newScale, newScale, newScale);
      });

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed top-0 left-0" />
      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.95) 100%)',
        }}
      />
      <div
        ref={logoRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <svg
          width="1200"
          height="auto"
          viewBox="0 0 886 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M137.77 155.34C136.82 164.23 134.46 171.59 130.68 177.45C126.9 183.31 122.03 187.94 116.08 191.34C110.13 194.74 103.23 197.11 95.39 198.43C87.55 199.75 79.09 200.41 70.02 200.41C59.25 200.41 49.56 198.85 40.96 195.73C32.36 192.61 25.04 188.17 18.99 182.41C12.94 176.65 8.26 169.56 4.96 161.15C1.65 152.74 0 143.25 0 132.66C0 124.16 1.23 115.65 3.68 107.15C6.13 98.6497 10.2 91.0397 15.87 84.3297C21.54 77.6197 29.05 72.1398 38.41 67.8898C47.77 63.6398 59.24 61.5098 72.85 61.5098C84.19 61.5098 94.11 63.3498 102.61 67.0398C111.11 70.7298 118.2 75.9697 123.87 82.7697C129.54 89.5697 133.69 97.6997 136.34 107.15C138.98 116.6 140.12 127.09 139.74 138.61H29.48C29.67 149.95 33.68 159.07 41.53 165.96C49.37 172.86 59.53 176.31 72 176.31C80.12 176.31 86.6 175.56 91.42 174.04C96.24 172.53 99.97 170.69 102.62 168.51C105.26 166.34 107.11 164.02 108.15 161.56C109.19 159.11 109.99 157.02 110.56 155.32H137.77V155.34ZM111.41 122.46C111.03 117.74 110.04 113.25 108.43 109C106.82 104.75 104.41 100.97 101.2 97.6598C97.99 94.3598 93.92 91.7597 89.01 89.8597C84.09 87.9697 78.05 87.0298 70.87 87.0298C64.82 87.0298 59.34 88.0198 54.43 90.0098C49.51 91.9898 45.26 94.6398 41.67 97.9498C38.08 101.26 35.24 105.04 33.17 109.29C31.09 113.54 29.96 117.94 29.77 122.47H111.41V122.46Z"
            fill="white"
          />
          <path
            d="M228.02 176.31C232.74 176.31 237.28 175.93 241.63 175.18C245.98 174.43 249.94 173.05 253.54 171.07C257.13 169.09 260.2 166.44 262.75 163.13C265.3 159.83 267.14 155.71 268.28 150.8L299.18 150.52C297.48 159.97 294.5 167.95 290.25 174.47C286 180.99 280.71 186.28 274.38 190.34C268.05 194.41 260.96 197.33 253.12 199.13C245.28 200.92 236.91 201.82 228.03 201.82C217.83 201.82 208.28 200.5 199.4 197.85C190.52 195.21 182.82 191.1 176.3 185.52C169.78 179.95 164.63 172.72 160.85 163.83C157.07 154.95 155.18 144.27 155.18 131.8C155.18 108.18 161.74 90.6 174.88 79.08C188.01 67.56 205.73 61.79 228.03 61.79C250.33 61.79 266.34 66.56 277.78 76.1C289.21 85.64 296.53 99.2 299.75 116.78L269.7 117.06C267.62 105.72 262.9 97.93 255.53 93.67C248.16 89.41 238.99 87.29 228.03 87.29C221.6 87.29 215.79 88.05 210.6 89.56C205.4 91.07 200.91 93.53 197.14 96.93C193.36 100.33 190.43 104.87 188.35 110.54C186.27 116.21 185.23 123.3 185.23 131.8C185.23 140.3 186.27 147.11 188.35 152.78C190.43 158.45 193.35 163.03 197.14 166.53C200.92 170.03 205.4 172.53 210.6 174.04C215.8 175.55 221.61 176.31 228.03 176.31H228.02Z"
            fill="white"
          />
          <path
            d="M323.12 200.41V0H353.45V95.24C356.09 90.33 359.31 85.89 363.09 81.92C366.87 77.95 370.84 74.46 374.99 71.43C379.14 68.41 383.45 66.04 387.89 64.34C392.33 62.64 396.63 61.79 400.79 61.79C410.99 61.41 419.64 62.74 426.73 65.76C433.82 68.78 439.58 73.04 444.02 78.52C448.46 84 451.63 90.47 453.52 97.94C455.41 105.41 456.36 113.3 456.36 121.61V200.41H426.03V124.44C426.03 113.1 423.38 104.17 418.09 97.65C412.8 91.13 404.38 87.87 392.86 87.87C379.82 87.87 369.99 91.65 363.38 99.21C356.76 106.77 353.46 116.88 353.46 129.54V200.41H323.13H323.12Z"
            fill="white"
          />
          <path
            d="M477.32 131.81C477.32 108.19 483.88 90.6098 497.02 79.0898C510.15 67.5698 527.87 61.7998 550.17 61.7998C572.47 61.7998 589.85 67.5698 602.89 79.0898C615.93 90.6198 622.45 108.19 622.45 131.81C622.45 144.28 620.61 154.96 616.92 163.84C613.23 172.73 608.18 179.95 601.75 185.53C595.32 191.11 587.67 195.22 578.79 197.86C569.91 200.5 560.37 201.83 550.16 201.83C539.95 201.83 530.41 200.51 521.53 197.86C512.65 195.22 504.95 191.11 498.43 185.53C491.91 179.96 486.76 172.73 482.98 163.84C479.2 154.96 477.31 144.28 477.31 131.81H477.32ZM550.17 176.31C556.59 176.31 562.45 175.56 567.75 174.04C573.04 172.53 577.53 170.03 581.21 166.53C584.9 163.04 587.73 158.45 589.71 152.78C591.69 147.11 592.69 140.12 592.69 131.8C592.69 123.48 591.7 116.21 589.71 110.54C587.73 104.87 584.89 100.34 581.21 96.9298C577.53 93.5298 573.03 91.0698 567.75 89.5598C562.46 88.0498 556.6 87.2898 550.17 87.2898C543.74 87.2898 537.93 88.0498 532.74 89.5598C527.54 91.0698 523.05 93.5298 519.28 96.9298C515.5 100.33 512.57 104.87 510.49 110.54C508.41 116.21 507.37 123.3 507.37 131.8C507.37 140.3 508.41 147.11 510.49 152.78C512.57 158.45 515.49 163.03 519.28 166.53C523.06 170.03 527.54 172.53 532.74 174.04C537.94 175.55 543.75 176.31 550.17 176.31Z"
            fill="white"
          />
          <path
            d="M885.12 133.18C885.12 171.01 881.31 201.68 876.62 201.68C873.09 201.68 870.05 184.28 868.77 159.53C866.14 184.28 859.9 201.68 852.62 201.68C845.34 201.68 839.13 184.35 836.48 159.68C831.34 184.35 819.24 201.68 805.12 201.68C791 201.68 778.92 184.39 773.77 159.76C763.39 184.39 739.03 201.68 710.62 201.68C672.79 201.68 642.12 171.01 642.12 133.18C642.12 95.3497 672.79 64.6797 710.62 64.6797C739.03 64.6797 763.39 81.9697 773.77 106.6C778.92 81.9697 791.02 64.6797 805.12 64.6797C819.22 64.6797 831.34 82.0097 836.48 106.68C839.13 82.0097 845.36 64.6797 852.62 64.6797C859.88 64.6797 866.14 82.0797 868.77 106.83C870.05 82.0797 873.09 64.6797 876.62 64.6797C881.31 64.6797 885.12 95.3497 885.12 133.18Z"
            fill="white"
          />
        </svg>
      </div>
      {/* Phase 4 Big Text */}
      <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
        <div
          className="w-full h-screen flex items-center justify-center text-center px-4"
          style={{
            opacity: phase4Progress,
            fontWeight: 100 + (phase4Progress * 400), // 100 (thin) to 500 (medium)
          }}
        >
          <p className="text-white text-6xl font-sans max-w-5xl">
            What happens to our digital presence when we pass away?
          </p>
        </div>
      </div>
      <div className="h-[300vh] pointer-events-auto" />
    </>
  );
}
