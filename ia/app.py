# ia.py — creado por ANGEL-OFC 💪
from openai import OpenAI
import os

# Tu clave de OpenAI (colócala aquí)
os.environ["OPENAI_API_KEY"] = "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"

# Inicializa el cliente
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# Bucle de chat
print("🤖 IA ANGEL-OFC lista para chatear. Escribe 'salir' para terminar.\n")

while True:
    user_input = input("Tú: ")

    if user_input.lower() == "salir":
        print("👋 Hasta luego, ANGEL-OFC!")
        break

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres una IA creada por ANGEL-OFC, servicial y directa."},
                {"role": "user", "content": user_input}
            ]
        )
        answer = response.choices[0].message.content
        print("IA:", answer, "\n")
    except Exception as e:
        print("❌ Error:", str(e))