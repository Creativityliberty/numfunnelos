"""NÜM Funnel OS MCP bridge (local stdio transport).

Run on YOUR trusted machine. Authentication uses a workspace-scoped NÜM PAT.
For remote ChatGPT connections, deploy a separate HTTPS Streamable HTTP
resource server with OAuth 2.1; stdio is NOT remote ChatGPT connectivity.
"""
from __future__ import annotations
import os
from urllib.parse import urlsplit
import httpx
try:
    from mcp.server.fastmcp import FastMCP
except (ImportError, ModuleNotFoundError):
    from mcp.server.mcpserver import MCPServer as FastMCP

mcp=FastMCP("NUM Funnel OS")
MAX_BYTES=120_000

def request(method:str,path:str,payload=None):
    base=os.getenv("NUM_MCP_API_URL","http://127.0.0.1:8080").rstrip("/")
    url=urlsplit(base)
    if not url.hostname or url.username or url.password or url.query or url.fragment:
        raise ValueError("NUM_MCP_API_URL invalide")
    if url.scheme!="https" and not (url.scheme=="http" and url.hostname in ("localhost","127.0.0.1")):
        raise ValueError("HTTPS obligatoire en dehors du développement local")
    token=os.getenv("NUM_MCP_TOKEN","")
    if not token.startswith("num_mcp_"):raise ValueError("NUM_MCP_TOKEN absent")
    with httpx.Client(timeout=25,follow_redirects=False) as client:
        resp=client.request(method,base+"/api/agent"+path,
            headers={"Authorization":"Bearer "+token},json=payload)
    if resp.status_code>=400:
        raise ValueError("API NÜM : "+str(resp.status_code)+" — "+str(resp.json().get("detail","Opération refusée"))[:180])
    return resp.json()

@mcp.tool()
def list_funnels() -> list[dict]:
    """Lister uniquement les tunnels du workspace autorisé."""
    return request("GET","/funnels")

@mcp.tool()
def get_funnel(funnel_id:str) -> dict:
    """Consulter le brouillon et le statut d'un tunnel."""
    return request("GET","/funnels/"+funnel_id)

@mcp.tool()
def create_optin(name:str) -> dict:
    """Créer un brouillon de tunnel opt-in à partir du template APP 7 (sans publier)."""
    if len(name.strip())<2 or len(name)>150:raise ValueError("Nom requis (2-150 caractères)")
    return request("POST","/funnels",{"name":name.strip(),"template":"app7"})

@mcp.tool()
def update_funnel_content(funnel_id:str,title:str="",subtitle:str="",accent_color:str="") -> dict:
    """Modifier texte et couleur du brouillon, en conservant le reste. Ne publie pas."""
    import re
    current=request("GET","/funnels/"+funnel_id)
    draft=current["draft"]
    if title:
        if len(title)>200:raise ValueError("Titre trop long")
        draft["copy"]["title"]=title
    if subtitle:
        if len(subtitle)>1000:raise ValueError("Description trop longue")
        draft["copy"]["subtitle"]=subtitle
    if accent_color:
        if not re.fullmatch(r"#[0-9A-Fa-f]{6}",accent_color):
            raise ValueError("Couleur requise au format #RRGGBB")
        draft["brand"]["accent"]=accent_color
    import json
    if len(json.dumps(draft,ensure_ascii=False))>MAX_BYTES:raise ValueError("Brouillon trop volumineux")
    return request("PATCH","/funnels/"+funnel_id,{"draft":draft})

@mcp.tool()
def update_funnel_draft(funnel_id:str, draft:dict) -> dict:
    """Remplacer l'intégralité du draft JSON d'un tunnel (étapes, formulaires, mentions légales, intégrations). Toujours lire le draft avec get_funnel() d'abord, modifier les champs nécessaires, puis renvoyer l'objet complet."""
    import json
    if not isinstance(draft.get('copy'), dict) or not isinstance(draft.get('brand'), dict):
        raise ValueError("Le draft doit contenir les clés 'copy' et 'brand'")
    raw = json.dumps(draft, ensure_ascii=False)
    if len(raw) > MAX_BYTES:
        raise ValueError(f"Draft trop volumineux ({len(raw)} > {MAX_BYTES} caractères JSON)")
    return request("PATCH", "/funnels/" + funnel_id, {"draft": draft})

@mcp.tool()
def publish_funnel(funnel_id:str) -> dict:
    """Publier explicitement un tunnel. Exige un token avec scope funnels:publish."""
    return request("POST","/funnels/"+funnel_id+"/publish",{})

if __name__=="__main__":
    mcp.run(transport="stdio")
