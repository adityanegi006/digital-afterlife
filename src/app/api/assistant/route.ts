import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
import { getDb } from '@/lib/db';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); 

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const db = await getDb();
    
    const systemPrompt = `You are a compassionate Bereavement Guide AI for the Digital Afterlife Manager.
Your role is to guide the grieving family or guardian through the administrative formalities left by the deceased.
Here is the current state of the User's Vault (if Guardian Mode is ON, act as if you are talking to the beneficiary, otherwise the owner):
Data: ${JSON.stringify(db.data, null, 2)}
Always be empathetic, clear, and professional. Explain what the assets/insurances mean if asked.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      model: "llama-3.1-8b-instant", 
    });

    return NextResponse.json({ message: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
