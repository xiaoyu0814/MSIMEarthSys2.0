const color = {
  teal2: "#00ffc3",
  teal: "#59b29e",
  dark: "#0f0026",
  red: "#f63b4c",
  light: "#afe3d7",
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/**
 * 根据配置信息展示不同颜色背景和阴影
 * @param {*} options 
 */
function introAnimation(options) {
  // const duration = 3;
  const content1Charts = new SplitText("#header h1 .content1", {
    type: "lines, words, chars",
    linesClass: "line line++",
    wordsClass: "word word++",
    charsClass: "char",
  });
  const chars1 = content1Charts.chars
  const content2Charts = new SplitText("#header h1 .content2", {
    type: "lines, words, chars",
    linesClass: "line line++",
    wordsClass: "word word++",
    charsClass: "char",
  });
  const chars2 = content2Charts.chars

  const easeOutElastic = Elastic.easeOut.config(1, 1);

  const section = $("header");
  const button = $("#header button");

  // Set the section opacity low, so that it doenst visully load with a hop/skip
  TweenMax.set([section, "#header", ".gui"], { autoAlpha: 0 });

  // Sort tics from the middle -> to outside
  const sortTics = (selector) => {
    const tics = Array.from(document.querySelectorAll(selector));
    return {
      left: tics.filter((tic, i) => i < tics.length / 2).reverse(),
      right: tics.filter((tic, i) => i > (tics.length - 1) / 2),
    };
  };
  const ticsT = sortTics(".ui-tics.t .tic");
  const ticsB = sortTics(".ui-tics.b .tic");
  // 交叉线
  const borderXF = $(".gui .border-x.f");
  const borderXL = $(".gui .border-x.l");
  const textBox = $$(".ui-text .t-o");
  const textBoxTitleL = $$(".ui-text.l h5");
  const textBoxTitleR = $$(".ui-text.r h5");
  const curvedBorder = $(".ui-border-v2.t");

  new TimelineMax({
    onComplete: () => document.body.classList.add("intro-anim-complete"),
  })
    .delay(0.1)
    .set("body", { opacity: 1 })
    // Turn the opacity back up
    .add((_) => TweenMax.set([section, "#header", ".gui"], { autoAlpha: 1 }))
    .set(".gui .border-vert .dot", { autoAlpha: 0 }, 0)
    .staggerFromTo(
      chars1,
      1,
      {
        visibility: "hidden",
        background: options.color1||"rgba(19, 240, 240, 0.26)", //红色：rgba(255, 2, 2, 0.06) 黄色：gba(236, 240, 19, 0.12)
        textShadow: `0 0 0 ${options.textShadow1}`,
        ease: Sine.easeIn,
      },
      {
        visibility: "visible",
        background: options.color2||"rgba(0, 255, 195, 0)",
        textShadow: `0 0 60px ${options.textShadow2}`,
        // ease: Sine.easeOut,
        ease:Elastic.easeInOut
      },
      0.1,
      identifyDuration * 2
    )
}

function resetStyle(selector, callback) {
  if (typeof selector === "string") {
    Array.from(document.querySelectorAll(selector)).forEach(
      (c, i) => (c.style = null)
    );
  } else {
    if (callback) {
      Array.from(selector).forEach(callback);
    } else {
      Array.from(selector).forEach((c, i) => (c.style = null));
    }
  }
}

function colorHex(color) {
  return parseInt("0x" + color.replace(/#/g, "").toUpperCase());
}

function spaceStars(scene, farPlane = 1000) {
  const geometry = new THREE.SphereGeometry(1, 1, 1);
  const material = new THREE.PointsMaterial({
    size: 5,
    opacity: 1,
    color: color.teal,
    transparent: true,
  });

  let starQty = 1000;
  for (let i = 0; i < starQty; i++) {
    const starVertex = new THREE.Vector3();
    starVertex.x = Math.random() * farPlane - farPlane * 0.5;
    starVertex.y = Math.random() * farPlane - farPlane * 0.5;
    starVertex.z = Math.random() * farPlane - farPlane * 0.5;
    geometry.vertices.push(starVertex);
  }

  const stars = new THREE.Points(geometry, material);

  scene.add(stars);

  return stars;
}

function spaceWorld(targetElement) {
  let HEIGHT = window.innerHeight;
  let WIDTH = window.innerWidth;
  let aspectRatio = WIDTH / HEIGHT;
  let fieldOfView = 75;
  let nearPlane = 1;
  let farPlane = 5000;
  let mouseX = 0;
  let mouseY = 0;

  const scene = new THREE.Scene({ antialias: true });
  const camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  const renderer = webGLSupport()
    ? new THREE.WebGLRenderer()
    : new THREE.CanvasRenderer();

  // Add objects to the scene
  // -------------------------------------------------------

  const stars = spaceStars(scene, farPlane);

  // init();

  return {
    stars,
  };

  // Initialize and Animate, Functions Hoisted
  // --------------------------------------

  function render(t) {
    stars.rotation.x += (mouseX - stars.rotation.x) * 0.000015;
    stars.rotation.y += (mouseY - stars.rotation.y) * 0.000015;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  function init() {
    targetElement.appendChild(renderer.domElement);

    camera.position.z = 1070 * 3.5;

    renderer.setClearColor(new THREE.Color(colorHex(color.dark)), 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    window.addEventListener("resize", onWindowResize, false);
    document.addEventListener("mousemove", onMouseMove, false);

    animate();
  }

  function animate(t) {
    requestAnimationFrame(animate);
    render(t);
  }

  function webGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.domElement.style.width = w + "px";
    renderer.domElement.style.height = h + "px";
  }

  function onMouseMove(e) {
    let windowHalfX = WIDTH / 2;
    let windowHalfY = HEIGHT / 2;
    mouseX = e.clientX - windowHalfX;
    mouseY = e.clientY - windowHalfY;
  }
}

// new Vue({
//   el: "#app",
//   mounted() {
//     introAnimation.call(this);
//     spaceWorld(document.getElementById("starfield"));
//   },
// });
