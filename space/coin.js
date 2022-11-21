import*as THREE from"three";import Stats from"three.js/examples/jsm/libs/stats.module.js";import WebGL from"three.js/examples/jsm/capabilities/WebGL.js";import{OrbitControls}from"three.js/examples/jsm/controls/OrbitControls.js";import{GLTFLoader}from"three.js/examples/jsm/loaders/GLTFLoader.js";import{EffectComposer}from"three.js/examples/jsm/postprocessing/EffectComposer.js";import{RenderPass}from"three.js/examples/jsm/postprocessing/RenderPass.js";import{ShaderPass}from"three.js/examples/jsm/postprocessing/ShaderPass.js";import{CopyShader}from"three.js/examples/jsm/shaders/CopyShader.js";import{UnrealBloomPass}from"three.js/examples/jsm/postprocessing/UnrealBloomPass.js";import{RGBELoader}from"three.js/examples/jsm/loaders/RGBELoader.js";let scene,camera,renderer,controls,finalComposer,bloomComposer;var coin,mixer,clipAction;const coinOutlineGroup=new THREE.Group;const headSpinTrack=new THREE.NumberKeyframeTrack(".rotationAmount",[0,.5,1,1.5,2,2.5,3,5],[-32,-16,-8,-4,-2,-1,0,0]),tailSpinTrack=new THREE.NumberKeyframeTrack(".rotationAmount",[0,.5,1,1.5,2,2.5,3,5],[-32+Math.PI,-16+Math.PI,-8+Math.PI,-4+Math.PI,-2+Math.PI,-1+Math.PI,0+Math.PI,Math.PI]),mouse=new THREE.Vector2;function onClick(event){event.preventDefault();const raycaster=new THREE.Raycaster;mouse.x=event.clientX/renderer.domElement.clientWidth*2-1,mouse.y=-event.clientY/renderer.domElement.clientHeight*2+1,raycaster.setFromCamera(mouse,camera);if(raycaster.intersectObjects(scene.children).length<1)return;let spinTrack;controls.reset(),clipAction.stop(),Math.floor(2*Math.random())?(coin.rotation.y=0,spinTrack=headSpinTrack):(coin.rotation.y=Math.PI,spinTrack=tailSpinTrack);const spinAnimation=new THREE.AnimationClip("spin",-1,[spinTrack]);(clipAction=mixer.clipAction(spinAnimation)).repetitions=1,clipAction.loop=THREE.LoopOnce,clipAction.play()}const clock=new THREE.Clock;var delta=0;new THREE.MeshBasicMaterial({color:"black"});function onWindowResize(){const width=window.innerWidth,height=window.innerHeight;camera.aspect=width/height,camera.updateProjectionMatrix(),renderer.setSize(width,height),bloomComposer.setSize(width,height),finalComposer.setSize(width,height),finalComposer.render()}let coordMax,particleCount,stars;var vertices,resetStarPos;coordMax=1e3,particleCount=1e3,coordMax=1e3,particleCount=400;!function(){if(!1===WebGL.isWebGL2Available())return void document.body.appendChild(WebGL.getWebGL2ErrorMessage());scene=new THREE.Scene,camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,2e3),camera.position.set(0,0,32.5),camera.lookAt(0,0,0);const ambientLight=new THREE.AmbientLight(16777215,1);scene.add(ambientLight),renderer=new THREE.WebGLRenderer({antialias:!0}),renderer.autoClear=!1,renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(window.innerWidth,window.innerHeight),renderer.setClearColor(0,1),renderer.outputEncoding=THREE.sRGBEncoding,document.body.appendChild(renderer.domElement),controls=new OrbitControls(camera,renderer.domElement);const size=renderer.getDrawingBufferSize(new THREE.Vector2),renderTarget=new THREE.WebGLRenderTarget(size.width,size.height,{samples:4}),renderPass=new RenderPass(scene,camera),params_bloomStrength=1.5,params_bloomThreshold=0,params_bloomRadius=0,bloomPass=new UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight),1.5,.4,.85);bloomPass.threshold=params_bloomThreshold,bloomPass.strength=params_bloomStrength,bloomPass.radius=params_bloomRadius,bloomComposer=new EffectComposer(renderer),bloomComposer.renderToScreen=!1,bloomComposer.addPass(renderPass),bloomComposer.addPass(bloomPass);const finalPass=new ShaderPass(new THREE.ShaderMaterial({uniforms:{baseTexture:{value:null},bloomTexture:{value:bloomComposer.renderTarget2.texture}},vertexShader:document.getElementById("vertexshader").textContent,fragmentShader:document.getElementById("fragmentshader").textContent,defines:{}}),"baseTexture");finalPass.needsSwap=!0,finalComposer=new EffectComposer(renderer,renderTarget),finalComposer.addPass(renderPass),finalComposer.addPass(finalPass),function(){window.addEventListener("resize",onWindowResize,!1),window.addEventListener("click",onClick,!1);(new GLTFLoader).setPath("../assets/").load("coin.glb",(function(gltf){(coin=gltf.scene).children[0].material.side=THREE.FrontSide,scene.add(coin);for(let mesh of coin.children)mesh.originalMaterial=mesh.material;mixer=new THREE.AnimationMixer(coin);const initAnimation=new THREE.AnimationClip("place_holder",-1,[]);(clipAction=mixer.clipAction(initAnimation)).repetitions=1,clipAction.loop=THREE.LoopOnce,coin.rotationAmount=0;let geometry=coin.children[0].geometry,coinEdgeGeometry=new THREE.EdgesGeometry(geometry,30),edgeMaterial=new THREE.LineBasicMaterial({color:0}),coinOutline=new THREE.LineSegments(coinEdgeGeometry,edgeMaterial);coinOutlineGroup.add(coinOutline),scene.add(coinOutlineGroup)}),(xhr=>{}),(error=>{console.log(error)}))}(),function(){const light=new THREE.DirectionalLight(16777215,1);light.position.set(0,13,0),scene.add(light);const light2=new THREE.DirectionalLight(16777215,1);light2.position.set(0,13,13),scene.add(light2);const light3=new THREE.DirectionalLight(16777215,1);light3.position.set(0,-13,13),scene.add(light3);const light4=new THREE.DirectionalLight(16777215,1);light4.position.set(-26,13,-6.5),scene.add(light4);const light5=new THREE.DirectionalLight(16777215,.1);light5.position.set(13,3.25,-13),scene.add(light5);const light6=new THREE.DirectionalLight(16777215,.2);light6.position.set(13,2.6,13),scene.add(light6)}(),function(){let vertices=[];for(var x,y,z,i=0;i<particleCount;i++)x=THREE.MathUtils.randFloatSpread(coordMax),y=THREE.MathUtils.randFloatSpread(coordMax),z=THREE.MathUtils.randFloatSpread(coordMax),vertices.push(x,y,z);const geometry=new THREE.BufferGeometry;geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));let starSprite=(new THREE.TextureLoader).load("../assets/star.png");const starMaterial=new THREE.PointsMaterial({size:2,map:starSprite,transparent:!0});stars=new THREE.Points(geometry,starMaterial),scene.add(stars)}()}(),function animate(){requestAnimationFrame(animate),(delta+=clock.getDelta())<.016666666666666666||(!function(){mixer.update(delta),clipAction.isRunning()?coin.rotation.y=coin.rotationAmount:coin.rotation.y+=Math.PI/2048;coinOutlineGroup.rotation.y=coin.rotation.y}(),function(){stars.rotation.z+=4e-4,vertices=stars.geometry.attributes.position.array,resetStarPos=camera.position.z+50;for(let i=1;i<vertices.length;i+=3)vertices[i+1]+=1,vertices[i+1]>resetStarPos&&(vertices[i-1]=THREE.MathUtils.randFloatSpread(coordMax),vertices[i]=THREE.MathUtils.randFloatSpread(coordMax),vertices[i+1]-=coordMax);stars.geometry.attributes.position.needsUpdate=!0}(),finalComposer.render(),delta%=.016666666666666666)}();