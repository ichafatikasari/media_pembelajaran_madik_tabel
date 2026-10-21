import React, { useRef, useEffect, useCallback } from 'react';
import { Lane, RunnerState, Obstacle, Coin } from '../types/game';
import { soundFX } from '../utils/audio';

interface SubwayCanvasProps {
  isPlaying: boolean;
  isPaused: boolean;
  onTriggerQuiz: (distance: number, coins: number) => void;
  onUpdateHUD: (distance: number, coins: number, speed: number) => void;
  // External triggers from TouchControls or Keyboard
  actionTrigger?: { action: 'left' | 'right' | 'jump' | 'slide'; timestamp: number } | null;
}

export const SubwayCanvas: React.FC<SubwayCanvasProps> = ({
  isPlaying,
  isPaused,
  onTriggerQuiz,
  onUpdateHUD,
  actionTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game internal state stored in refs for 60fps loop
  const stateRef = useRef<{
    runner: RunnerState;
    obstacles: Obstacle[];
    coins: Coin[];
    distance: number;
    coinsCollected: number;
    speed: number;
    trackOffset: number;
    shakeTimer: number;
    stumble: boolean;
    gameOverTriggered: boolean;
    nextSpawnZ: number;
    lastTime: number;
    touchStartX: number;
    touchStartY: number;
    touchStartTime: number;
  }>({
    runner: {
      lane: 1,
      targetLane: 1,
      laneX: 0,
      y: 0,
      vy: 0,
      isJumping: false,
      isSliding: false,
      slideTimer: 0,
      runFrame: 0
    },
    obstacles: [],
    coins: [],
    distance: 0,
    coinsCollected: 0,
    speed: 7.5,
    trackOffset: 0,
    shakeTimer: 0,
    stumble: false,
    gameOverTriggered: false,
    nextSpawnZ: 400,
    lastTime: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0
  });

  // Action methods: Left, Right, Jump, Slide
  const moveLeft = useCallback(() => {
    const s = stateRef.current;
    if (s.stumble || s.gameOverTriggered) return;
    if (s.runner.targetLane > 0) {
      s.runner.targetLane = (s.runner.targetLane - 1) as Lane;
      soundFX.playSwitchLane();
    }
  }, []);

  const moveRight = useCallback(() => {
    const s = stateRef.current;
    if (s.stumble || s.gameOverTriggered) return;
    if (s.runner.targetLane < 2) {
      s.runner.targetLane = (s.runner.targetLane + 1) as Lane;
      soundFX.playSwitchLane();
    }
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.stumble || s.gameOverTriggered) return;
    if (!s.runner.isJumping) {
      s.runner.isJumping = true;
      s.runner.isSliding = false;
      s.runner.vy = 14;
      soundFX.playJump();
    }
  }, []);

  const slide = useCallback(() => {
    const s = stateRef.current;
    if (s.stumble || s.gameOverTriggered) return;
    if (s.runner.isJumping) {
      // Fast drop down if jumping
      s.runner.vy = -18;
    }
    s.runner.isSliding = true;
    s.runner.slideTimer = 35; // ~0.6 sec at 60fps
    soundFX.playSlide();
  }, []);

  // Listen to external triggers from TouchButtons
  useEffect(() => {
    if (!actionTrigger || !isPlaying || isPaused) return;
    if (actionTrigger.action === 'left') moveLeft();
    else if (actionTrigger.action === 'right') moveRight();
    else if (actionTrigger.action === 'jump') jump();
    else if (actionTrigger.action === 'slide') slide();
  }, [actionTrigger, isPlaying, isPaused, moveLeft, moveRight, jump, slide]);

  // Keyboard controls for Laptop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key === ' ') {
        jump();
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, moveLeft, moveRight, jump, slide]);

  // Touch Swipe Handlers on Canvas for Smartboard
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    const touch = e.touches[0];
    const s = stateRef.current;
    s.touchStartX = touch.clientX;
    s.touchStartY = touch.clientY;
    s.touchStartTime = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    const s = stateRef.current;
    if (e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - s.touchStartX;
    const dy = touch.clientY - s.touchStartY;
    const dt = Date.now() - s.touchStartTime;

    // Minimum swipe threshold (30px) and max time (500ms)
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (dt < 600 && (absX > 30 || absY > 30)) {
      if (absX > absY) {
        // Horizontal Swipe
        if (dx > 0) moveRight();
        else moveLeft();
      } else {
        // Vertical Swipe
        if (dy < 0) jump();
        else slide();
      }
    }
  };

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset game state on start
    if (isPlaying) {
      const s = stateRef.current;
      s.runner = {
        lane: 1,
        targetLane: 1,
        laneX: 0,
        y: 0,
        vy: 0,
        isJumping: false,
        isSliding: false,
        slideTimer: 0,
        runFrame: 0
      };
      s.obstacles = [];
      s.coins = [];
      s.distance = 0;
      s.coinsCollected = 0;
      s.speed = 7.5;
      s.trackOffset = 0;
      s.shakeTimer = 0;
      s.stumble = false;
      s.gameOverTriggered = false;
      s.nextSpawnZ = 350;

      // Seed initial coins and obstacles
      for (let z = 300; z < 1500; z += 180) {
        const lane = Math.floor(Math.random() * 3) as Lane;
        const types: ('train' | 'barrier' | 'cone')[] = ['barrier', 'cone', 'train'];
        const type = types[Math.floor(Math.random() * types.length)];
        s.obstacles.push({
          id: Math.random(),
          lane,
          z,
          type,
          height: type === 'train' ? 70 : type === 'barrier' ? 45 : 30,
          width: 50,
          canDuckUnder: type === 'barrier',
          canJumpOver: type === 'cone' || type === 'barrier'
        });

        // Spawn coins in other lanes
        const otherLane = ((lane + 1) % 3) as Lane;
        for (let cz = z - 60; cz <= z + 60; cz += 30) {
          s.coins.push({
            id: Math.random(),
            lane: otherLane,
            z: cz,
            collected: false
          });
        }
      }
    }

    const render = () => {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;

      // Handle Resize / Retina Sharpness
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;

      // Screen Shake
      if (s.shakeTimer > 0) {
        s.shakeTimer--;
        const shakeX = (Math.random() - 0.5) * 12;
        const shakeY = (Math.random() - 0.5) * 12;
        ctx.translate(shakeX, shakeY);
      }

      // Update State if playing & not paused
      if (isPlaying && !isPaused && !s.stumble) {
        s.distance += s.speed * 0.12;
        s.trackOffset = (s.trackOffset + s.speed) % 80;
        s.speed = Math.min(13, 7.5 + s.distance * 0.0035);

        // Smooth Runner Lane Transition
        const targetX = (s.runner.targetLane - 1); // -1 (left), 0 (center), 1 (right)
        s.runner.laneX += (targetX - s.runner.laneX) * 0.22;
        if (Math.abs(targetX - s.runner.laneX) < 0.01) {
          s.runner.laneX = targetX;
          s.runner.lane = s.runner.targetLane;
        }

        // Runner Jumping Physics
        if (s.runner.isJumping) {
          s.runner.y += s.runner.vy;
          s.runner.vy -= 0.85; // Gravity
          if (s.runner.y <= 0) {
            s.runner.y = 0;
            s.runner.vy = 0;
            s.runner.isJumping = false;
          }
        }

        // Runner Sliding
        if (s.runner.isSliding) {
          s.runner.slideTimer--;
          if (s.runner.slideTimer <= 0) {
            s.runner.isSliding = false;
          }
        }

        s.runner.runFrame += 0.25;

        // Move Obstacles and Coins toward the player (Z decreases)
        for (const obs of s.obstacles) {
          obs.z -= s.speed;
        }
        for (const c of s.coins) {
          c.z -= s.speed;
        }

        // Spawn new obstacles & coins as player runs
        const maxZ = Math.max(0, ...s.obstacles.map(o => o.z));
        if (maxZ < 1400) {
          const spawnZ = Math.max(1400, maxZ + 190);
          const lane = Math.floor(Math.random() * 3) as Lane;
          const types: ('train' | 'barrier' | 'cone')[] = ['barrier', 'cone', 'train'];
          const type = types[Math.floor(Math.random() * types.length)];
          s.obstacles.push({
            id: Math.random(),
            lane,
            z: spawnZ,
            type,
            height: type === 'train' ? 70 : type === 'barrier' ? 45 : 30,
            width: 50,
            canDuckUnder: type === 'barrier',
            canJumpOver: type === 'cone' || type === 'barrier'
          });

          // Add coins on empty lane
          const coinLane = ((lane + 1 + Math.floor(Math.random() * 2)) % 3) as Lane;
          for (let cz = spawnZ - 50; cz <= spawnZ + 50; cz += 25) {
            s.coins.push({
              id: Math.random(),
              lane: coinLane,
              z: cz,
              collected: false
            });
          }
        }

        // Clean up passed items
        s.obstacles = s.obstacles.filter(o => o.z > -100);
        s.coins = s.coins.filter(c => c.z > -100);

        // Check Coin Collection
        for (const c of s.coins) {
          if (!c.collected && c.z > 20 && c.z < 85) {
            const laneDiff = Math.abs(c.lane - (s.runner.laneX + 1));
            if (laneDiff < 0.45 && s.runner.y < 70) {
              c.collected = true;
              s.coinsCollected += 1;
              soundFX.playCoin();
            }
          }
        }

        // Check Obstacle Collisions
        for (const obs of s.obstacles) {
          // Collision zone in front of character (Z ~ 25 to 70)
          if (obs.z > 25 && obs.z < 75) {
            const laneDiff = Math.abs(obs.lane - (s.runner.laneX + 1));
            if (laneDiff < 0.5) {
              let hasCollided = true;

              // Check if safely jumped over
              if (obs.canJumpOver && s.runner.y > 40) {
                hasCollided = false;
              }

              // Check if safely slid under
              if (obs.canDuckUnder && s.runner.isSliding) {
                hasCollided = false;
              }

              if (hasCollided) {
                // STUMBLE & TRIGGER 1 SISWA = 1 SOAL!
                s.stumble = true;
                s.shakeTimer = 18;
                soundFX.playHit();

                setTimeout(() => {
                  if (!s.gameOverTriggered) {
                    s.gameOverTriggered = true;
                    onTriggerQuiz(Math.floor(s.distance), s.coinsCollected);
                  }
                }, 400);
                break;
              }
            }
          }
        }

        // Also trigger quiz automatically if student reaches 300 meters safely!
        if (s.distance >= 350 && !s.stumble && !s.gameOverTriggered) {
          s.stumble = true;
          s.gameOverTriggered = true;
          onTriggerQuiz(Math.floor(s.distance), s.coinsCollected);
        }

        // Update HUD
        onUpdateHUD(Math.floor(s.distance), s.coinsCollected, Math.floor(s.speed * 3));
      }

      // ==========================================
      // DRAWING: 3D PERSPECTIVE SUBWAY SURFERS WORLD
      // ==========================================

      // 1. Cyber Sky / Subway Tunnel Background
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#0f172a'); // slate-900
      skyGradient.addColorStop(0.3, '#1e293b'); // slate-800
      skyGradient.addColorStop(0.45, '#0284c7'); // sky-600 horizon glow
      skyGradient.addColorStop(1, '#090d16');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Horizon Vanishing Point
      const horizonY = height * 0.28;
      const vpX = width / 2;

      // Distant City Skyline / Neon Billboard
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 12; i++) {
        const bx = (width / 12) * i;
        const bw = width / 12 - 2;
        const bh = 30 + ((i * 37) % 55);
        ctx.fillRect(bx, horizonY - bh, bw, bh);

        // Tiny window lights
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#fbbf24';
        for (let wy = horizonY - bh + 6; wy < horizonY - 4; wy += 10) {
          ctx.fillRect(bx + 4, wy, 4, 4);
        }
        ctx.fillStyle = '#0f172a';
      }

      // Overhead Python Neon Banner
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      const bannerW = Math.min(360, width * 0.7);
      const bannerX = (width - bannerW) / 2;
      ctx.beginPath();
      ctx.roundRect(bannerX, 12, bannerW, 36, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('>>> print("PYTHON SUBWAY RUNNER")', width / 2, 30);
      ctx.restore();

      // 2. Perspective Ground & Subway Tracks
      const trackTopW = width * 0.18; // Narrow at horizon
      const trackBottomW = width * 0.88; // Wide at bottom

      // Perspective projection helper
      // z ranges from 0 (at runner screen bottom) to 1200 (horizon)
      const project = (laneNorm: number, z: number) => {
        // laneNorm: -1 (left), 0 (center), 1 (right)
        const depth = Math.max(0.01, 1 - z / 1200); // 1 at near, 0 at horizon
        const trackW = trackTopW + (trackBottomW - trackTopW) * Math.pow(depth, 1.4);
        const y = horizonY + (height - horizonY) * Math.pow(depth, 1.4);
        const x = vpX + (laneNorm * (trackW / 2));
        const scale = depth;
        return { x, y, scale };
      };

      // Ground plane
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#1e293b');
      groundGrad.addColorStop(0.5, '#0f172a');
      groundGrad.addColorStop(1, '#020617');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(vpX - trackTopW / 2, horizonY);
      ctx.lineTo(vpX + trackTopW / 2, horizonY);
      ctx.lineTo(vpX + trackBottomW / 2, height);
      ctx.lineTo(vpX - trackBottomW / 2, height);
      ctx.closePath();
      ctx.fill();

      // Subway Rails & Ties (Sleepers)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;

      // Draw horizontal railway ties moving forward
      for (let z = 1200; z >= 0; z -= 35) {
        const adjustedZ = (z - s.trackOffset + 1200) % 1200;
        const pL = project(-1, adjustedZ);
        const pR = project(1, adjustedZ);

        ctx.strokeStyle = `rgba(100, 116, 139, ${Math.pow(pL.scale, 1.5) * 0.8})`;
        ctx.lineWidth = Math.max(1, 6 * pL.scale);
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();
      }

      // Draw 4 Lane Dividing Rails (Lane 0, 1, 2)
      const laneBoundaries = [-1, -0.33, 0.33, 1];
      laneBoundaries.forEach((boundary, idx) => {
        const isOuter = idx === 0 || idx === 3;
        const nearP = project(boundary, 0);
        const farP = project(boundary, 1200);

        ctx.strokeStyle = isOuter ? '#38bdf8' : '#e2e8f0';
        ctx.shadowColor = isOuter ? '#38bdf8' : '#f59e0b';
        ctx.shadowBlur = isOuter ? 8 : 2;
        ctx.lineWidth = isOuter ? 4 : 2;

        ctx.beginPath();
        ctx.moveTo(farP.x, farP.y);
        ctx.lineTo(nearP.x, nearP.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Overhead Subway Portal Arches along the track
      for (let archZ = 1100; archZ >= 50; archZ -= 280) {
        const adjustedArchZ = (archZ - s.trackOffset * 1.5 + 1200) % 1200;
        if (adjustedArchZ < 80) continue;
        const pL = project(-1.18, adjustedArchZ);
        const pR = project(1.18, adjustedArchZ);
        const archHeight = 110 * pL.scale;

        ctx.strokeStyle = `rgba(56, 189, 248, ${pL.scale * 0.6})`;
        ctx.lineWidth = Math.max(1.5, 5 * pL.scale);
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pL.x, pL.y - archHeight);
        ctx.quadraticCurveTo(vpX, pL.y - archHeight * 1.35, pR.x, pR.y - archHeight);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();
      }

      // 3. Render 3D Obstacles and Coins (Sorted by Z far to near)
      const renderables: Array<{ type: 'obstacle' | 'coin'; z: number; data: Obstacle | Coin }> = [
        ...s.obstacles.map(o => ({ type: 'obstacle' as const, z: o.z, data: o })),
        ...s.coins.filter(c => !c.collected).map(c => ({ type: 'coin' as const, z: c.z, data: c }))
      ];

      // Sort descending by Z so further objects are drawn first
      renderables.sort((a, b) => b.z - a.z);

      for (const item of renderables) {
        if (item.z > 1150 || item.z < -40) continue;
        const laneNorm = (item.data.lane - 1) * 0.66; // -0.66, 0, 0.66
        const pos = project(laneNorm, item.z);

        if (item.type === 'coin') {
          // Draw Floating Golden Python Coin / Token
          const coin = item.data as Coin;
          const coinRadius = Math.max(3, 16 * pos.scale);
          const bounce = Math.sin((s.runner.runFrame + coin.z * 0.05)) * 6 * pos.scale;
          const cy = pos.y - 25 * pos.scale + bounce;

          ctx.save();
          // Coin Glow
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10 * pos.scale;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(pos.x, cy, coinRadius, 0, Math.PI * 2);
          ctx.fill();

          // Coin Inner Rim
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(pos.x, cy, coinRadius * 0.72, 0, Math.PI * 2);
          ctx.fill();

          // Coin Icon (Python Snake / Code Brackets)
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.max(6, 12 * pos.scale)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('{ }', pos.x, cy);
          ctx.restore();
        } else {
          // Draw Obstacle
          const obs = item.data as Obstacle;
          const scale = pos.scale;

          if (obs.type === 'train') {
            // Subway Train Front & Side
            const tw = 72 * scale;
            const th = 90 * scale;
            const tx = pos.x - tw / 2;
            const ty = pos.y - th;

            // Train Front Body
            ctx.fillStyle = '#dc2626'; // Red subway front
            ctx.strokeStyle = '#991b1b';
            ctx.lineWidth = Math.max(1, 2 * scale);
            ctx.beginPath();
            ctx.roundRect(tx, ty, tw, th, 8 * scale);
            ctx.fill();
            ctx.stroke();

            // Train Windshield
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.roundRect(tx + 8 * scale, ty + 12 * scale, tw - 16 * scale, 30 * scale, 4 * scale);
            ctx.fill();

            // Train Headlights
            ctx.fillStyle = '#fef08a';
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 12 * scale;
            ctx.beginPath();
            ctx.arc(tx + 16 * scale, ty + th - 18 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.arc(tx + tw - 16 * scale, ty + th - 18 * scale, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Warning Stripe
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(tx + 4 * scale, ty + th - 32 * scale, tw - 8 * scale, 6 * scale);

            // Roof Warning Light
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(pos.x, ty - 4 * scale, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
          } else if (obs.type === 'barrier') {
            // Hazard Barrier (Can jump or duck under)
            const bw = 64 * scale;
            const bh = 42 * scale;
            const bx = pos.x - bw / 2;
            const by = pos.y - bh;

            // Left & Right Stand Posts
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 4 * scale, by, 6 * scale, bh);
            ctx.fillRect(bx + bw - 10 * scale, by, 6 * scale, bh);

            // Barrier Horizontal Bar
            const barY = by + 6 * scale;
            const barH = 18 * scale;
            ctx.fillStyle = '#facc15';
            ctx.fillRect(bx, barY, bw, barH);

            // Hazard Stripes on Bar
            ctx.fillStyle = '#1e293b';
            for (let sx = bx; sx < bx + bw; sx += 14 * scale) {
              ctx.beginPath();
              ctx.moveTo(sx, barY);
              ctx.lineTo(sx + 8 * scale, barY);
              ctx.lineTo(sx + 3 * scale, barY + barH);
              ctx.lineTo(sx - 5 * scale, barY + barH);
              ctx.closePath();
              ctx.fill();
            }

            // Warning Icon
            ctx.fillStyle = '#ef4444';
            ctx.font = `bold ${Math.max(6, 10 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('LOMPAT/SLIDE', pos.x, barY - 4 * scale);
          } else {
            // Traffic Cones
            const cw = 44 * scale;
            const ch = 38 * scale;
            const cx = pos.x;
            const cy = pos.y;

            // Cone Base
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.ellipse(cx, cy - 3 * scale, cw / 2, 7 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cone Triangle
            ctx.beginPath();
            ctx.moveTo(cx - cw * 0.35, cy - 4 * scale);
            ctx.lineTo(cx, cy - ch);
            ctx.lineTo(cx + cw * 0.35, cy - 4 * scale);
            ctx.closePath();
            ctx.fill();

            // Reflective White Band
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cx - cw * 0.2, cy - ch * 0.45);
            ctx.lineTo(cx - cw * 0.12, cy - ch * 0.7);
            ctx.lineTo(cx + cw * 0.12, cy - ch * 0.7);
            ctx.lineTo(cx + cw * 0.2, cy - ch * 0.45);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // ==========================================
      // 4. DRAW RUNNER CHARACTER (SUBWAY SURFERS STYLE)
      // ==========================================
      const runnerZ = 45; // Close to camera
      const runnerLaneNorm = s.runner.laneX * 0.66;
      const runnerPos = project(runnerLaneNorm, runnerZ);
      const runnerScale = runnerPos.scale * 1.15;

      const rx = runnerPos.x;
      const ry = runnerPos.y - s.runner.y * runnerScale;

      ctx.save();

      // Shadow on Ground
      const shadowW = Math.max(10, 48 * runnerScale * (1 - Math.min(1, s.runner.y / 150)));
      const shadowH = shadowW * 0.35;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(runnerPos.x, runnerPos.y - 2, shadowW / 2, shadowH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stumble Flash Red
      if (s.stumble) {
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 25;
      }

      if (s.runner.isSliding) {
        // --- SLIDING POSE ---
        const slideW = 54 * runnerScale;
        const slideH = 28 * runnerScale;

        // Sliding Dust Particles
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        for (let i = 0; i < 4; i++) {
          const dx = (Math.random() - 0.5) * 40 * runnerScale;
          const dy = Math.random() * 8 * runnerScale;
          ctx.beginPath();
          ctx.arc(rx + dx, ry - dy, 3 * runnerScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Body Sliding Low
        ctx.fillStyle = '#0284c7'; // Blue hoodie
        ctx.beginPath();
        ctx.roundRect(rx - slideW / 2, ry - slideH, slideW, slideH, 8 * runnerScale);
        ctx.fill();

        // Head with Cap
        ctx.fillStyle = '#f59e0b'; // Yellow cap
        ctx.beginPath();
        ctx.arc(rx + 14 * runnerScale, ry - slideH * 0.85, 12 * runnerScale, 0, Math.PI * 2);
        ctx.fill();

        // Cap Visor
        ctx.fillStyle = '#d97706';
        ctx.fillRect(rx + 20 * runnerScale, ry - slideH * 0.85, 8 * runnerScale, 4 * runnerScale);

        // Sneakers
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx - slideW / 2 - 4 * runnerScale, ry - 10 * runnerScale, 14 * runnerScale, 9 * runnerScale);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(rx - slideW / 2 - 4 * runnerScale, ry - 4 * runnerScale, 14 * runnerScale, 3 * runnerScale);
      } else {
        // --- RUNNING / JUMPING POSE ---
        const legPhase = Math.sin(s.runner.runFrame * 3);
        const charW = 38 * runnerScale;
        const charH = 75 * runnerScale;

        // 1. Legs & Sneakers
        const leftLegY = ry - 22 * runnerScale + (s.runner.isJumping ? 8 * runnerScale : legPhase * 10 * runnerScale);
        const rightLegY = ry - 22 * runnerScale - (s.runner.isJumping ? 8 * runnerScale : legPhase * 10 * runnerScale);

        // Pants (Dark Denim)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 9 * runnerScale;
        ctx.lineCap = 'round';

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(rx - 8 * runnerScale, ry - 32 * runnerScale);
        ctx.lineTo(rx - 10 * runnerScale, leftLegY);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(rx + 8 * runnerScale, ry - 32 * runnerScale);
        ctx.lineTo(rx + 10 * runnerScale, rightLegY);
        ctx.stroke();

        // Sneakers (White with Red Stripe)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx - 16 * runnerScale, leftLegY - 2 * runnerScale, 15 * runnerScale, 9 * runnerScale);
        ctx.fillRect(rx + 4 * runnerScale, rightLegY - 2 * runnerScale, 15 * runnerScale, 9 * runnerScale);

        // Sneaker soles
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(rx - 16 * runnerScale, leftLegY + 5 * runnerScale, 15 * runnerScale, 3 * runnerScale);
        ctx.fillRect(rx + 4 * runnerScale, rightLegY + 5 * runnerScale, 15 * runnerScale, 3 * runnerScale);

        // 2. Torso (Cool Hoodie - Python Blue)
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(rx - charW / 2, ry - charH * 0.74, charW, 36 * runnerScale, 8 * runnerScale);
        ctx.fill();

        // Backpack on back (Python Yellow with Green Snake Logo)
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.roundRect(rx - charW * 0.38, ry - charH * 0.7, charW * 0.76, 26 * runnerScale, 6 * runnerScale);
        ctx.fill();

        // Backpack Python Emblem
        ctx.fillStyle = '#16a34a';
        ctx.font = `bold ${Math.max(6, 10 * runnerScale)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('py', rx, ry - charH * 0.52);

        // Arms Running Motion
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 7 * runnerScale;
        ctx.beginPath();
        ctx.moveTo(rx - charW / 2, ry - charH * 0.65);
        ctx.lineTo(rx - charW / 2 - 8 * runnerScale, ry - charH * 0.55 - legPhase * 8 * runnerScale);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rx + charW / 2, ry - charH * 0.65);
        ctx.lineTo(rx + charW / 2 + 8 * runnerScale, ry - charH * 0.55 + legPhase * 8 * runnerScale);
        ctx.stroke();

        // 3. Head & Cap
        const headRadius = 14 * runnerScale;
        const headY = ry - charH * 0.84;

        // Head / Face
        ctx.fillStyle = '#fbcfe8'; // Skin tone
        ctx.beginPath();
        ctx.arc(rx, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cool Backwards Cap (Python Yellow)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(rx, headY - 3 * runnerScale, headRadius + 1 * runnerScale, Math.PI, Math.PI * 2);
        ctx.fill();

        // Cap Backwards Brim
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(rx - 12 * runnerScale, headY + 2 * runnerScale, 24 * runnerScale, 5 * runnerScale, 2 * runnerScale);
        ctx.fill();

        // Headphones around neck
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 4 * runnerScale;
        ctx.beginPath();
        ctx.arc(rx, headY + 7 * runnerScale, headRadius * 0.9, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      ctx.restore(); // restore dpr and shake

      // Request next frame
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isPaused, onTriggerQuiz, onUpdateHUD]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden touch-none select-none">
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full max-h-[520px] md:max-h-[640px] block rounded-2xl shadow-2xl bg-slate-950 cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
