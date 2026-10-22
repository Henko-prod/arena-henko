// Fontes externas ficam no servidor para evitar problemas de CORS.
const TEAM_QUERY = {
  spfc: 'site:ge.globo.com/futebol/times/sao-paulo/ "São Paulo"',
  santos: 'site:ge.globo.com/futebol/times/santos/ "Santos"'
};
const decode = v => v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]*>/g,'').trim();
const field = (xml, tag) => decode((xml.match(new RegExp('<'+tag+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+tag+'>','i'))||[])[1]||'');
export default async function handler(req,res) {
  const club = req.query.team === 'santos' ? 'santos' : 'spfc';
  res.setHeader('Cache-Control','s-maxage=1800, stale-while-revalidate=3600');
  try {
    const url = 'https://news.google.com/rss/search?q='+encodeURIComponent(TEAM_QUERY[club])+'&hl=pt-BR&gl=BR&ceid=BR:pt-419';
    const response = await fetch(url,{headers:{'User-Agent':'ArenaHenko/1.0'},signal:AbortSignal.timeout(9000)});
    if (!response.ok) throw new Error('Fonte indisponível: '+response.status);
    const xml=await response.text();
    const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,16).map((m,i)=>({
      id: String(i),title:field(m[1],'title').replace(/ - (ge|Globo Esporte)$/i,''),
      link:field(m[1],'link'), date:field(m[1],'pubDate'),
      source:'ge via Google Notícias'
    })).filter(x=>x.title&&x.link&&/^https:\/\//.test(x.link)).slice(0,6);
    if(!items.length) throw new Error('Sem itens disponíveis');
    res.status(200).json({team:club,items});
  } catch(e){res.status(503).json({team:club,items:[],error:'Notícias indisponíveis temporariamente'});}
}
