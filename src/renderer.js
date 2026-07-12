```javascript
// ===============================
// INTERNET SHARE PRO
// Renderer
// ===============================

const logs = document.getElementById("logs");

function addLog(text){

    const hora = new Date().toLocaleTimeString();

    logs.value += `[${hora}] ${text}\n`;

    logs.scrollTop = logs.scrollHeight;

}

addLog("Internet Share Pro iniciado.");

const internetStatus=document.getElementById("internetStatus");

function verificarInternet(){

    if(navigator.onLine){

        internetStatus.innerHTML="🟢 Internet Conectada";

    }else{

        internetStatus.innerHTML="🔴 Sem Internet";

    }

}

window.addEventListener("online",verificarInternet);

window.addEventListener("offline",verificarInternet);

verificarInternet();

document.getElementById("scanUSB").addEventListener("click",()=>{

    addLog("Procurando dispositivos USB...");

});

document.getElementById("scanBluetooth").addEventListener("click",()=>{

    addLog("Procurando dispositivos Bluetooth...");

});

document.getElementById("shareInternet").addEventListener("click",()=>{

    addLog("Solicitação de compartilhamento iniciada...");

});

document.getElementById("stopShare").addEventListener("click",()=>{

    addLog("Compartilhamento interrompido.");

});

setInterval(()=>{

    const down=(Math.random()*150).toFixed(1);

    const up=(Math.random()*60).toFixed(1);

    document.getElementById("download").innerText=down+" Mbps";

    document.getElementById("upload").innerText=up+" Mbps";

},1000);
```
