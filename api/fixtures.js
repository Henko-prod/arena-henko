// Configure FOOTBALL_DATA_API_KEY somente no ambiente da Vercel.
const aliases = {spfc:['são paulo','sao paulo','são paulo fc'],santos:['santos','santos fc']};
const norm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default async function handler(req,res){
  res.setHeader('Cache-Control','s-maxage=21600, stale-while-revalidate=43200');
  const key=process.env.FOOTBALL_DATA_API_KEY;
  if (!key) return res.status(503).json({matches:[],configured:false,error:'Chave da API ainda não configurada'});
  const team=req.query.team==='santos'?'santos':'spfc';
  try{
    const r=await fetch('https://api.football-data.org/v4/competitions/BSA/matches',{headers:{'X-Auth-Token':key},signal:AbortSignal.timeout(11000)});
    if(!r.ok) throw new Error('Erro API '+r.status);
    const payload=await r.json();
    const matches=(payload.matches||[]).filter(m=>{
      const home=norm(m.homeTeam?.name);
      return aliases[team].some(name=>home.includes(norm(name)));
    }).filter(m=>['SCHEDULED','TIMED','POSTPONED'].includes(m.status)).filter(m=>new Date(m.utcDate).getTime()>=Date.now()-86400000).slice(0,12).map(m=>({
      id:'auto-'+m.id, utcDate:m.utcDate, status:m.status,
      home:m.homeTeam?.shortName||m.homeTeam?.name||'Mandante',
      away:m.awayTeam?.shortName||m.awayTeam?.name||'Visitante',
      homeLogo:m.homeTeam?.crest||'',awayLogo:m.awayTeam?.crest||'',
      stadium:m.venue||null
    }));
    res.status(200).json({team,matches,configured:true});
  } catch(e){res.status(503).json({team,matches:[],configured:true,error:'Agenda indisponível temporariamente'});}
}
