'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20">
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

      {/* Main Content */}
      <main className="relative flex flex-col gap-12 items-center text-center max-w-3xl z-10">
        {/* Floral Header */}
        <Card className="bg-white/10 backdrop-blur-md shadow-xl border border-pink-200/20 animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-poppins">
              Welcome to Bloom
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-lg sm:text-xl text-gray-200 mb-8 font-poppins leading-relaxed">
              Grow beautiful tulip rose. Water your flower to watch them thrive!
            </p>
            <Link href="/game">
              <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg px-8 py-4 rounded-full font-poppins transform hover:scale-105 transition-transform duration-300 shadow-lg">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Decorative Floral Element with Animation */}
        <div className="relative w-32 h-32 animate-pulse-slow">
          <div className="absolute w-16 h-16 bg-pink-500 rounded-full opacity-40 transform -translate-x-6 translate-y-6 animate-bounce-slow"></div>
          <div className="absolute w-16 h-16 bg-yellow-400 rounded-full opacity-40 transform translate-x-6 -translate-y-6 animate-bounce-slow" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute w-16 h-16 bg-green-400 rounded-full opacity-40 animate-bounce-slow" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-1 text-gray-400 font-poppins z-10">
        <p className="text-sm">Made by Anyone else. All rights reserved.</p>
      </footer>


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

        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}