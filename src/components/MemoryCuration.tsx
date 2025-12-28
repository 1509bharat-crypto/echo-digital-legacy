'use client';

import { useState, useEffect, useRef } from 'react';
import { IMAGE_PATHS } from '@/lib/imagePaths';
import imageMetadata from '@/lib/imageMetadata.json';

interface MemoryCurationProps {
  phase7Progress: number;
}

export default function MemoryCuration({ phase7Progress }: MemoryCurationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [releasedCount, setReleasedCount] = useState(0);
  const [preservedCount, setPreservedCount] = useState(0);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [showEnd, setShowEnd] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reflection prompts
  const reflectionPrompts = [
    "Take a breath...",
    "What does this moment mean to you?",
    "Some memories are meant to be released...",
    "What story do you want to tell?",
    "Let yourself feel...",
  ];

  // Shuffle IMAGE_PATHS to create random memory order
  const [memories] = useState(() => {
    const shuffled = [...IMAGE_PATHS].sort(() => Math.random() - 0.5).slice(0, 27);
    return shuffled.map((imagePath) => {
      const metadata = imageMetadata[imagePath as keyof typeof imageMetadata];
      return {
        image: imagePath,
        caption: metadata ? `${metadata.date} · ${metadata.location}` : '',
      };
    });
  });

  // WebGL ripple background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
    if (!gl) return;

    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vertSrc = `
      attribute vec2 pos;
      void main(){ gl_Position = vec4(pos, 0.0, 1.0); }
    `;

    const fragSrc = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time, u_phase, u_fluid;
      uniform float u_redAmount, u_blueAmount;

      vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
      vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

      float snoise(vec3 v){
        const vec2 C=vec2(1./6.,1./3.);
        const vec4 D=vec4(0.,.5,1.,2.);
        vec3 i=floor(v+dot(v,C.yyy));
        vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.-g;
        vec3 i1=min(g.xyz,l.zxy);
        vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;
        vec3 x2=x0-i2+C.yyy;
        vec3 x3=x0-D.yyy;
        i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
        float n_=.142857142857;
        vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);
        vec4 y_=floor(j-7.*x_);
        vec4 x=x_*ns.x+ns.yyyy;
        vec4 y=y_*ns.x+ns.yyyy;
        vec4 h=1.-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);
        vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.+1.;
        vec4 s1=floor(b1)*2.+1.;
        vec4 sh=-step(h,vec4(0.));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
        vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);
        vec3 p1=vec3(a0.zw,h.y);
        vec3 p2=vec3(a1.xy,h.z);
        vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
        m=m*m;
        return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }

      float ss(float a,float b,float x){float t=clamp((x-a)/(b-a),0.,1.);return t*t*(3.-2.*t);}

      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        vec2 pos=uv-vec2(.5);
        pos.x*=u_res.x/u_res.y;

        float grid=12.;
        vec2 gUV=floor(gl_FragCoord.xy/grid)*grid+grid*.5;
        vec2 gPos=gUV/u_res-vec2(.5);
        gPos.x*=u_res.x/u_res.y;
        float gDist=length(gPos);

        float dist=gDist+snoise(vec3(gPos*3.,u_time*.25))*.12*u_fluid+snoise(vec3(gPos*5.,u_time*.15))*.06*u_fluid;
        float wave=(sin(dist*8.-u_phase*3.)*.5+.5+sin(dist*12.-u_phase*4.+1.5)*.3+.35)/1.3;
        float fade=ss(.65,0.,gDist);
        float bright=wave*fade;

        vec2 cell=(gl_FragCoord.xy-gUV)/grid;

        float widthRatio = 0.15 + bright * 0.85;
        vec2 ellipseCell = cell * vec2(1.0 / widthRatio, 1.0);

        float r = 0.42;
        float circ = 1.0 - ss(r - 0.05, r, length(ellipseCell));

        vec3 white = vec3(1.0);
        vec3 red = vec3(0.89, 0.27, 0.13);
        vec3 blue = vec3(0.27, 0.53, 0.89);

        vec3 col = mix(white, red, u_redAmount);
        col = mix(col, blue, u_blueAmount);

        float n=snoise(vec3(gPos*4.,u_time*.08))*.04;
        col+=n;

        vec3 bg=vec3(.031,.031,.047);
        gl_FragColor=vec4(mix(bg,col,circ*bright*0.7),1.);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    if (!prog) return;
    const vertShader = createShader(gl.VERTEX_SHADER, vertSrc);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vertShader || !fragShader) return;

    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uPhase = gl.getUniformLocation(prog, 'u_phase');
    const uFluid = gl.getUniformLocation(prog, 'u_fluid');
    const uRedAmount = gl.getUniformLocation(prog, 'u_redAmount');
    const uBlueAmount = gl.getUniformLocation(prog, 'u_blueAmount');

    let redAmount = 0;
    let blueAmount = 0;
    let targetRed = 0;
    let targetBlue = 0;

    let animationId: number;
    const render = (t: number) => {
      const time = t * 0.001;

      redAmount += (targetRed - redAmount) * 0.015;
      blueAmount += (targetBlue - blueAmount) * 0.015;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time * 0.2);
      gl.uniform1f(uPhase, time * 0.15);
      gl.uniform1f(uFluid, 0.6);
      gl.uniform1f(uRedAmount, redAmount);
      gl.uniform1f(uBlueAmount, blueAmount);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleDecision = (action: 'release' | 'preserve') => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (action === 'release') {
      setReleasedCount(releasedCount + 1);
    } else {
      setPreservedCount(preservedCount + 1);
    }

    setTimeout(() => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= memories.length) {
        setShowEnd(true);
        setIsAnimating(false);
      } else if (nextIndex % 5 === 0) {
        // Show reflection every 5 cards
        const prompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
        setReflectionText(prompt);
        setShowReflection(true);

        setTimeout(() => {
          setShowReflection(false);
          setCurrentIndex(nextIndex);
          setIsAnimating(false);
        }, 2800);
      } else {
        setCurrentIndex(nextIndex);
        setIsAnimating(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setReleasedCount(0);
    setPreservedCount(0);
    setShowEnd(false);
    setIsAnimating(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || showEnd) return;
      if (e.key === 'ArrowLeft') handleDecision('release');
      if (e.key === 'ArrowRight') handleDecision('preserve');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, showEnd, currentIndex]);

  const currentMemory = memories[currentIndex];
  const containerOpacity = phase7Progress;

  return (
    <div
      className="fixed inset-0 z-40 transition-opacity duration-1000"
      style={{
        opacity: containerOpacity,
        pointerEvents: phase7Progress > 0.5 ? 'auto' : 'none',
      }}
    >
      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035]">
        <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')]" />
      </div>

      {/* WebGL Background */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full opacity-50" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-50">
        <div className="text-[10px] font-bold tracking-[0.3em] text-white/15 uppercase">
          ECHO
        </div>
        <div className="font-mono text-[11px] text-white/25 tracking-[0.25em] uppercase">
          <span className="text-white/50">{currentIndex + 1}</span> of <span className="text-white/50">{memories.length}</span>
        </div>
        <button
          onClick={handleReset}
          className="px-[22px] py-3 rounded-full border border-white/[0.06] bg-white/[0.02] font-sans text-[10px] font-normal tracking-[0.15em] uppercase text-white/30 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white/55 transition-all duration-400"
        >
          Start over
        </button>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center gap-11 mt-[54px] h-screen justify-center">
        {!showEnd && !showReflection && currentMemory && (
          <>
            {/* Memory Card */}
            <div className="w-[480px] h-[640px] bg-[rgba(18,18,24,0.9)] rounded-2xl overflow-hidden border border-white/[0.04] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_1px_rgba(255,255,255,0.05)] flex flex-col">
              <div className="relative flex-1 overflow-hidden bg-[#0a0a0f]">
                <img
                  src={currentMemory.image}
                  alt="Memory"
                  className="w-full h-full object-cover"
                  style={{
                    filter: 'saturate(0.8) contrast(1.02) brightness(0.95)',
                  }}
                />
                {/* Photo vignette + fade effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8, 8, 12, 0.4) 100%), linear-gradient(to bottom, transparent 60%, rgba(18, 18, 24, 0.95) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-7">
                  <div className="font-mono text-xs text-white tracking-[0.03em] leading-relaxed">
                    {currentMemory.caption}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-[100px] items-center">
              <div className="flex flex-col items-center gap-[14px]">
                <button
                  onClick={() => handleDecision('release')}
                  disabled={isAnimating}
                  className="w-[68px] h-[68px] rounded-full border border-white/[0.08] bg-white/[0.05] backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:border-[rgba(227,69,32,0.5)] group relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute w-full h-full rounded-full bg-transparent transition-all duration-500 scale-[0.8] opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:bg-[rgba(227,69,32,0.1)]" />
                  <svg className="w-6 h-6 stroke-white/40 fill-none stroke-[1.5] transition-all duration-400 group-hover:stroke-[#e34520]" viewBox="0 0 24 24">
                    <path d="M19 12H5M5 12L11 6M5 12L11 18"/>
                  </svg>
                </button>
                <span className="font-sans text-[10px] font-normal tracking-[0.2em] uppercase text-white/25 transition-colors duration-400 group-hover:text-[rgba(227,69,32,0.8)]">
                  Release
                </span>
              </div>

              <div className="flex flex-col items-center gap-[14px]">
                <button
                  onClick={() => handleDecision('preserve')}
                  disabled={isAnimating}
                  className="w-[68px] h-[68px] rounded-full border border-white/[0.08] bg-white/[0.05] backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:border-[rgba(69,135,227,0.5)] group relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute w-full h-full rounded-full bg-transparent transition-all duration-500 scale-[0.8] opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:bg-[rgba(69,135,227,0.1)]" />
                  <svg className="w-6 h-6 stroke-white/40 fill-none stroke-[1.5] transition-all duration-400 group-hover:stroke-[#4587e3]" viewBox="0 0 24 24">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18"/>
                  </svg>
                </button>
                <span className="font-sans text-[10px] font-normal tracking-[0.2em] uppercase text-white/25 transition-colors duration-400 group-hover:text-[rgba(69,135,227,0.8)]">
                  Preserve
                </span>
              </div>
            </div>
          </>
        )}

        {/* Reflection Overlay */}
        {showReflection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,8,12,0.85)]">
            <div className="text-center max-w-[400px] px-10 py-10">
              <p className="font-[PlayfairDisplay] text-[22px] font-medium text-white/75 italic tracking-[0.01em] leading-[1.6]">
                {reflectionText}
              </p>
            </div>
          </div>
        )}

        {/* End Message */}
        {showEnd && (
          <div className="text-center text-white/85 max-w-[380px] px-5">
            <div className="w-16 h-16 mx-auto mb-7 rounded-full border border-white/10 flex items-center justify-center">
              <svg className="w-7 h-7 stroke-white/50 fill-none stroke-[1.5]" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2 className="font-[PlayfairDisplay] text-[26px] font-semibold mb-[14px] tracking-[-0.01em] leading-[1.35]">
              Your legacy is taking shape
            </h2>
            <p className="font-sans text-sm font-light text-white/40 leading-[1.75]">
              You've reflected on these memories today. Return whenever you're ready to continue curating your story.
            </p>
            <div className="mt-9 pt-7 border-t border-white/[0.06] flex justify-center gap-14">
              <div className="text-center">
                <div className="font-[PlayfairDisplay] text-4xl font-semibold text-[rgba(227,69,32,0.7)]">
                  {releasedCount}
                </div>
                <div className="font-mono text-[9px] text-white/30 tracking-[0.15em] uppercase mt-[6px]">
                  Released
                </div>
              </div>
              <div className="text-center">
                <div className="font-[PlayfairDisplay] text-4xl font-semibold text-[rgba(69,135,227,0.7)]">
                  {preservedCount}
                </div>
                <div className="font-mono text-[9px] text-white/30 tracking-[0.15em] uppercase mt-[6px]">
                  Preserved
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
