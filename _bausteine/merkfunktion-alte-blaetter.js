(function(){
/* ═══ Merkfunktion (ältere Arbeitsblätter): Stand auf diesem Gerät speichern ═══ */
var KEY="mathebase-uebung:"+location.pathname.replace(/index\.html$/,""),laden=false,tm=null,W=document.querySelector(".wrap")||document.body;
function arr(s){return [].slice.call(W.querySelectorAll(s));}
function felder(){return arr("input,select,textarea").filter(function(i){return i.id!=="date"&&!i.readOnly&&i.type!=="hidden";});}
function knoepfe(){return arr(".choice");}
function pruefKnoepfe(){return arr("button[id]").filter(function(b){return /(^check-|-check$)/.test(b.id);});}
function flips(){return arr("button[id$='-flip']");}
var geprueft={};
function sichern(){
  if(laden)return;
  var d={v:1,sig:felder().length+"/"+knoepfe().length,
    e:felder().map(function(i){return i.type==="checkbox"||i.type==="radio"?(i.checked?1:0):i.value;}),
    c:knoepfe().map(function(b){return b.classList.contains("sel")?1:0;}),
    f:flips().map(function(b){return b.classList.contains("done")?1:0;}),
    p:Object.keys(geprueft)};
  try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}
}
var d=null;try{d=JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){}
if(d&&d.sig===felder().length+"/"+knoepfe().length){
  laden=true;
  try{
    flips().forEach(function(b,k){if(d.f&&d.f[k]&&!b.classList.contains("done"))b.click();});
    knoepfe().forEach(function(b,k){if(d.c[k]&&!b.classList.contains("sel"))b.click();});
    felder().forEach(function(i,k){var v=d.e[k];if(v==null)return;
      if(i.type==="checkbox"||i.type==="radio"){if(!!v!==i.checked)i.click();return;}
      if(v===""&&i.value==="")return;i.value=v;
      i.dispatchEvent(new Event("input",{bubbles:true}));i.dispatchEvent(new Event("change",{bubbles:true}));});
    (d.p||[]).forEach(function(id){var b=document.getElementById(id);if(b){geprueft[id]=1;b.click();}});
  }catch(e){}
  laden=false;
}
function bald(){clearTimeout(tm);tm=setTimeout(sichern,400);}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button[id]");
  if(b&&!laden&&/(^check-|-check$)/.test(b.id))geprueft[b.id]=1;bald();},true);
["input","change"].forEach(function(t){document.addEventListener(t,bald,true);});
window.addEventListener("pagehide",sichern);
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")sichern();});
})();
