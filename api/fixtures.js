// Configure FOOTBALL_DATA_API_KEY somente no ambiente da Vercel.
const aliases = {spfc:['são paulo','sao paulo','são paulo fc'],santos:['santos','santos fc']};
const norm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// Só anunciar partidas em estádios com operação da Arena. Não inferir local pelo mandante.
const approvedVenue = venue => {
  const normalized=norm(venue).replace(/[^a-z0-9 ]/g,' ');
  if (/\b(morumbi|morumbis|cicero pompeu de toledo)\b/.test(normalized)) return 'MorumBIS';
  if (/\b(vila belmiro|urbano caldeira)\b/.test(normalized)) return 'Vila Belmiro';
  return null;
};
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
    }).filter(m=>['SCHEDULED','TIMED'].includes(m.status)).filter(m=>new Date(m.utcDate).getTime()>=Date.now()-86400000).map(m=>({...m,arenaVenue:approvedVenue(m.venue)})).filter(m=>Boolean(m.arenaVenue)).slice(0,12).map(m=>({
      id:'auto-'+m.id, utcDate:m.utcDate, status:m.status,
      home:m.homeTeam?.shortName||m.homeTeam?.name||'Mandante',
      away:m.awayTeam?.shortName||m.awayTeam?.name||'Visitante',
      homeLogo:m.homeTeam?.crest||'',awayLogo:m.awayTeam?.crest||'',
      stadium:m.arenaVenue, venueVerified:true, notice:team==='spfc' && m.arenaVenue==='Vila Belmiro' ? 'Jogo na Vila Belmiro, não no MorumBIS. Confirme a disponibilidade de hospitalidade.' : team==='santos' && m.arenaVenue==='MorumBIS' ? 'Jogo no MorumBIS, não na Vila Belmiro. Confirme a disponibilidade de hospitalidade.' : null
    }));
    // Exclusão editorial solicitada: SPFC x Corinthians em 04/11/2026.
    // Impede que o fornecedor esportivo reintroduza o jogo na agenda.
    if (team === 'spfc') {
      const localDate = utc => new Date(utc).toLocaleDateString('en-CA', {timeZone:'America/Sao_Paulo'});
      for(let i=matches.length-1;i>=0;i--) {
        if(/corinthians/i.test(matches[i].away) && localDate(matches[i].utcDate)==='2026-11-04') matches.splice(i,1);
      }
    }
    // Partida validada na tabela detalhada CBF (30/10/2026).
    // Fallback expira no início do jogo para não manter anúncio antigo.
    if (team === 'spfc' && Date.now() < Date.parse('2026-11-20T00:30:00Z')) {
      const matchDate='2026-11-20T00:30:00Z';
      const exists=matches.some(m=>/fluminense/i.test(m.away) && Math.abs(new Date(m.utcDate)-new Date(matchDate))<86400000);
      if (!exists) matches.push({
        id:'official-spfc-fluminense-2026-11-19',
        utcDate:matchDate,status:'TIMED',
        home:'São Paulo',away:'Fluminense',
        homeLogo:'https://www.spfcpedia.com.br/escudos/bra_sp_sao-paulo_1938-19XXcamisa.png',
        awayLogo:'https://a.espncdn.com/i/teamlogos/soccer/500/3445.png',
        stadium:'MorumBIS',venueVerified:true,
        notice:'Partida no MorumBIS. Consulte disponibilidade de hospitalidade.'
      });
    }
    matches.sort((a,b)=>new Date(a.utcDate)-new Date(b.utcDate));
    res.status(200).json({team,matches,configured:true});
  } catch(e){res.status(503).json({team,matches:[],configured:true,error:'Agenda indisponível temporariamente'});}
}
