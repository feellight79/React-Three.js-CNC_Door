import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import { CSG } from 'three-csg';
import { CSG } from "three-csg-ts"
import ThreeBSP from 'three-js-csg';

const ThreeJSScene = () => {
  const scene = new THREE.Scene();
  const sceneRef = useRef(null);
  var cube_geometry = new THREE.BoxGeometry( 3, 3, 3 );
  var cube_mesh = new THREE.Mesh( cube_geometry );
  cube_mesh.position.x = -7;
  var cube_bsp = new ThreeBSP( cube_mesh );

  var sphere_geometry = new THREE.SphereGeometry( 1.8, 32, 32 );
  var sphere_mesh = new THREE.Mesh( sphere_geometry );
  sphere_mesh.position.x = -7;
  var sphere_bsp = new ThreeBSP( sphere_mesh );
  
  var subtract_bsp = cube_bsp.subtract( sphere_bsp );
  var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading, map: THREE.ImageUtils.loadTexture('texture.png') }) );
  result.geometry.computeVertexNormals();
  scene.add( result );
  // useEffect(() => {
  //   const scene = new THREE.Scene();
  //   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  //   const renderer = new THREE.WebGLRenderer();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   sceneRef.current.appendChild(renderer.domElement);

  //   const geometry1 = new THREE.BoxGeometry(2, 2, 2);
  //   const geometry2 = new THREE.CylinderGeometry(1, 1, 4, 32);

  //   const mesh1 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  //   const mesh2 = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));

  //   mesh1.position.set(0, 0, 0);
  //   mesh2.position.set(1, 0, 0);

  //   scene.add(mesh1);
  //   scene.add(mesh2);

  //   // Perform a Boolean operation (difference in this case)
  //   const csg1 = CSG.fromMesh(mesh1);
  //   const csg2 = CSG.fromMesh(mesh2);

  //   const resultCSG = csg1.subtract(csg2);
  //   const resultMesh = CSG.toMesh(resultCSG, mesh1.matrix);

  //   scene.add(resultMesh);

  //   camera.position.z = 5;

  //   const animate = () => {
  //     requestAnimationFrame(animate);
  //     renderer.render(scene, camera);
  //   };

  //   animate();

  //   return () => {
  //     scene.remove(mesh1);
  //     scene.remove(mesh2);
  //     scene.remove(resultMesh);
  //   };
  // }, []);

  // return <div ref={sceneRef}></div>;
};

export default ThreeJSScene;
