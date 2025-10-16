const OPENAI_API_KEY = "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"; // reemplaza por tu clave
const BOT_INTRO = "👋 Soy Nova, creada por ANGEL-OFC.";

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");
  const chatList = document.getElementById("chatList");
  const newChatBtn = document.getElementById("newChatBtn");
  const sidebar = document.getElementById("sidebar");
  const openMenu = document.getElementById("openMenu");

  let chats = JSON.parse(localStorage.getItem("ia_angel_ofc_chats")) || {};
  let currentChat = null;

  function saveChats(){ localStorage.setItem("ia_angel_ofc_chats", JSON.stringify(chats)); }
  function addMessage(text,sender){ const div=document.createElement("div"); div.className=sender==="user"?"user":"ia"; div.textContent=text; chatBox.appendChild(div); chatBox.scrollTop=chatBox.scrollHeight; }
  function renderChatList(){ chatList.innerHTML=""; Object.keys(chats).forEach(id=>{ const li=document.createElement("li"); li.textContent=chats[id].title||`Chat ${Object.keys(chats).indexOf(id)+1}`; if(id===currentChat) li.classList.add("active"); li.onclick=()=>{ currentChat=id; renderChatList(); renderChat(); if(sidebar) sidebar.classList.remove("open"); }; chatList.appendChild(li); }); }
  function renderChat(){ chatBox.innerHTML=""; if(!currentChat||!chats[currentChat]) return; chats[currentChat].messages.forEach(msg=>addMessage(msg.content,msg.role==="user"?"user":"ia")); }

  async function createChat(){
    const id="chat-"+Date.now();
    chats[id]={ title:`Chat ${Object.keys(chats).length+1}`, messages:[
      {role:"system",content:"Eres una IA creada por ANGEL-OFC. Responde con claridad y amabilidad."},
      {role:"assistant",content:BOT_INTRO}
    ]};
    currentChat=id;
    saveChats(); renderChatList(); renderChat();
    speakText(BOT_INTRO);
    if(sidebar) sidebar.classList.remove("open");
  }

  async function sendMessageToOpenAI(text){
    if(!text||!currentChat) return;
    addMessage(text,"user"); chats[currentChat].messages.push({role:"user",content:text}); saveChats();
    addMessage("⏳ Generando respuesta...","ia");
    try{
      const resp=await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${OPENAI_API_KEY}` },
        body:JSON.stringify({ model:"gpt-4o-mini", messages:chats[currentChat].messages, temperature:0.6 })
      });
      const data=await resp.json();
      const reply=data.choices?.[0]?.message?.content||"Sin respuesta del modelo.";
      renderChat();
      addMessage(reply,"ia"); chats[currentChat].messages.push({role:"assistant",content:reply}); saveChats();
      speakText(reply);
    }catch(err){ addMessage("❌ Error de conexión: "+err.message,"ia"); }
  }

  function speakText(text){
    if(!text) return;
    if("speechSynthesis" in window){ const u=new SpeechSynthesisUtterance(text); u.lang="es-ES"; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
  }

  newChatBtn.onclick=createChat;
  sendBtn.onclick=()=>{ sendMessageToOpenAI(msgInput.value); msgInput.value=""; };
  msgInput.addEventListener("keypress",e=>{ if(e.key==="Enter"){ sendMessageToOpenAI(msgInput.value); msgInput.value=""; }});
  if(openMenu) openMenu.onclick=()=>sidebar.classList.toggle("open");

  if(!Object.keys(chats).length) createChat(); else{ currentChat=Object.keys(chats)[0]; renderChatList(); renderChat(); }
});