const pages = [...document.querySelectorAll(".page")];
const navItems = [...document.querySelectorAll(".nav-item")];
const pageTitle = document.getElementById("pageTitle");
const titles = {dashboard:"Security Dashboard",scan:"Malware Scanner",threats:"Threat Management",protection:"Protection Center",updates:"Security Updates",reports:"Security Reports",settings:"Settings"};

function showPage(id){
  pages.forEach(p=>p.classList.toggle("active",p.id===id));
  navItems.forEach(n=>n.classList.toggle("active",n.dataset.page===id));
  pageTitle.textContent=titles[id]||"Security Dashboard";
  window.scrollTo({top:0,behavior:"smooth"});
  document.getElementById("sidebar").classList.remove("open");
}
navItems.forEach(n=>n.addEventListener("click",()=>showPage(n.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.pageLink)));
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

function toast(title,text){
  const t=document.getElementById("toast");
  document.getElementById("toastTitle").textContent=title;
  document.getElementById("toastText").textContent=text;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>t.classList.remove("show"),3200);
}

document.querySelectorAll("[data-toggle]").forEach(input=>{
  input.addEventListener("change",()=>{
    const label=input.dataset.toggle;
    const on=input.checked;
    toast(label,on?"Protection enabled":"Protection disabled");
    document.querySelectorAll("[data-toggle='"+CSS.escape(label)+"']").forEach(x=>{x.checked=on});
    document.querySelectorAll(".toggle-state").forEach(el=>{
      if(el.parentElement && el.parentElement.querySelector("[data-toggle='"+CSS.escape(label)+"']")) el.textContent=on?"Active":"Disabled";
    });
  });
});

const scanStatus=document.getElementById("scanStatus");
const scanDetail=document.getElementById("scanDetail");
const progressWrap=document.getElementById("progressWrap");
const progressBar=document.getElementById("progressBar");
const progressLabel=document.getElementById("progressLabel");
const filesLabel=document.getElementById("filesLabel");
const scanOrb=document.getElementById("scanOrb");

function runScan(type){
  if(window.scanning)return;
  window.scanning=true;
  progressWrap.classList.remove("hidden");
  scanOrb.classList.add("scanning");
  scanStatus.textContent=type+" in progress";
  scanDetail.textContent="Analyzing files, processes and system locations for suspicious activity...";
  let p=0;
  const max=type==="Full Scan"?100:100;
  const timer=setInterval(()=>{
    p=Math.min(100,p+Math.floor(Math.random()*7)+2);
    progressBar.style.width=p+"%";
    progressLabel.textContent=p+"%";
    const files=type==="Full Scan"?Math.floor(p*1849.2):Math.floor(p*124.5);
    filesLabel.textContent=files.toLocaleString()+" files scanned";
    if(p>=max){
      clearInterval(timer); window.scanning=false; scanOrb.classList.remove("scanning");
      scanStatus.textContent="Scan completed";
      scanDetail.textContent="No active threats found. Your device is clean.";
      toast("Scan complete",`${type} finished — no active threats found.`);
      addEvent(`${type} completed`,"No threats found");
    }
  },180);
}
document.getElementById("quickScan").addEventListener("click",()=>runScan("Quick Scan"));
document.getElementById("fullScan").addEventListener("click",()=>runScan("Full Scan"));
document.getElementById("customFile").addEventListener("change",e=>{
  const count=e.target.files.length;
  if(count) {
    showPage("scan");
    toast("Custom scan ready",`${count} item${count>1?"s":""} selected for scanning.`);
    runScan("Custom Scan");
  }
});

document.querySelectorAll(".mini-scan").forEach((el,i)=>{
  el.addEventListener("click",()=>{
    document.querySelectorAll(".mini-scan").forEach(x=>x.classList.remove("selected"));
    el.classList.add("selected");
  });
});

function addEvent(title,sub){
  const list=document.getElementById("eventList");
  const div=document.createElement("div");
  div.className="event";
  div.innerHTML=`<span class="event-icon safe">✓</span><div><strong>${title}</strong><span>${sub}</span></div><time>just now</time>`;
  list.prepend(div);
}
document.getElementById("updateNow").addEventListener("click",()=>{
  toast("Checking updates","Security intelligence is already current.");
});
document.getElementById("exportReport").addEventListener("click",()=>{
  const report="XSAV Shield Security Report\\nGenerated: "+new Date().toLocaleString()+"\\nSecurity score: 92\\nThreats blocked: 2847\\nActive threats: 0";
  const blob=new Blob([report],{type:"text/plain"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="xsav-security-report.txt";a.click();
  URL.revokeObjectURL(a.href);
  toast("Report exported","Security report saved as a text file.");
});
document.getElementById("clearThreats").addEventListener("click",()=>{
  document.querySelector("#threatTable tbody").innerHTML='<tr><td colspan="6" style="text-align:center;padding:28px;color:#60758b">No threat history to display.</td></tr>';
  toast("History cleared","Threat history has been cleared from this demo UI.");
});

const chart=document.getElementById("barChart");
[38,58,42,75,50,67,45,82,61,92,55,74,48,70,57,86].forEach((v,i)=>{
  const pair=document.createElement("div");pair.className="bar-pair";
  pair.innerHTML=`<i class="bar" style="height:${v}%"></i><i class="bar alt" style="height:${Math.max(12,v-28)}%"></i>`;
  chart.appendChild(pair);
});

const modal=document.getElementById("notificationModal");
document.getElementById("notificationBtn").addEventListener("click",()=>modal.classList.remove("hidden"));
document.getElementById("closeModal").addEventListener("click",()=>modal.classList.add("hidden"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.add("hidden")});
