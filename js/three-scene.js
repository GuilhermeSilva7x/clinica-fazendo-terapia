// ========================================================
// FAZENDO TERAPIA - CENA 3D GLOBAL (AUTISMO & NEURODIVERSIDADE)
// Escultura 3D de Quebra-Cabeça Interligado, Laço do Infinito
// e Anéis Orbitais com movimento dinâmico atrelado ao scroll
// ========================================================

(function () {
  const bgCanvasContainer = document.getElementById('global-3d-canvas-container');
  if (!bgCanvasContainer) return;

  // Scene, Camera, Renderer Global
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

  // Iluminação de estúdio
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 7, 7);
  scene.add(keyLight);

  const blueLight = new THREE.PointLight(0x0082d2, 2.5, 25);
  blueLight.position.set(-6, -4, 4);
  scene.add(blueLight);

  const pinkLight = new THREE.PointLight(0xdc006e, 2.2, 25);
  pinkLight.position.set(6, -4, 4);
  scene.add(pinkLight);

  const yellowLight = new THREE.PointLight(0xfaaa00, 1.8, 20);
  yellowLight.position.set(0, 5, 4);
  scene.add(yellowLight);

  // Grupo Mestre Geral que viaja com o scroll da página
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // ----------------------------------------------------
  // 1. ESCULTURA CENTRAL 3D DO AUTISMO (QUEBRA-CABEÇA MULTIDISCIPLINAR)
  // ----------------------------------------------------
  function createPuzzleShape(size, tabRadius) {
    const shape = new THREE.Shape();
    const half = size / 2;
    const tr = tabRadius;

    shape.moveTo(-half, -half);
    // Borda inferior com aba externa
    shape.lineTo(-tr * 0.7, -half);
    shape.bezierCurveTo(-tr * 0.9, -half - tr * 1.4, tr * 0.9, -half - tr * 1.4, tr * 0.7, -half);
    shape.lineTo(half, -half);
    // Borda direita com encaixe
    shape.lineTo(half, -tr * 0.7);
    shape.bezierCurveTo(half - tr * 1.4, -tr * 0.9, half - tr * 1.4, tr * 0.9, half, tr * 0.7);
    shape.lineTo(half, half);
    // Borda superior com aba externa
    shape.lineTo(tr * 0.7, half);
    shape.bezierCurveTo(tr * 0.9, half + tr * 1.4, -tr * 0.9, half + tr * 1.4, -tr * 0.7, half);
    shape.lineTo(-half, half);
    // Borda esquerda com encaixe
    shape.lineTo(-half, tr * 0.7);
    shape.bezierCurveTo(-half + tr * 1.4, tr * 0.9, -half + tr * 1.4, -tr * 0.9, -half, -tr * 0.7);
    shape.lineTo(-half, -half);

    return shape;
  }

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

  // Cores da clínica aplicadas nas 4 peças do núcleo central
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
      emissiveIntensity: 0.2,
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

  // ----------------------------------------------------
  // 2. LAÇO DO INFINITO 3D DA NEURODIVERSIDADE (ABRAÇA O QUEBRA-CABEÇA)
  // ----------------------------------------------------
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

  // Segundo laço dourado de apoio
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

  // ----------------------------------------------------
  // 3. ANÉIS ORBITAIS DE CONEXÃO MULTIDISCIPLINAR
  // ----------------------------------------------------
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

  // Esfera luminosa orbitando sobre o anel
  const orbGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0x5ab400 });
  const orbMesh = new THREE.Mesh(orbGeo, orbMat);
  orbitalRing.add(orbMesh);
  orbMesh.position.set(3.6, 0, 0);

  // ----------------------------------------------------
  // 4. PEÇAS DE QUEBRA-CABEÇA FLUTUANTES NO FUNDO
  // ----------------------------------------------------
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
      opacity: 0.5
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

  // ----------------------------------------------------
  // 5. MOUSE, TOQUE E SCROLL DA PÁGINA INTEIRA
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // 6. LOOP DE ANIMAÇÃO COM TRANSIÇÃO AO ROLAR O SITE
  // ----------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Movimentação tridimensional acompanhando o scroll por todo o site
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

    // Interpolação suave de posição e escala
    masterGroup.position.x += (targetX - masterGroup.position.x) * 0.05;
    masterGroup.position.y += (targetY - masterGroup.position.y) * 0.05;
    masterGroup.scale.set(targetScale, targetScale, targetScale);

    // Rotação suave respondendo ao cursor e à descida da página
    const targetRotY = elapsedTime * 0.35 + (scrollProgress * Math.PI * 3.2) + mouseX * 0.4;
    const targetRotX = 0.2 + Math.sin(scrollProgress * Math.PI * 2) * 0.5 + mouseY * 0.25;

    masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
    masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

    // Rotação contínua dos laços e anel orbital
    infinityMesh.rotation.z += 0.006;
    infinityMesh2.rotation.z -= 0.005;
    orbitalRing.rotation.z += 0.008;

    // Pulsação suave do quebra-cabeça central (respiração do desenvolvimento)
    const pulse = 1 + Math.sin(elapsedTime * 1.8) * 0.035;
    puzzleSculpture.scale.set(pulse, pulse, pulse);

    // Flutuação das peças de fundo
    floaters.forEach(fl => {
      fl.mesh.rotation.x += fl.rotSpeedX;
      fl.mesh.rotation.y += fl.rotSpeedY;
      fl.mesh.position.y = fl.baseY + Math.sin(elapsedTime * fl.floatSpeed) * 0.35;
    });

    renderer.render(scene, camera);
  }

  animate();
})();
