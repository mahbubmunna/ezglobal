import os
from dotenv import load_dotenv
import httpx

load_dotenv()
from pydantic import BaseModel
from typing import Type

# Default to groq for mvp
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama") # ollama, runpod, groq
LLM_MODEL = os.getenv("LLM_MODEL", "llama3.1:latest")
RUNPOD_API_KEY = os.getenv("RUNPOD_API_KEY", "")
RUNPOD_ENDPOINT_ID = os.getenv("RUNPOD_ENDPOINT_ID", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

class LLMClient:
    def __init__(self):
        self.provider = LLM_PROVIDER
        
    async def generate_structured_response(self, prompt: str, schema_cls: Type[BaseModel]) -> BaseModel:
        if self.provider == "ollama":
            return await self._call_ollama(prompt, schema_cls)
        elif self.provider == "runpod":
            return await self._call_runpod(prompt, schema_cls)
        elif self.provider == "groq":
            return await self._call_groq(prompt, schema_cls)
        else:
            raise ValueError(f"Unknown LLM Provider: {self.provider}")
            
    async def _call_ollama(self, prompt: str, schema_cls: Type[BaseModel]) -> BaseModel:
        schema_json = schema_cls.schema_json()
        system_prompt = f"You are an AI Document Review assistant. You must extract and generate a valid JSON object instance that strictly conforms to the following JSON Schema. DO NOT output the schema itself. Only output the populated JSON data.\n\nJSON Schema:\n{schema_json}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "http://192.168.1.104:11434/api/generate",
                    json={
                        "model": LLM_MODEL,
                        "prompt": system_prompt + "\n\n" + prompt,
                        "format": "json",
                        "stream": False
                    },
                    timeout=120.0
                )
                data = response.json()
                raw_json = data.get("response", "{}")
                print(f"LLM response: {raw_json}")
                return schema_cls.parse_raw(raw_json)
            except Exception as e:
                print(f"Ollama error: {e}")
                return schema_cls()
                
    async def _call_runpod(self, prompt: str, schema_cls: Type[BaseModel]) -> BaseModel:
        schema_json = schema_cls.schema_json()
        system_prompt = f"You are an AI Document Review assistant. You must extract and generate a valid JSON object instance that strictly conforms to the following JSON Schema. DO NOT output the schema definition itself. Only output the populated JSON data.\n\nJSON Schema:\n{schema_json}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"https://api.runpod.ai/v2/{RUNPOD_ENDPOINT_ID}/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {RUNPOD_API_KEY}"},
                    json={
                        "model": LLM_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"}
                    },
                    timeout=120.0
                )
                data = response.json()
                raw_json = data['choices'][0]['message']['content']
                return schema_cls.parse_raw(raw_json)
            except Exception as e:
                print(f"Runpod error: {e}")
                return schema_cls()

    async def _call_groq(self, prompt: str, schema_cls: Type[BaseModel]) -> BaseModel:
        schema_json = schema_cls.schema_json()
        system_prompt = f"You are an AI Document Review assistant. You must extract and generate a valid JSON object instance that strictly conforms to the following JSON Schema. DO NOT output the schema definition itself. Only output the populated JSON data.\n\nJSON Schema:\n{schema_json}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": "llama3-8b-8192" if LLM_MODEL == "llama3.2:3b" else LLM_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": {"type": "json_object"}
                    },
                    timeout=120.0
                )
                data = response.json()
                if 'choices' not in data:
                    print(f"Groq API Error Response: {data}")
                    return schema_cls()
                    
                raw_json = data['choices'][0]['message']['content']
                print(f"Groq LLM response: {raw_json}")
                return schema_cls.parse_raw(raw_json)
            except Exception as e:
                print(f"Groq error: {e}")
                return schema_cls()
