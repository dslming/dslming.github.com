webpackJsonp([1],{"6fX1":function(e,n){},NHnr:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=t("+VlJ"),a={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},staticRenderFns:[]};var s=t("C7Lr")({name:"App"},a,!1,function(e){t("UKid")},null,null).exports,o=t("KGCO"),r=t("gUGA"),d=t.n(r),c=t("AA3o"),u=t.n(c),l=t("xSur"),h=t.n(l),v=window.THREE,m=function(){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=n.fieldOfView,i=void 0===t?60:t,a=n.nearPlane,s=void 0===a?1:a,o=n.farPlane,r=void 0===o?2e3:o,d=n.canvasWidth,c=void 0===d?1024:d,l=n.canvasHeight,h=void 0===l?960:l;u()(this,e);var m=c/h;this.camera=new v.PerspectiveCamera(i,m,s,r),this.init()}return h()(e,[{key:"init",value:function(){this.camera.position.x=0,this.camera.position.z=1e3,this.camera.position.y=300,this.camera.lookAt(new v.Vector3(0,0,0))}}]),e}(),f=window.THREE,w=function e(n){var t=n.canvasHeight,i=n.canvasWidth,a=n.canvasFatherId;u()(this,e),this.render=new f.WebGLRenderer({alpha:!0,antialias:!0}),this.render.setSize(i,t),this.render.shadowMapEnabled=!0,document.getElementById(a).appendChild(this.render.domElement)},p=window.THREE,g=function(){function e(){u()(this,e),this.listener=new p.AudioListener,this.audioLoader=new p.AudioLoader,this.sound=new p.Audio(this.listener),this.analyser=new p.AudioAnalyser(this.sound,512),this.sound.setVolume(1),this.playing=!1}return h()(e,[{key:"loadFile",value:function(e){var n=this;n.audioLoader.load(e,function(e){n.sound.setBuffer(e),n.sound.setLoop(!0),n.sound.setVolume(1)})}},{key:"loadSong",value:function(e){var n=this,t=e.name,i=window.URL.createObjectURL(e);this.audioLoader.load(i,function(e){n.sound.setBuffer(e),n.sound.setLoop(!0),n.sound.setVolume(1),n.playing&&n.sound.stop(),n.sound.play(),n.playing=!0},function(e){var n=e.loaded/e.total*100,i="Loading "+t+": "+Math.floor(n)+"%";console.log(i)},function(e){console.log(e)})}}]),e}(),y=window.THREE,E=null;function L(){var e=window.innerHeight,n=window.innerWidth;E.lmrender.render.setSize(n,e),E.lmcamera.camera.aspect=n/e,E.lmcamera.camera.updateProjectionMatrix()}function A(e){}function C(e){}function F(e){}function H(e){}function k(e){}function R(e){}var _=function(){function e(n){var t=n.canvasHeight,i=n.canvasWidth,a=n.canvasFatherId;u()(this,e),E=this,window.THREE=y,this.scene=null,this.lmcamera=null,this.lmrender=null,this.lmaudio=null,this.initScene(),this.initCamera(),this.initRender({canvasHeight:t,canvasWidth:i,canvasFatherId:a}),this.initAudio(),this.controls=new y.TrackballControls(this.lmcamera.camera)}return h()(e,[{key:"initScene",value:function(){this.scene=new y.Scene,this.scene.background=new y.Color(655398)}},{key:"initCamera",value:function(){this.lmcamera=new m}},{key:"initRender",value:function(e){var n=e.canvasHeight,t=e.canvasWidth,i=e.canvasFatherId;this.lmrender=new w({canvasHeight:n,canvasWidth:t,canvasFatherId:i})}},{key:"initAudio",value:function(){this.lmaudio=new g}},{key:"initBroserInterface",value:function(){window.addEventListener("resize",L,!1),document.addEventListener("mousemove",A,!1),document.addEventListener("mousedown",C,!1),document.addEventListener("mouseup",F,!1),document.addEventListener("touchstart",H,!1),document.addEventListener("touchend",k,!1),document.addEventListener("touchmove",R,!1)}}]),e}(),W=null,b=0,I=null,S=null;window.angle=b;var T={mounted:function(){S=this,I=this.$refs.wind,W=new _({canvasHeight:500,canvasWidth:800,canvasFatherId:"canvasFather"}),this.loop()},methods:{uploadFile:function(e){var n=e.target.files[0];W.lmaudio.loadSong(n),console.error(e.target.files[0])},loop:function(){if(W.controls.update(),W.lmrender.render.render(W.scene,W.lmcamera.camera),W.lmaudio.playing){var e=W.lmaudio.analyser.getAverageFrequency();(b+=d()(.3*e))>1e4&&(b=0),I.style.webkitTransform="rotate("+b+"deg)",e}requestAnimationFrame(S.loop)}}},V={render:function(){var e=this.$createElement,n=this._self._c||e;return n("div",[n("div",{attrs:{id:"canvasFather"}}),this._v(" "),n("input",{attrs:{type:"file"},on:{change:this.uploadFile}}),this._v(" "),n("div",{staticClass:"windmill"},[n("div",{staticClass:"stick"}),this._v(" "),n("div",{ref:"wind",staticClass:"wind"},[n("div",{staticClass:"wind1"}),this._v(" "),n("div",{staticClass:"wind2"}),this._v(" "),n("div",{staticClass:"wind3"}),this._v(" "),n("div",{staticClass:"wind4"})])])])},staticRenderFns:[]};var x=t("C7Lr")(T,V,!1,function(e){t("6fX1")},null,null).exports;i.a.use(o.a);var P=new o.a({routes:[{path:"/",component:x}]});i.a.config.productionTip=!1,new i.a({el:"#app",router:P,components:{App:s},template:"<App/>"})},UKid:function(e,n){}},["NHnr"]);
//# sourceMappingURL=app.05a173aa413cc93ff8dc.js.map