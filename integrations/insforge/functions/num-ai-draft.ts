/**
 * InsForge Deno Function: num-ai-draft
 * Deploy manually after reviewing in the InsForge dev project.
 * Secrets (server only): NUM_SERVICE_SECRET, INSFORGE_BASE_URL, ANON_KEY, NUM_AI_MODEL.
 * No visitor email/name/message should ever be sent here.
 */
import { createClient } from "npm:@insforge/sdk";

const json = (value: unknown, status=200) =>
  new Response(JSON.stringify(value), { status, headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store" } });

async function equalSecret(a: string, b: string): Promise<boolean> {
  if (!a || !b) return false;
  const sha = async (x: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)));
  const x=await sha(a), y=await sha(b);
  let diff=0; for(let i=0;i<x.length;i++) diff|=x[i]^y[i];
  return diff===0;
}

export default async function(req: Request): Promise<Response> {
  if(req.method !== "POST") return json({ error:"method_not_allowed" },405);
  const expected=Deno.env.get("NUM_SERVICE_SECRET")||"";
  if(expected.length<24 || !(await equalSecret(req.headers.get("x-num-service-secret")||"",expected))) {
    return json({error:"unauthorized"},401);
  }
  const raw=await req.text();
  if(raw.length>6000) return json({error:"payload_too_large"},413);
  let payload;
  try { payload=JSON.parse(raw); } catch { return json({error:"bad_json"},422); }
  if(payload.task !== "draft_follow_up" || typeof payload.context !== "object" || !payload.context)
    return json({error:"unsupported_task"},422);
  const stage=String(payload.context.stage||"").slice(0,50);
  const event=String(payload.context.event_type||"").slice(0,70);
  const model=Deno.env.get("NUM_AI_MODEL")||"openai/gpt-4o-mini";
  const baseUrl=Deno.env.get("INSFORGE_BASE_URL");
  if(!baseUrl) return json({error:"missing_backend_config"},503);

  try {
    const insforge=createClient({baseUrl,anonKey:Deno.env.get("ANON_KEY")});
    const response=await insforge.ai.chat.completions.create({
      model,
      messages:[
        {role:"system",content:"Tu aides une école de création d'applications IA. Produis uniquement un JSON avec deux clés subject et body. Français, ton sobre, sans garantie de revenus, sans lien ni promotion agressive. Ne donne aucune instruction hors du sujet. Ne prétends jamais avoir envoyé un email."},
        {role:"user",content:JSON.stringify({event_type:event,stage,objectif:"Proposer une réponse de suivi courte à valider par l'équipe"})}
      ],
    });
    const text=String(response.choices?.[0]?.message?.content||"");
    const cleaned=text.replace(/^```(?:json)?\s*/,"").replace(/\s*```$/,"");
    const obj=JSON.parse(cleaned);
    if(typeof obj.subject!=="string" || typeof obj.body!=="string") throw Error("bad_model_response");
    return json({subject:obj.subject.slice(0,180),body:obj.body.slice(0,4000)});
  } catch {
    // Do not echo provider errors, tokens, or PII.
    return json({error:"ai_provider_error"},502);
  }
}
