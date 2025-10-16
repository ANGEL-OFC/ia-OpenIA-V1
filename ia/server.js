import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "TU_API_KEY_AQUI";

app.post('/chat', async (req,res)=>{
  const { messages } = req.body;
  try{
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages
      })
    });
    const data = await response.json();
    res.json(data);
  }catch(e){
    res.status(500).json({ error:e.message });
  }
});

app.listen(3000,()=>console.log("Servidor escuchando en http://localhost:3000"));