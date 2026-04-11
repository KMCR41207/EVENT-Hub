// MagicRings WebGL - Three.js CDN version
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initMagicRings;
  document.head.appendChild(script);

  function initMagicRings() {
    const mount = document.getElementById('magic-rings-canvas');
    if (!mount) return;

    const cfg = {
      color: '#fc42ff', colorTwo: '#42fcff', speed: 1, ringCount: 6,
      attenuation: 10, lineThickness: 2, baseRadius: 0.35, radiusStep: 0.1,
      scaleRate: 0.1, opacity: 1, noiseAmount: 0.1, rotation: 0,
      ringGap: 1.5, fadeIn: 0.7, fadeOut: 0.5, mouseInfluence: 0,
      hoverScale: 1.2, parallax: 0.05,
    };

    const vertexShader = `void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
    const fragmentShader = `precision highp float;
uniform float uTime,uAttenuation,uLineThickness,uBaseRadius,uRadiusStep,uScaleRate;
uniform float uOpacity,uNoiseAmount,uRotation,uRingGap,uFadeIn,uFadeOut;
uniform float uMouseInfluence,uHoverAmount,uHoverScale,uParallax,uBurst;
uniform vec2 uResolution,uMouse;uniform vec3 uColor,uColorTwo;uniform int uRingCount;
const float HP=1.5707963;const float CYCLE=3.45;
float fade(float t){return t<uFadeIn?smoothstep(0.0,uFadeIn,t):1.0-smoothstep(uFadeOut,CYCLE-0.2,t);}
float ring(vec2 p,float ri,float cut,float t0,float px){
  float t=mod(uTime+t0,CYCLE);float r=ri+t/CYCLE*uScaleRate;
  float d=abs(length(p)-r);float a=atan(abs(p.y),abs(p.x))/HP;
  float th=max(1.0-a,0.5)*px*uLineThickness;
  float h=(1.0-smoothstep(th,th*1.5,d))+1.0;
  d+=pow(cut*a,3.0)*r;return h*exp(-uAttenuation*d)*fade(t);}
void main(){
  float px=1.0/min(uResolution.x,uResolution.y);
  vec2 p=(gl_FragCoord.xy-0.5*uResolution.xy)*px;
  float cr=cos(uRotation),sr=sin(uRotation);
  p=mat2(cr,-sr,sr,cr)*p;p-=uMouse*uMouseInfluence;
  float sc=mix(1.0,uHoverScale,uHoverAmount)+uBurst*0.3;p/=sc;
  vec3 c=vec3(0.0);float rcf=max(float(uRingCount)-1.0,1.0);
  for(int i=0;i<10;i++){if(i>=uRingCount)break;float fi=float(i);
    vec2 pr=p-fi*uParallax*uMouse;vec3 rc=mix(uColor,uColorTwo,fi/rcf);
    c=mix(c,rc,vec3(ring(pr,uBaseRadius+fi*uRadiusStep,pow(uRingGap,fi),i==0?0.0:2.95*fi,px)));}
  c*=1.0+uBurst*2.0;
  float n=fract(sin(dot(gl_FragCoord.xy+uTime*100.0,vec2(12.9898,78.233)))*43758.5453);
  c+=(n-0.5)*uNoiseAmount;
  gl_FragColor=vec4(c,max(c.r,max(c.g,c.b))*uOpacity);}`;

    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true }); } catch(e) { return; }
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5,0.5,0.5,-0.5,0.1,10);
    camera.position.z = 1;

    const uniforms = {
      uTime:{value:0},uAttenuation:{value:0},uResolution:{value:new THREE.Vector2()},
      uColor:{value:new THREE.Color()},uColorTwo:{value:new THREE.Color()},
      uLineThickness:{value:0},uBaseRadius:{value:0},uRadiusStep:{value:0},
      uScaleRate:{value:0},uRingCount:{value:0},uOpacity:{value:1},
      uNoiseAmount:{value:0},uRotation:{value:0},uRingGap:{value:1.6},
      uFadeIn:{value:0.5},uFadeOut:{value:0.75},uMouse:{value:new THREE.Vector2()},
      uMouseInfluence:{value:0},uHoverAmount:{value:0},uHoverScale:{value:1},
      uParallax:{value:0},uBurst:{value:0},
    };

    const mat = new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms,transparent:true});
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1), mat));

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight, dpr = Math.min(devicePixelRatio,2);
      renderer.setSize(w,h); renderer.setPixelRatio(dpr);
      uniforms.uResolution.value.set(w*dpr,h*dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    new ResizeObserver(resize).observe(mount);

    const animate = t => {
      requestAnimationFrame(animate);
      uniforms.uTime.value = t*0.001*cfg.speed;
      uniforms.uAttenuation.value = cfg.attenuation;
      uniforms.uColor.value.set(cfg.color);
      uniforms.uColorTwo.value.set(cfg.colorTwo);
      uniforms.uLineThickness.value = cfg.lineThickness;
      uniforms.uBaseRadius.value = cfg.baseRadius;
      uniforms.uRadiusStep.value = cfg.radiusStep;
      uniforms.uScaleRate.value = cfg.scaleRate;
      uniforms.uRingCount.value = cfg.ringCount;
      uniforms.uOpacity.value = cfg.opacity;
      uniforms.uNoiseAmount.value = cfg.noiseAmount;
      uniforms.uRotation.value = (cfg.rotation*Math.PI)/180;
      uniforms.uRingGap.value = cfg.ringGap;
      uniforms.uFadeIn.value = cfg.fadeIn;
      uniforms.uFadeOut.value = cfg.fadeOut;
      uniforms.uMouseInfluence.value = 0;
      uniforms.uHoverAmount.value = 0;
      uniforms.uHoverScale.value = cfg.hoverScale;
      uniforms.uParallax.value = cfg.parallax;
      uniforms.uBurst.value = 0;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
  }
})();
