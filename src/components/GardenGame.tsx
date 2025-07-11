'use client';

import React, { useState, useEffect, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Path, Circle, Text } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface FlowerState {
  stage: string;
  growth: number;
  stageIndex: number;
  stemHeight: number;
}

interface Particle {
  x: number;
  y: number;
  opacity: number;
  vx: number;
  vy: number;
}

const GardenGame: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [flower, setFlower] = useState<FlowerState>({
    stage: 'Seed',
    growth: 0,
    stageIndex: 0,
    stemHeight: 0,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bloomScale, setBloomScale] = useState(0);
  const [stageSize, setStageSize] = useState({ width: 400, height: 400 });
  const stages = ['Seed', 'Sprout', 'Bud', 'Bloom'];
  const animationFrameRef = useRef<number | null>(null);
  const pulseRef = useRef<number>(0);

  // Responsive canvas size
  useEffect(() => {
    const updateStageSize = () => {
      const width = Math.min(window.innerWidth * 0.9, 400); // 90% of viewport width, max 400px
      const height = width; // Maintain square canvas
      setStageSize({ width, height });
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  // Calculate stem height based on stage and growth, scaled to stage size
  const getStemHeight = (stageIndex: number, growth: number): number => {
    const baseHeight = stageSize.height * 0.075; // Base unit scaled to canvas
    if (stageIndex === 0) return (growth / 100) * baseHeight;
    if (stageIndex === 1) return baseHeight + (growth / 100) * baseHeight;
    if (stageIndex === 2) return baseHeight * 2 + (growth / 100) * (baseHeight * 2);
    return baseHeight * 3 + (growth / 100) * baseHeight;
  };

  // Animation for particles and bloom effect
  useEffect(() => {
    const animate = () => {
      pulseRef.current += 0.05;

      // Update particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.05,
          }))
          .filter((p) => p.opacity > 0)
      );

      // Bloom animation (unfold petals)
      if (flower.stage === 'Bloom' && bloomScale < 1) {
        setBloomScale((prev) => Math.min(prev + 0.05, 1));
      } else if (flower.stage !== 'Bloom') {
        setBloomScale(0);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [flower.stage, bloomScale]);

  const waterFlower = () => {
    setFlower((prev) => {
      let newGrowth = Math.min(prev.growth + 2, 100);
      let newStageIndex = prev.stageIndex;
      let newStage = prev.stage;
      let newStemHeight = getStemHeight(prev.stageIndex, newGrowth);

      if (newGrowth >= 100 && prev.stageIndex < stages.length - 1) {
        newStageIndex = prev.stageIndex + 1;
        newStage = stages[newStageIndex];
        newGrowth = 0;
        newStemHeight = getStemHeight(newStageIndex, 0);
      }

      return {
        ...prev,
        growth: newStageIndex < stages.length - 1 ? newGrowth : prev.growth,
        stageIndex: newStageIndex,
        stage: newStage,
        stemHeight: newStemHeight,
      };
    });

    // Add particles for watering feedback, positioned at stem top
    setFlower((prev) => {
      const stemTop = baseY - prev.stemHeight;
      setParticles((prevParticles) => [
        ...prevParticles,
        { x: centerX - stageSize.width * 0.05, y: stemTop, opacity: 1, vx: -1, vy: -1 },
        { x: centerX + stageSize.width * 0.05, y: stemTop, opacity: 1, vx: 1, vy: -1 },
        { x: centerX, y: stemTop - stageSize.width * 0.05, opacity: 1, vx: 0, vy: -2 },
      ]);
      return prev;
    });
  };

  // Center of canvas, scaled to stage size
  const centerX = stageSize.width / 2;
  const baseY = stageSize.height * 0.75;

  // Pulsating scale
  const pulse = Math.sin(pulseRef.current) * 0.1 + 0.9;

  // Rose petal path (elongated, curved for rose shape)
  const petalPath = `
    M 0 0
    Q 8 -25 15 -30
    Q 22 -35 30 -30
    Q 35 -25 30 0
    Q 25 25 15 30
    Q 8 25 0 0
    Z
  `;

  // Leaf path (visible, compact)
  const leafPath = `
    M 0 0
    Q 8 -20 15 -25
    Q 22 -30 30 -20
    Q 35 -10 30 0
    Q 25 10 15 20
    Q 8 15 0 0
    Z
  `;

  // Thought bubble tail path (small triangle pointing downward)
  const thoughtTailPath = `
    M 0 0
    L 10 10
    L 20 0
    Z
  `;

  // Thought bubble messages by stage
  const thoughtMessages: { [key: string]: string } = {
    Seed: 'Please water me so I can become bloom :<',
    Sprout: "I'm sprouting! Keep watering, I’m getting stronger! :)",
    Bud: 'Almost blooming! A few more drops, pretty please? ^_^',
    Bloom: 'I’m a beautiful rose! Thank you for all the love! <3',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
      {/* Animated Web3 Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 animate-gradient"></div>
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-float"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Return Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white text-base sm:text-lg px-4 sm:px-6 py-1 sm:py-2 rounded-full font-poppins transform hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Return
          </Button>
        </Link>
      </div>

      {/* Instruction Card */}
      <Card className="sm:absolute sm:left-4 sm:top-1/2 sm:-translate-y-1/2 w-full sm:w-56 md:w-64 mb-4 sm:mb-0 bg-white/10 backdrop-blur-md border border-pink-200/20 shadow-xl animate-fade-in">
        <CardHeader className="pb-1 sm:pb-2">
          <CardTitle className="text-base sm:text-lg md:text-xl text-white font-bold font-poppins drop-shadow-md">
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 sm:pt-1">
          <p className="text-xs sm:text-sm text-gray-200 font-poppins leading-relaxed">
            Grow a rose from seed to bloom! Click <span className="font-semibold">&quot;Water&quot;</span> to nurture it through <span className="font-semibold">Seed</span>, <span className="font-semibold">Sprout</span>, <span className="font-semibold">Bud</span>, and <span className="font-semibold">Bloom</span> stages. Each click adds growth, and animations show progress. <span className="font-semibold">&quot;Rush na gawa lang to!! HAHAHAHAHAH&quot;</span>.
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-pink-200/20 shadow-xl animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-white font-bold font-poppins drop-shadow-md">
            Rose Garden
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            className="border border-pink-200/30 mb-4 rounded-lg shadow-lg"
          >
            <Layer>
              {/* Background gradient */}
              <Rect
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: stageSize.width, y: stageSize.height }}
                fillLinearGradientColorStops={[0, '#1a0933', 1, '#2a1b4a']}
              />
              {/* Background flowers */}
              {Array.from({ length: 10 }).map((_, i) => (
                <Circle
                  key={i}
                  x={(i * (stageSize.width / 8) + Math.sin(pulseRef.current + i) * 20) % stageSize.width}
                  y={(i * (stageSize.height / 10) + Math.cos(pulseRef.current + i) * 20) % stageSize.height}
                  radius={stageSize.width * 0.0125}
                  fill={`rgba(196, 117, 160, ${0.3 * pulse})`}
                />
              ))}
              {/* Thought bubble */}
              <Rect
                x={stageSize.width * 0.15}
                y={stageSize.height * 0.125}
                width={stageSize.width * 0.4}
                height={stageSize.height * 0.15}
                fillLinearGradientStartPoint={{ x: stageSize.width * 0.025, y: stageSize.height * 0.025 }}
                fillLinearGradientEndPoint={{ x: stageSize.width * 0.025, y: stageSize.height * 0.125 }}
                fillLinearGradientColorStops={[0, 'rgba(255, 255, 255, 0.9)', 1, 'rgba(230, 230, 230, 0.8)']}
                cornerRadius={stageSize.width * 0.025}
                shadowColor={`rgba(196, 117, 160, ${pulse})`}
                shadowBlur={5 * pulse}
                scaleX={pulse}
                scaleY={pulse}
              />
              <Path
                x={stageSize.width * 0.075}
                y={stageSize.height * 0.125}
                data={thoughtTailPath}
                fill="rgba(255, 255, 255, 0.9)"
                scaleX={0.5 * pulse}
                scaleY={0.5 * pulse}
              />
              <Text
                x={stageSize.width * 0.15}
                y={stageSize.height * 0.1375}
                width={stageSize.width * 0.35}
                text={thoughtMessages[flower.stage]}
                fontSize={stageSize.width * 0.035}
                fontFamily="'Poppins', sans-serif"
                fill="#222"
                align="center"
                verticalAlign="middle"
                wrap="word"
                scaleX={pulse}
                scaleY={pulse}
              />
              {/* Flower */}
              {flower.stage === 'Seed' && (
                <>
                  <Rect
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight}
                    width={stageSize.width * 0.025}
                    height={flower.stemHeight}
                    fill="#4caf50"
                    shadowColor={`rgba(196, 117, 160, ${pulse})`}
                    shadowBlur={10 * pulse}
                    opacity={0.9}
                  />
                  {flower.growth < 15 && (
                    <>
                      <Circle
                        x={centerX}
                        y={baseY}
                        radius={stageSize.width * 0.025 * pulse}
                        fill="#c475a0"
                        shadowColor={`rgba(196, 117, 160, ${pulse})`}
                        shadowBlur={10 * pulse}
                      />
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Path
                          key={i}
                          x={centerX}
                          y={baseY}
                          data={petalPath}
                          fill={`rgba(196, 117, 160, ${0.5 * pulse})`}
                          scaleX={0.4 * pulse}
                          scaleY={0.4 * pulse}
                          rotation={i * 90}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
              {flower.stage === 'Sprout' && (
                <>
                  <Rect
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight}
                    width={stageSize.width * 0.025}
                    height={flower.stemHeight}
                    fill="#4caf50"
                    shadowColor={`rgba(196, 117, 160, ${pulse})`}
                    shadowBlur={10 * pulse}
                    opacity={0.9}
                  />
                  <Path
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.025}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.6 * pulse}
                    scaleY={0.6 * pulse}
                    rotation={45}
                    offsetX={-stageSize.width * 0.0125}
                  />
                  <Path
                    x={centerX + stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.025}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.6 * pulse}
                    scaleY={0.6 * pulse}
                    rotation={-45}
                    offsetX={stageSize.width * 0.0125}
                  />
                </>
              )}
              {flower.stage === 'Bud' && (
                <>
                  <Rect
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight}
                    width={stageSize.width * 0.025}
                    height={flower.stemHeight}
                    fill="#4caf50"
                    shadowColor={`rgba(196, 117, 160, ${pulse})`}
                    shadowBlur={10 * pulse}
                    opacity={0.9}
                  />
                  <Path
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.075}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.7 * pulse}
                    scaleY={0.7 * pulse}
                    rotation={45}
                    offsetX={-stageSize.width * 0.0125}
                  />
                  <Path
                    x={centerX + stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.075}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.7 * pulse}
                    scaleY={0.7 * pulse}
                    rotation={-45}
                    offsetX={stageSize.width * 0.0125}
                  />
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Path
                      key={i}
                      x={centerX}
                      y={baseY - flower.stemHeight}
                      data={petalPath}
                      fill="#c475a0"
                      scaleX={0.5 * pulse}
                      scaleY={0.7 * pulse}
                      rotation={i * 90}
                    />
                  ))}
                </>
              )}
              {flower.stage === 'Bloom' && (
                <>
                  <Rect
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight}
                    width={stageSize.width * 0.025}
                    height={flower.stemHeight}
                    fill="#4caf50"
                    shadowColor={`rgba(196, 117, 160, ${pulse})`}
                    shadowBlur={10 * pulse}
                    opacity={0.9}
                  />
                  <Path
                    x={centerX - stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.075}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.8 * pulse}
                    scaleY={0.8 * pulse}
                    rotation={45}
                    offsetX={-stageSize.width * 0.0125}
                  />
                  <Path
                    x={centerX + stageSize.width * 0.0125}
                    y={baseY - flower.stemHeight + stageSize.height * 0.075}
                    data={leafPath}
                    fill="#4caf50"
                    scaleX={0.8 * pulse}
                    scaleY={0.8 * pulse}
                    rotation={-45}
                    offsetX={stageSize.width * 0.0125}
                  />
                  {/* Inner petals */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Path
                      key={`inner-${i}`}
                      x={centerX}
                      y={baseY - flower.stemHeight}
                      data={petalPath}
                      fill="#c475a0"
                      scaleX={0.8 * bloomScale * pulse}
                      scaleY={1 * bloomScale * pulse}
                      rotation={i * 72}
                      offsetY={-stageSize.height * 0.0125}
                    />
                  ))}
                  {/* Outer petals */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Path
                      key={`outer-${i}`}
                      x={centerX}
                      y={baseY - flower.stemHeight}
                      data={petalPath}
                      fill={`rgba(196, 117, 160, ${0.8 * pulse})`}
                      scaleX={1 * bloomScale * pulse}
                      scaleY={1.2 * bloomScale * pulse}
                      rotation={i * 72 + 36}
                      offsetY={-stageSize.height * 0.025}
                    />
                  ))}
                  <Circle
                    x={centerX}
                    y={baseY - flower.stemHeight}
                    radius={stageSize.width * 0.02 * pulse}
                    fill="#ffd700"
                    shadowColor={`rgba(196, 117, 160, ${pulse})`}
                    shadowBlur={10 * pulse}
                  />
                </>
              )}
              {/* Particles */}
              {particles.map((p, i) => (
                <Circle
                  key={i}
                  x={p.x}
                  y={p.y}
                  radius={stageSize.width * 0.0125}
                  fill={`rgba(255, 255, 255, ${p.opacity})`}
                />
              ))}
            </Layer>
          </Stage>
          <div className="flex flex-col items-center space-y-4 text-white font-poppins">
            <p className="text-base sm:text-lg md:text-xl">
              Stage: <span className="font-semibold">{flower.stage}</span>
            </p>
            <Button
              onClick={waterFlower}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full font-poppins transform hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              Water
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS for Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientFlow 15s ease infinite;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GardenGame;