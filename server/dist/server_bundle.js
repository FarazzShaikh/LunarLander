require("source-map-support").install(),function(t){var e={};function i(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=e,i.d=function(t,e,o){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(o,r,function(e){return t[e]}.bind(null,r));return o},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/server/dist/",i(i.s=1)}([function(t,e){t.exports=require("socket.io")},function(t,e,i){(function(t){const e=i(2),{default:o}=i(4),r=e();var s=i(3).createServer(r);r.use("/",e.static("client")),r.get("/",(e,i)=>{i.sendFile(t+"/index.html")}),s.listen(3e3,()=>{console.log("listening on *:3000")}),o(s)}).call(this,"/")},function(t,e){t.exports=require("express")},function(t,e){t.exports=require("http")},function(t,e,i){"use strict";i.r(e),i.d(e,"default",(function(){return y}));const o="SERVER-TICK",r="SERVER-UPDATE-PLAYERS",s="SERVER-UPDATE-PLAYER",n="PLAYER-HAS-MOVED",a={req:"REQUEST-TERRAIN",ack:"REQUEST-TERRAIN-ACK"},c={req:"REQUEST-NEW-PLAYER",ack:"REQUEST-NEW-PLAYER-ACK"},l={BOOST:.5,P_ROTATE:.1,N_ROTATE:-.1};var u=i(0),d=i.n(u);class h{constructor({socket:t,position:e,rotation:i}){this.socket=t,this.position=e||{x:0,y:0},this.rotation=i||2*Math.PI,this.mass=1,this.velocity={x:0,y:0},this.torque=0,this.force={x:0,y:0}}calcPosition(t){const e={...this.position};return this.position.x+=this.velocity.x*t*100,this.position.y+=this.velocity.y*t*100,this.position.x!==e.x||this.position.y!==e.y}calcRotation(t){const e=this.rotation;return this.rotation+=this.torque*t,this.rotation!==e}applyForce(t,e){this.force={x:e?-t.x*-Math.sin(this.rotation):-t.x,y:e?-t.y*Math.cos(this.rotation):-t.y}}applyTorque(t){return this.torque+=t}calcVelocity(){const t=this.force.x/this.mass,e=this.force.y/this.mass;this.velocity.x+=t,this.velocity.y+=e,this.force={x:0,y:0}}getSerialized(){return{id:this.socket.id,position:this.position,rotation:this.rotation}}update(t){this.calcVelocity(t);const e=this.calcPosition(t),i=this.calcRotation(t);return e||i}}class p{constructor(){this.d0=Date.now(),this.players={},this.terrainSeed=Math.random(),setInterval(this.update.bind(this),1e3/60)}getPlayers(){return Object.values(this.players).map(t=>t.getSerialized())}addPlayer(t){this.players[t.id]=new h({socket:t,position:{x:100*Math.random(),y:100},rotation:void 0})}removePlayer(t){delete this.players[t.id]}movePlayer(t,e){if(this.players[t.id])switch(e){case"BOOST":this.players[t.id].applyForce({x:l.BOOST,y:l.BOOST},!0);break;case"P_ROTATE":this.players[t.id].applyTorque(l.P_ROTATE);break;case"N_ROTATE":this.players[t.id].applyTorque(l.N_ROTATE)}}update(){const t=this._tick()/1e3;Object.values(this.players).forEach(e=>{const i=e.update(t);e.socket.emit(o,t),i&&(e.socket.emit(s,e.getSerialized()),e.socket.broadcast.emit(s,e.getSerialized()),e.needsUpdate=!1)})}_tick(){var t=Date.now(),e=t-this.d0;return this.d0=t,e}}function y(t){const e=d()(t),i=new p;e.on("connection",t=>{console.log("User connected",t.id),t.on(a.req,()=>{t.emit(a.ack,i.terrainSeed)}),t.on(c.req,()=>{i.addPlayer(t),t.emit(c.ack,i.getPlayers()),t.broadcast.emit(r,i.getPlayers())}),t.on(n,e=>i.movePlayer(t,e)),t.on("disconnect",()=>{i.removePlayer(t),t.emit(r,i.getPlayers()),t.broadcast.emit(r,i.getPlayers()),console.log("User disconnected",t.id)})})}}]);
//# sourceMappingURL=server_bundle.js.map