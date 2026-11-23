// Cena 3D global: quebra-cabeca do autismo, laco do infinito e aneis interligados com Three.js

(function () {
  const bgCanvasContainer = document.getElementById('global-3d-canvas-container');
  if (!bgCanvasContainer) return;

  // Cria cena, camera com perspectiva e renderizador WebGL
  const scene = new THREE.Scene();
  let width = window.innerWidth;
  let height = window.innerHeight;
  let isMobile = width < 768;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputEncoding = THREE.sRGBEncoding;
  bgCanvasContainer.appendChild(renderer.domElement);

  // Luz ambiente e pontos de luz coloridos nas cores da marca
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 7, 7);
  scene.add(keyLight);

  const blueLight = new THREE.PointLight(0x0082d2, 3.0, 26);
  blueLight.position.set(-6, -4, 4);
  scene.add(blueLight);

  const pinkLight = new THREE.PointLight(0xdc006e, 2.8, 26);
  pinkLight.position.set(6, -4, 4);
  scene.add(pinkLight);

  const yellowLight = new THREE.PointLight(0xfaaa00, 2.2, 22);
  yellowLight.position.set(0, 5, 4);
  scene.add(yellowLight);

  // Grupo principal que se move e gira conforme a rolagem da pagina
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // Desenha o formato 2D de uma peca de quebra-cabeca com encaixes
  function createPuzzleShape(size, tabRadius) {
    const shape = new THREE.Shape();
    const half = size / 2;
    const tr = tabRadius;

    shape.moveTo(-half, -half);
    // Borda inferior com aba externa
    shape.lineTo(-tr * 0.7, -half);
    shape.bezierCurveTo(-tr * 0.9, -half - tr * 1.4, tr * 0.9, -half - tr * 1.4, tr * 0.7, -half);
    shape.lineTo(half, -half);
    // Borda direita com encaixe interno
    shape.lineTo(half, -tr * 0.7);
    shape.bezierCurveTo(half - tr * 1.4, -tr * 0.9, half - tr * 1.4, tr * 0.9, half, tr * 0.7);
    shape.lineTo(half, half);
    // Borda superior com aba externa
    shape.lineTo(tr * 0.7, half);
    shape.bezierCurveTo(tr * 0.9, half + tr * 1.4, -tr * 0.9, half + tr * 1.4, -tr * 0.7, half);
    shape.lineTo(-half, half);
    // Borda esquerda com encaixe interno
    shape.lineTo(-half, tr * 0.7);
    shape.bezierCurveTo(-half + tr * 1.4, tr * 0.9, -half + tr * 1.4, -tr * 0.9, -half, -tr * 0.7);
    shape.lineTo(-half, -half);

    return shape;
  }

  // Gera a geometria 3D com chanfro e profundidade
  const puzzleShape = createPuzzleShape(1.3, 0.38);
  const puzzleGeo = new THREE.ExtrudeGeometry(puzzleShape, {
    steps: 2,
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 5
  });
  puzzleGeo.center();

  // Escultura central: 4 pecas interligadas nas 4 cores da clinica
  const coreColors = [
    { color: 0x0082d2, x: -0.72, y: 0.72, rotZ: 0 },             // Azul
    { color: 0xdc006e, x: 0.72, y: 0.72, rotZ: Math.PI / 2 },    // Rosa
    { color: 0xfaaa00, x: 0.72, y: -0.72, rotZ: Math.PI },       // Amarelo
    { color: 0x5ab400, x: -0.72, y: -0.72, rotZ: -Math.PI / 2 }  // Verde
  ];

  const puzzleSculpture = new THREE.Group();
  masterGroup.add(puzzleSculpture);

  coreColors.forEach(cfg => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: cfg.color,
      emissive: cfg.color,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1
    });

    const mesh = new THREE.Mesh(puzzleGeo, mat);
    mesh.position.set(cfg.x, cfg.y, 0);
    mesh.rotation.z = cfg.rotZ;
    puzzleSculpture.add(mesh);
  });

  // Curva 3D do laco do infinito (simbolo da neurodiversidade)
  class InfinityCurve extends THREE.Curve {
    constructor(scale = 2.6) {
      super();
      this.scale = scale;
    }
    getPoint(t) {
      const u = t * Math.PI * 2;
      const a = this.scale;
      const denom = 1 + Math.sin(u) * Math.sin(u);
      const x = (a * Math.cos(u)) / denom;
      const y = (a * Math.sin(u) * Math.cos(u)) / denom;
      const z = Math.sin(u * 2) * 0.55;
      return new THREE.Vector3(x, y, z);
    }
  }

  // Tubo do primeiro laco do infinito (azul)
  const infinityCurve = new InfinityCurve(2.8);
  const infinityGeo = new THREE.TubeGeometry(infinityCurve, 120, 0.085, 16, true);
  const infinityMat = new THREE.MeshStandardMaterial({
    color: 0x0082d2,
    emissive: 0x0082d2,
    emissiveIntensity: 0.45,
    roughness: 0.15,
    metalness: 0.85
  });

  const infinityMesh = new THREE.Mesh(infinityGeo, infinityMat);
  infinityMesh.rotation.x = 0.4;
  masterGroup.add(infinityMesh);

  // Segundo laco do infinito cruzado (dourado)
  const infinityCurve2 = new InfinityCurve(3.2);
  const infinityGeo2 = new THREE.TubeGeometry(infinityCurve2, 120, 0.05, 14, true);
  const infinityMat2 = new THREE.MeshStandardMaterial({
    color: 0xfaaa00,
    emissive: 0xfaaa00,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.85
  });
  const infinityMesh2 = new THREE.Mesh(infinityGeo2, infinityMat2);
  infinityMesh2.rotation.x = -0.5;
  infinityMesh2.rotation.y = 0.35;
  masterGroup.add(infinityMesh2);

  // Anel orbital rosa com esfera orbitante verde
  const ringGeo = new THREE.TorusGeometry(3.6, 0.035, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xdc006e,
    emissive: 0xdc006e,
    emissiveIntensity: 0.35,
    metalness: 0.8,
    roughness: 0.2
  });
  const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
  orbitalRing.rotation.x = 1.2;
  orbitalRing.rotation.y = -0.4;
  masterGroup.add(orbitalRing);

  const orbGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0x5ab400 });
  const orbMesh = new THREE.Mesh(orbGeo, orbMat);
  orbitalRing.add(orbMesh);
  orbMesh.position.set(3.6, 0, 0);

  // Pecas de quebra-cabeca menores flutuando pelo espaco de fundo
  const floaters = [];
  const floaterCount = 10;
  const colorsList = [0x0082d2, 0xdc006e, 0xfaaa00, 0x5ab400];

  for (let i = 0; i < floaterCount; i++) {
    const col = colorsList[i % colorsList.length];
    const mat = new THREE.MeshPhysicalMaterial({
      color: col,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.75
    });

    const smGeo = puzzleGeo.clone();
    smGeo.scale(0.35, 0.35, 0.35);
    const m = new THREE.Mesh(smGeo, mat);

    m.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      -2 + Math.random() * -4
    );

    m.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    scene.add(m);
    floaters.push({
      mesh: m,
      rotSpeedX: (Math.random() - 0.5) * 0.012,
      rotSpeedY: (Math.random() - 0.5) * 0.012,
      floatSpeed: 0.5 + Math.random() * 0.7,
      baseY: m.position.y
    });
  }

  // Captura do scroll, movimento do mouse e toque no celular
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let maxScroll = 1;

  function updateScroll() {
    scrollY = window.scrollY || window.pageYOffset;
    maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  }, { passive: true });

  // Redimensionamento responsivo da tela
  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    isMobile = width < 768;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    updateScroll();
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  // Loop de renderizacao e animacao suave dos objetos 3D
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Ajusta posicao e escala dependendo se e celular ou desktop
    let targetX, targetY, targetScale;

    if (isMobile) {
      targetX = 0;
      targetY = (scrollProgress * 2.2) - 0.4;
      targetScale = 0.65;
    } else {
      targetX = 2.4 - scrollProgress * 4.2;
      targetY = (scrollProgress * 2.4) - 0.2;
      targetScale = 0.95 - scrollProgress * 0.2;
    }

    // Suavizacao de movimento
    masterGroup.position.x += (targetX - masterGroup.position.x) * 0.05;
    masterGroup.position.y += (targetY - masterGroup.position.y) * 0.05;
    masterGroup.scale.set(targetScale, targetScale, targetScale);

    // Rotacao reagindo ao scroll e ao ponteiro
    const targetRotY = elapsedTime * 0.35 + (scrollProgress * Math.PI * 3.2) + mouseX * 0.4;
    const targetRotX = 0.2 + Math.sin(scrollProgress * Math.PI * 2) * 0.5 + mouseY * 0.25;

    masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
    masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

    // Rotacao continua dos lacos e anel
    infinityMesh.rotation.z += 0.006;
    infinityMesh2.rotation.z -= 0.005;
    orbitalRing.rotation.z += 0.008;

    // Pulsacao sutil do quebra-cabeca central
    const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.035;
    puzzleSculpture.scale.set(pulse, pulse, pulse);

    // Flutuacao e rotacao das pecas secundarias
    floaters.forEach(fl => {
      fl.mesh.rotation.x += fl.rotSpeedX;
      fl.mesh.rotation.y += fl.rotSpeedY;
      fl.mesh.position.y = fl.baseY + Math.sin(elapsedTime * fl.floatSpeed) * 0.35;
    });

    renderer.render(scene, camera);
  }

  animate();
})();
