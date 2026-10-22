import React, { useState, useEffect, useMemo } from 'react';
import { 
  Menu as MenuIcon, X, Instagram, Mail, Phone, Calendar, Award, Users, Tv, Music, MapPin, 
  CheckCircle, ArrowRight, Clock, Shield, ChevronDown, Star, MessageCircle, Quote, 
  Coffee, Wine, ShieldCheck, Headphones, MousePointerClick, Smartphone, UserCheck,
  Beer, Zap, Play, Image as ImageIcon, Plus, Trash2, FolderOpen, AlertTriangle, Loader2, Download, Link as LinkIcon, ArrowLeft,
  Sparkles, Heart, MicVocal, Globe, Flame, Music2, TrendingUp, Verified, Info, Ticket, RefreshCw,
  Send
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, doc, setDoc } from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'arena-henko-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyDwLDVpSFe7aA2IX7Vhn736GETRvvjAorI", 
      authDomain: "arena-henko.firebaseapp.com",
      projectId: "arena-henko",
      storageBucket: "arena-henko.firebasestorage.app",
      messagingSenderId: "34887593341",
      appId: "1:34887593341:web:d6d68012cc9b8389797014"
    };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const LOGO_URL = 'https://i.imgur.com/vIWDDID.png'; 
const BTS_BANNER_URL = 'https://static.wikia.nocookie.net/the-bangtan-boys/images/e/ed/BTS_ARIRANG_Concept_Picture.png/revision/latest?cb=20260313221019';

const TEAM_LOGOS = {
  SPFC: "https://www.spfcpedia.com.br/escudos/bra_sp_sao-paulo_1938-19XXcamisa.png",
  SANTOS: "https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png",
  FLAMENGO: "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/orE554NToSkH6nuwofe7Yg_500x500.png",
  MACARA: "https://upload.wikimedia.org/wikipedia/commons/5/57/Macara_6.png",
  MIRASSOL: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png",
  CORITIBA: "https://upload.wikimedia.org/wikipedia/commons/c/ca/ECFC6.png",
  BOLIVAR: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Escudo_de_Club_Bol%C3%ADvar.svg",
  RBB: "https://a.espncdn.com/i/teamlogos/soccer/500/6079.png",
  ATLETICO_MG: "https://cdn.freebiesupply.com/logos/large/2x/clube-atletico-mineiro-de-belo-horizonte-mg-logo-black-and-white.png",
  CRUZEIRO: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/3840px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=thumbnail",
  BOCA_JUNIORS: "https://a.espncdn.com/i/teamlogos/soccer/500/5.png",
  INTERNACIONAL: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
  VITORIA: "https://cdn.freebiesupply.com/logos/thumbs/2x/esporte-clube-vitoria-de-salvador-ba-logo.png",
  VASCO: "https://a.espncdn.com/i/teamlogos/soccer/500/3454.png",
  CORINTHIANS: "https://a.espncdn.com/i/teamlogos/soccer/500/874.png",
  BAHIA: "https://a.espncdn.com/i/teamlogos/soccer/500/9967.png",
  PALMEIRAS: "https://a.espncdn.com/i/teamlogos/soccer/500/2029.png"
};

const DEFAULT_VENUES_DATA = {
  spfc: {
    id: 'spfc',
    name: 'Camarote Morumbis',
    stadiumName: 'Estádio do Morumbis',
    teamName: 'São Paulo FC',
    logo: TEAM_LOGOS.SPFC,
    accentClass: 'text-red-600',
    bgAccentClass: 'bg-red-600',
    borderAccentClass: 'border-red-600',
    hoverBorderAccentClass: 'hover:border-red-600',
    gradientClass: 'bg-gradient-to-r from-[#ff8a00] to-[#e52e12]',
    sportData: [
      { id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
        matches: [ 
          { id: 'br_spfc_corinthians', date: '04/11', home: 'SPFC', away: 'CORINTHIANS', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: TEAM_LOGOS.CORINTHIANS, stadium: 'Vila Belmiro, Santos/SP', notice: 'ATENÇÃO: jogo na Vila Belmiro, não no MorumBIS. Consulte a disponibilidade de hospitalidade.' }
        ] 
      },
      { id: 2, name: 'Copa do Brasil', subtitle: '2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
      { id: 3, name: 'Paulistão', subtitle: '2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
      { id: 4, name: 'Sudamericana', subtitle: 'Quartas de Final - Volta', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
        matches: [] 
      }
    ]
  },
  santos: {
    id: 'santos',
    name: 'Camarote Vila Belmiro',
    stadiumName: 'Estádio da Vila Belmiro',
    teamName: 'Santos FC',
    logo: TEAM_LOGOS.SANTOS,
    accentClass: 'text-gray-300',
    bgAccentClass: 'bg-white text-black',
    borderAccentClass: 'border-white',
    hoverBorderAccentClass: 'hover:border-white',
    gradientClass: 'bg-gradient-to-r from-gray-200 to-gray-500 text-black',
    sportData: [
      { id: 1, name: 'Brasileirão', subtitle: 'Série A 2026', image: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/85.png", 
        matches: [ 
          { id: 'br_sfc_bahia', date: '24/10', home: 'SANTOS', away: 'BAHIA', time: '21h00', homeLogo: TEAM_LOGOS.SANTOS, awayLogo: TEAM_LOGOS.BAHIA },
          { id: 'br_sfc_palmeiras', date: '28/10', home: 'SANTOS', away: 'PALMEIRAS', time: '19h30', homeLogo: TEAM_LOGOS.SANTOS, awayLogo: TEAM_LOGOS.PALMEIRAS }
        ] 
      },
      { id: 2, name: 'Copa do Brasil', subtitle: '2026', image: 'https://upload.wikimedia.org/wikipedia/pt/9/96/CopaDoBrasil.png', matches: [] },
      { id: 3, name: 'Paulistão', subtitle: '2026', image: 'https://i.imgur.com/Kl9LPUl.png', matches: [] },
      { id: 4, name: 'Sudamericana', subtitle: '2026', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/CONMEBOL_Sudamericana_logo_%282017%29.svg/250px-CONMEBOL_Sudamericana_logo_%282017%29.svg.png', 
        matches: [] }
    ]
  }
};

const SERVICES_DATA = [
    { id: 1, title: 'Lounge de Hospitalidade', icon: <Users className="w-6 h-6" />, desc: 'Espaço exclusivo para relaxamento e networking antes do evento.', imageUrl: 'https://i.imgur.com/Bw5Yw4K.png' },
    { id: 2, title: 'Recepção VIP', icon: <Award className="w-6 h-6" />, desc: 'Atendimento diferenciado e entrada exclusiva sem filas.', imageUrl: 'https://i.imgur.com/pLUfmBf.png' },
    { id: 3, title: 'Ambiente Premium', icon: <Beer className="w-6 h-6" />, desc: 'Open bar e Open Food com um cardápio sofisticado.', imageUrl: 'https://i.imgur.com/Za2zSyx.png' },
    { id: 4, title: 'Conforto Absoluto', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Ambiente climatizado com assentos de alto padrão.', imageUrl: 'https://i.imgur.com/PrhiB8E.png' },
    { id: 5, title: 'Vista Privilegiada', icon: <MapPin className="w-6 h-6" />, desc: 'A melhor visão do estádio para acompanhar todos os detalhes.', imageUrl: 'https://i.imgur.com/7R1hOwg.png' },
    { id: 6, title: 'Segurança Dedicada', icon: <Shield className="w-6 h-6" />, desc: 'Equipe especializada para garantir sua total tranquilidade.', imageUrl: 'https://i.imgur.com/Gy62moQ.png' },
];

const SHOWS_DATA = [
  { 
    id: 'show_bts', 
    name: 'BTS - ARIRANG TOUR', 
    date: '12/11/2026', 
    image: BTS_BANNER_URL, 
    desc: 'O retorno triunfal dos reis do K-Pop no Camarote Arena Henko.',
    imgClass: 'scale-105 group-hover:scale-110'
  },
  { 
    id: 'show_buteco', 
    name: 'O MAIOR BUTECO DO MUNDO', 
    date: '12/12/2026', 
    image: 'https://i.imgur.com/9x3iz4o.png', 
    desc: 'A maior experiência sertaneja do Brasil com open bar premium e vista privilegiada.',
    imgClass: 'object-bottom origin-bottom scale-[1.20] group-hover:scale-[1.25]'
  }
];

const REVIEWS_DATA = [
  { name: "Mariana Costa", text: "Lugar maravilhoso, comida excelente e atendimento de primeira! O melhor ambiente.", role: "Google Review" },
  { name: "João Paulo S.", text: "Conforto e segurança total para levar minha família. Passam muita credibilidade.", role: "Empresário" },
  { name: "Felipe Almeida", text: "O buffet é sensacional e a vista é a melhor possível. Atendimento nota 10.", role: "Google Review" },
  { name: "Ricardo Santos", text: "Atendimento diferenciado. Vale cada centavo pela hospitalidade.", role: "Convidado VIP" },
  { name: "Letícia Rossi", text: "Ambiente familiar e muito seguro. Meus filhos adoraram o espaço.", role: "Google Review" }
];

const STATIC_GALLERY = [
  {
    id: 'acdc-28-02',
    name: 'AC/DC - 28/02',
    folder: '/acdc-2802',
    cover: 'https://www.rbsdirect.com.br/filestore/8/5/6/4/1/9/4_9472ea360a1702b/4914658_704acea3d79d4d7.jpg?version=1575255600',
    photos: Array.from({length: 30}, (_, i) => `show-acdc-${String(i+1).padStart(2, '0')}.jpeg`)
  },
  {
    id: 'the-weeknd-30-04',
    name: 'The Weeknd - 30/04',
    folder: '/The Weeknd - 3004',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8I8ec_zK_5zE0-LC_2Xv7BTF0oqX8a6RBAr5NW7OFQg&s=10',
    // 🚨 AQUI VOCÊ COLOCA O NOME EXATO DOS ARQUIVOS DAS FOTOS QUE ESTÃO NA PASTA
    photos: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg'] 
  }
];

const NAV_LINKS = [
  { name: 'Sobre', href: '#sobre' },
  { name: 'Depoimentos', href: '#reviews' },
  { name: 'Agenda', href: '#calendario' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Experiência', href: '#servicos' },
  { name: 'Galeria', href: '#galeria' },
  { name: 'Clube VIP', href: '#clube-vip' },
  { name: 'Contato', href: '#contato' },
];

const StarRating = ({ count = 5, accentClass = "text-emerald-500" }) => (
  <div className={`flex gap-1 ${accentClass}`}>
    {[...Array(count)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
  </div>
);

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (error) return <div className={`${className} bg-neutral-800 flex items-center justify-center rounded-xl`}><ImageIcon className="text-neutral-600" /></div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

const App = () => {
  const [activeVenue, setActiveVenue] = useState('spfc');
  const [venuesData, setVenuesData] = useState(DEFAULT_VENUES_DATA);
  const [news, setNews] = useState({spfc:[],santos:[]});
  const [newsLoading, setNewsLoading] = useState(true);
  const [remoteFixtures, setRemoteFixtures] = useState({spfc:null,santos:null});

  useEffect(() => {
    let cancelled=false;
    const fetchNews = async () => {
      setNewsLoading(true);
      try {
        const response=await fetch('/api/news?team='+activeVenue);
        if (!response.ok) throw new Error('Sem notícias');
        const payload=await response.json();
        if(!cancelled) setNews(old=>({...old,[activeVenue]:payload.items||[]}));
      } catch(e) {
        if(!cancelled) setNews(old=>({...old,[activeVenue]:[]}));
      } finally {if(!cancelled) setNewsLoading(false);}
    };
    fetchNews();
    return ()=>{cancelled=true};
  },[activeVenue]);

  useEffect(() => {
    let cancelled=false;
    const syncFixtures=async team=>{
      try{
        const r=await fetch('/api/fixtures?team='+team);
        if(!r.ok) return;
        const payload=await r.json();
        if(!cancelled && payload.configured && Array.isArray(payload.matches)) {
          const localMatches=DEFAULT_VENUES_DATA[team].sportData[0].matches;
          const mapped=payload.matches.map(m=>{
            const dateObj=new Date(m.utcDate);
            const date=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit'}).format(dateObj);
            const time=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hour12:false}).format(dateObj).replace(':','h');
            const special=localMatches.find(x=>x.date===date && ((x.away==='CORINTHIANS' && /corinthians/i.test(m.away)) || (x.away==='PALMEIRAS' && /palmeiras/i.test(m.away))));
            return {...m,date,time,stadium:m.stadium,notice:m.notice||special?.notice||null};
          });
          setRemoteFixtures(old=>({...old,[team]:mapped}));
        }
      }catch(e){console.warn('Agenda automática temporariamente indisponível');}
    };
    syncFixtures('spfc');syncFixtures('santos');
    return ()=>{cancelled=true};
  },[]);

  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [user, setUser] = useState(null);

  const baseVenue = venuesData[activeVenue] || DEFAULT_VENUES_DATA[activeVenue];
  const currentVenue = useMemo(() => {
    const matches=remoteFixtures[activeVenue];
    if (!Array.isArray(matches)) return baseVenue;
    return {...baseVenue,sportData:baseVenue.sportData.map(sport=>sport.id===1?{...sport,matches}:sport)};
  },[baseVenue,remoteFixtures,activeVenue]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSportId, setActiveSportId] = useState(1); 
  const [expandedMatchKey, setExpandedMatchKey] = useState(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);

  // Estados do Formulário VIP
  const [vipForm, setVipForm] = useState({ name: '', phone: '', email: '' });
  const [isSubmittingVip, setIsSubmittingVip] = useState(false);
  const [vipSuccess, setVipSuccess] = useState(false);

  // NOVO: Faz o scroll funcionar para links com # (QR Code)
  useEffect(() => {
    if (window.location.hash) {
      const elementId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Espera meio segundo para a tela renderizar antes de descer
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const itv = setInterval(() => setCurrentReviewIndex(p => (p + 1) % REVIEWS_DATA.length), 6000);
    
    return () => {
      unsubscribeAuth();
      clearInterval(itv);
    };
  }, []);

  const selectedSport = useMemo(() => currentVenue.sportData.find(s => s.id === activeSportId) || currentVenue.sportData[0], [activeSportId, currentVenue]);
  const currentAlbum = useMemo(() => STATIC_GALLERY.find(a => a.id === activeAlbumId), [activeAlbumId]);
  
  const today = useMemo(() => {
    // Usa a data atual real para ocultar partidas encerradas automaticamente.
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const visibleMatches = useMemo(() => (selectedSport.matches || []).filter(m => {
      const [d, mo] = m.date.split('/');
      // Treat year as 2026 for all matches
      const pDate = m.utcDate ? new Date(m.utcDate) : new Date(2026, parseInt(mo) - 1, parseInt(d));
      // Show matches from today onwards
      return pDate >= today;
  }), [selectedSport, today]);

  const nextMatch = useMemo(() => {
    let allMatches = [];
    currentVenue.sportData.forEach(league => {
      allMatches = [...allMatches, ...league.matches];
    });

    const upcoming = allMatches.filter(m => {
      const [d, mo] = m.date.split('/');
      const pDate = m.utcDate ? new Date(m.utcDate) : new Date(2026, parseInt(mo) - 1, parseInt(d));
      return pDate >= today;
    });

    upcoming.sort((a, b) => {
       const [dA, moA] = a.date.split('/');
       const [dB, moB] = b.date.split('/');
       return (a.utcDate ? new Date(a.utcDate) : new Date(2026, parseInt(moA) - 1, parseInt(dA))) - (b.utcDate ? new Date(b.utcDate) : new Date(2026, parseInt(moB) - 1, parseInt(dB)));
    });

    return upcoming.length > 0 ? upcoming[0] : null;
  }, [currentVenue, today]);

  const getWaLink = (msg) => `https://wa.me/5511940741355?text=${encodeURIComponent(msg)}`;

  // VALIDAÇÕES DO VIP (NOVIDADE AQUI!)
  const handlePhoneChange = (e) => {
      let value = e.target.value.replace(/\D/g, ''); // Arranca as letras fora
      if (value.length > 11) value = value.slice(0, 11);

      let formattedValue = value;
      if (value.length > 2) {
          formattedValue = `(${value.slice(0, 2)}) `;
          if (value.length > 7) {
              formattedValue += `${value.slice(2, 7)}-${value.slice(7)}`;
          } else if (value.length > 6) {
              formattedValue += `${value.slice(2, 6)}-${value.slice(6)}`;
          } else {
              formattedValue += value.slice(2);
          }
      }
      setVipForm({ ...vipForm, phone: formattedValue });
  };

  const isValidEmail = (email) => {
      if (!email) return false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
  };

  const handleVipSubmit = async (e) => {
    e.preventDefault();

    // TRAVAS DE SEGURANÇA
    if (!vipForm.name) {
        setToast("Preencha seu Nome!");
        setTimeout(() => setToast(null), 3000);
        return;
    }

    const digitsOnly = vipForm.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
        setToast("Digite um telefone válido com DDD!");
        setTimeout(() => setToast(null), 3000);
        return;
    }

    if (vipForm.email && !isValidEmail(vipForm.email)) {
        setToast("Digite um e-mail válido com .com ou .com.br!");
        setTimeout(() => setToast(null), 3000);
        return;
    }

    setIsSubmittingVip(true);
    
    try {
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfBwGyln9khoahBhBXPQIR4-cc4jMnv29OuKeWbtLVA5U0pD4LjVDRGrVchU8flj7HWA/exec';
        
        const params = new URLSearchParams({
            nome: vipForm.name,
            telefone: vipForm.phone,
            email: vipForm.email || 'Não informado',
            data: new Date().toLocaleString('pt-BR')
        });
        
        await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
            method: 'GET',
            mode: 'no-cors'
        });

        setVipSuccess(true);
        setVipForm({ name: '', phone: '', email: '' });
        
        setTimeout(() => {
            setVipSuccess(false);
        }, 5000);
        
    } catch (error) {
        console.error("Erro ao cadastrar VIP:", error);
        setToast("Erro de conexão. Tente novamente.");
        setTimeout(() => setToast(null), 3000);
    } finally {
        setIsSubmittingVip(false);
    }
  };

  return (
    <div className={`font-sans text-white bg-black animate-fadeIn overflow-x-hidden scroll-smooth font-black italic ${activeVenue === 'santos' ? 'theme-santos' : 'theme-spfc'}`}>
      <style>{`
        @keyframes customFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-smooth { animation: customFadeIn 0.6s ease-out forwards; }
        @keyframes pulse-emerald { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .animate-pulse-wa { animation: pulse-emerald 2s infinite; }
        .drawer-content { max-height: 0; opacity: 0; overflow: hidden; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
        .drawer-open { max-height: 4000px; opacity: 1; padding-top: 1rem; }
      `}</style>
      
      {/* Importação direta e forçada do CSS via Link para evitar bloqueios do React usando os arquivos em /public */}
      <link rel="stylesheet" href="/banner-kmarote/style.css" />

      {/* Floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-[250]">
          <button onClick={() => window.open(getWaLink(`Olá! Gostaria de falar sobre o ${currentVenue.name}.`))} className="w-16 h-16 bg-emerald-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse-wa transition-transform hover:scale-110 active:scale-95">
              <MessageCircle className="w-8 h-8 text-white fill-white" />
          </button>
      </div>

      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-8 flex justify-between items-center transition-all">
        <div className="flex items-center gap-6">
          <div className="cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <img src={LOGO_URL} alt="Logo" className="h-10 md:h-14 w-auto object-contain transition-transform hover:scale-105" />
          </div>
          <div className="w-px h-8 bg-white/20 hidden md:block"></div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveVenue('spfc')} 
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${activeVenue === 'spfc' ? 'bg-red-600/20 border border-red-600/50' : 'opacity-50 hover:opacity-100 hover:bg-white/5 border border-transparent'}`}
            >
              <img src={TEAM_LOGOS.SPFC} alt="SPFC" className="h-6 w-6 object-contain" />
              <span className={`hidden md:block text-[10px] uppercase tracking-widest ${activeVenue === 'spfc' ? 'text-red-500' : 'text-white'}`}>Morumbis</span>
            </button>
            <button 
              onClick={() => setActiveVenue('santos')} 
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${activeVenue === 'santos' ? 'bg-white/20 border border-white/50' : 'opacity-50 hover:opacity-100 hover:bg-white/5 border border-transparent'}`}
            >
              <img src={TEAM_LOGOS.SANTOS} alt="Santos" className="h-6 w-6 object-contain" />
              <span className={`hidden md:block text-[10px] uppercase tracking-widest ${activeVenue === 'santos' ? 'text-white' : 'text-white'}`}>Vila Belmiro</span>
            </button>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 uppercase text-[10px] tracking-[0.2em] text-white/80">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} className={`hover:${currentVenue.accentClass} transition-all`}>{link.name}</a>)}
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-all"><MenuIcon /></button>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl p-10 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 p-4 bg-neutral-900 rounded-full text-white hover:text-red-600"><X /></button>
          <div className="flex flex-col gap-8 justify-center items-center h-full text-center">
            {NAV_LINKS.map(link => <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-4xl uppercase hover:${currentVenue.accentClass} italic transition-all`}>{link.name}</a>)}
          </div>
      </div>

      <section className="pt-28 md:pt-32 pb-12 bg-neutral-950 border-b border-purple-900/30 flex justify-center px-6 overflow-hidden">
        <div className="kmarote-banner">
          <img
            className="kb-photo"
            src="/banner-kmarote/images/show-bts.webp"
            alt="Público em um show de K-pop visto do camarote, com palco iluminado em roxo e confetes no ar"
          />

          <div className="kb-logo">
            <img src="/banner-kmarote/images/logo-kmarote.webp" alt="Logo da promoção Kmarote, da Klove.fan" />
          </div>

          <div className="kb-text">
            <p className="kb-headline">
              1 INGRESSO VIP para o camarote do show do BTS
              <span className="kb-headline__plus">+</span> 1 viagem para a Coreia do Sul.
            </p>

            <p className="kb-caption">Adquira seu pack de stickers por R$ 15,00.</p>

            <div className="kb-actions">
              <a
                className="kb-pill"
                href="https://kmarote.klove.fan/"
                target="_blank"
                rel="noopener noreferrer"
              >participe</a>
              <a
                className="kb-pill kb-pill--outline"
                href="https://kmarote.klove.fan/regulamento"
                target="_blank"
                rel="noopener noreferrer"
              >regulamento</a>
            </div>

            <p className="kb-legal">
              Consulte o regulamento completo. *Imagens meramente ilustrativas.
            </p>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-neutral-950 overflow-hidden border-b border-purple-900/30">
        <div className="absolute inset-0 z-0">
          <img src={BTS_BANNER_URL} className="w-full h-full object-cover object-center opacity-20 scale-105" alt="BTS" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/20 to-black z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-3">
              BTS WORLD TOUR <span className="text-purple-500 block lg:inline">- ARIRANG</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <p className="text-sm md:text-base font-black uppercase tracking-widest text-purple-400 italic">MORUMBIS • NOV/2026</p>
                <span className="bg-purple-600 text-white text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest font-black shadow-lg">Lote Esgotado</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-5">
              <p className="text-purple-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">ACOMPANHE NO INSTAGRAM</p>
              <button 
                onClick={() => window.open("https://instagram.com/arenahenko", "_blank")}
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-neutral-900 border border-purple-500 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-purple-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                ACESSAR INSTAGRAM <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </button>
          </div>
        </div>
      </section>

      <section id="servicos" className={`bg-neutral-900/50 border-y border-white/5 py-24 ${currentVenue.accentClass} text-[10px] tracking-widest uppercase italic text-center font-black transition-colors`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-16 italic text-white">Nossos <span className={currentVenue.accentClass}>Serviços</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className="group relative h-[300px] rounded-[3rem] overflow-hidden border border-white/5 bg-black shadow-2xl">
                <img src={service.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 right-10 text-left">
                  <div className={`${currentVenue.bgAccentClass} ${activeVenue === 'spfc' ? 'text-white' : 'text-black'} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>{service.icon}</div>
                  <h3 className="text-2xl font-black uppercase italic mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-400 text-sm font-normal">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calendario" className="py-24 px-6 bg-neutral-950 text-white italic border-y border-white/5 relative">
        <h2 className="text-4xl md:text-6xl font-black uppercase text-center mb-16 italic">Agenda <span className={currentVenue.accentClass}>{currentVenue.teamName}</span></h2>
        
        {/* Next Match Banner */}
        {nextMatch && (
          <div className="max-w-4xl mx-auto mb-16 relative group cursor-pointer" onClick={() => window.open(getWaLink(`Interesse no próximo jogo: ${nextMatch.home} x ${nextMatch.away} no ${currentVenue.name}`))} >
              <div className={`absolute inset-0 ${currentVenue.bgAccentClass} blur-xl opacity-20 rounded-[3rem] group-hover:opacity-40 transition-opacity`} />
              <div className="relative bg-neutral-900 border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl">
                  <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                          <Zap size={16} className={currentVenue.accentClass} />
                          <span className={`${currentVenue.accentClass} text-[10px] uppercase tracking-widest font-black`}>Próximo Jogo</span>
                      </div>
                      <h3 className="text-3xl font-black uppercase mb-1">{nextMatch.home} x {nextMatch.away}</h3>
                      <p className="text-gray-400 text-sm">{nextMatch.date} às {nextMatch.time} • {nextMatch.stadium || currentVenue.stadiumName}</p>
                      {nextMatch.notice && <p className="text-amber-300 font-bold text-xs mt-2">{nextMatch.notice}</p>}
                  </div>
                  <div className="flex items-center gap-6">
                      <img src={nextMatch.homeLogo} className="h-16 w-16 object-contain drop-shadow-xl" alt={nextMatch.home} />
                      <span className="text-gray-600 font-black text-xl italic opacity-50">VS</span>
                      <img src={nextMatch.awayLogo} className="h-16 w-16 object-contain drop-shadow-xl" alt={nextMatch.away} />
                  </div>
                  <div className="hidden lg:block">
                     <button className={`h-12 w-12 rounded-full ${currentVenue.bgAccentClass} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                         <ArrowRight size={20} className={activeVenue === 'santos' ? 'text-black' : 'text-white'} />
                     </button>
                  </div>
              </div>
          </div>
        )}

        {/* League Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
            {currentVenue.sportData.map(s => (
              <button key={s.id} onClick={() => setActiveSportId(s.id)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${activeSportId === s.id ? `${currentVenue.bgAccentClass} shadow-xl border-transparent` : 'bg-neutral-900 text-gray-500 hover:text-white border border-transparent'}`}>{s.name}</button>
            ))}
        </div>

        {/* Matches List */}
        <div key={activeSportId} className="max-w-6xl mx-auto bg-black/40 rounded-[3rem] p-8 md:p-16 border border-neutral-800 shadow-3xl animate-smooth">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
                <div className="lg:col-span-2 text-center">
                    <div className="bg-black w-32 h-32 mx-auto rounded-3xl p-6 border border-neutral-800 flex items-center justify-center mb-6 overflow-hidden">
                      <ImageWithFallback src={selectedSport.image} alt="League" className="max-h-full object-contain" />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic mb-2">{selectedSport.name}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{selectedSport.subtitle}</p>
                </div>
                <div className="lg:col-span-3 space-y-4">
                    {visibleMatches.length > 0 ? visibleMatches.map((m) => (
                    <div key={m.id} className={`bg-neutral-900 border transition-all duration-300 rounded-[2.5rem] overflow-hidden ${expandedMatchKey === m.id ? `${currentVenue.borderAccentClass} shadow-2xl bg-black` : 'border-neutral-800 hover:border-neutral-700'}`}>
                        <button onClick={() => setExpandedMatchKey(expandedMatchKey === m.id ? null : m.id)} className="w-full p-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                           <span className={`${currentVenue.accentClass} text-base font-mono font-bold w-full md:w-auto text-left`}>{m.date}</span> 
                           <div className="flex flex-1 items-center justify-center gap-6">
                              <img src={m.homeLogo} className="w-12 h-12 object-contain" alt="" />
                              <span className="opacity-30 italic text-sm font-black">VS</span>
                              <img src={m.awayLogo} className="w-12 h-12 object-contain" alt="" />
                           </div>
                           <ChevronDown size={24} className={`text-gray-500 transition-transform ${expandedMatchKey === m.id ? `rotate-180 ${currentVenue.accentClass}` : ''}`} />
                        </button>
                        <div className={`drawer-content ${expandedMatchKey === m.id ? 'drawer-open px-8 pb-8' : ''}`}>
                             <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-left">
                                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Horário / Local</p><p className="text-sm font-bold text-white">{m.time} • {m.stadium || currentVenue.stadiumName}</p></div>
                                <div className="text-right"><p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Hospitalidade</p><p className="text-sm font-bold text-emerald-500 uppercase">{m.notice ? 'Consultar disponibilidade' : 'Full Open Bar & Food'}</p></div>
                                {m.notice && <p className="col-span-2 text-amber-300 text-xs font-bold">{m.notice}</p>}
                                <button onClick={() => window.open(getWaLink(`Interesse no jogo ${m.home} x ${m.away} (${m.date}), local: ${m.stadium || currentVenue.stadiumName}. Gostaria de confirmar disponibilidade de hospitalidade.`))} className={`col-span-2 mt-4 bg-white/5 ${currentVenue.hoverBorderAccentClass} py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest text-white border border-transparent hover:bg-neutral-800`}><Ticket size={16}/> Consultar Disponibilidade</button>
                             </div>
                        </div>
                    </div>
                    )) : <p className="text-center text-gray-700 py-16 uppercase text-[10px] font-black">Nenhum jogo previsto no momento.</p>}
                </div>
            </div>
        </div>
      </section>

      <section id="noticias" className="py-20 px-6 bg-neutral-900 text-white border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
            <div>
              <p className={`text-[11px] uppercase tracking-[0.3em] font-black mb-2 ${currentVenue.accentClass}`}>Arena informa</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic">Notícias do <span className={currentVenue.accentClass}>{activeVenue === 'spfc' ? 'São Paulo' : 'Santos'}</span></h2>
            </div>
            <a href={activeVenue==='spfc'?'https://ge.globo.com/futebol/times/sao-paulo/':'https://ge.globo.com/futebol/times/santos/'} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-300 hover:text-white flex gap-2 items-center">Todas as notícias no ge <ArrowRight size={16}/></a>
          </div>
          {newsLoading ? (
            <p className="text-gray-400 text-sm py-8">Buscando notícias recentes...</p>
          ) : news[activeVenue].length ? (
            <div className="grid md:grid-cols-2 gap-5">
              {news[activeVenue].slice(0,2).map(item=><a key={item.link} href={item.link} target="_blank" rel="noopener noreferrer" className="group rounded-3xl bg-black/40 border border-white/10 hover:border-white/30 p-6 transition-colors">
                <span className={`text-[10px] uppercase tracking-widest font-black ${currentVenue.accentClass}`}>ge • Notícias</span>
                <h3 className="mt-3 text-lg font-bold leading-snug group-hover:underline">{item.title}</h3>
                <div className="text-xs text-gray-400 mt-5 flex items-center justify-between">
                  <span>{item.date && !Number.isNaN(Date.parse(item.date)) ? new Date(item.date).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'}) : 'Notícia recente'}</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-200">Ler notícia completa no ge <ArrowRight size={16}/></span>
                </div>
              </a>)}
            </div>
          ) : <p className="text-sm text-gray-400 py-7">Notícias temporariamente indisponíveis. Acompanhe diretamente pelo ge.</p>}
          <p className="text-gray-500 text-xs mt-6">Manchetes externas disponibilizadas pelo Google Notícias. Leia a matéria completa na fonte. Arena Henko não é afiliada ao ge.</p>
        </div>
      </section>

      <section id="eventos" className="py-24 px-6 bg-black text-center italic border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-20 italic text-white">Mega <span className={currentVenue.accentClass}>Eventos</span></h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {SHOWS_DATA.map((show) => (
              <div key={show.id} className="group flex flex-col text-left">
                <div className={`relative h-[400px] rounded-[3.5rem] overflow-hidden mb-8 border border-neutral-800 ${currentVenue.hoverBorderAccentClass} transition-all duration-700 shadow-2xl bg-neutral-900`}>
                  <img src={show.image} className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ${show.imgClass || 'scale-105 group-hover:scale-110'}`} alt={show.name} />
                </div>
                <span className={`${currentVenue.accentClass} text-[11px] font-black uppercase tracking-[0.4em] mb-3 block italic`}>{show.date}</span>
                <h3 className="text-3xl font-black uppercase mb-4 italic text-white leading-none">{show.name}</h3>
                <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed italic pr-4">{show.desc}</p>
                <button onClick={() => window.open(getWaLink(`Interesse oficial no evento ${show.name}.`))} className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-white transition-colors hover:${currentVenue.accentClass}`}><ArrowRight size={18} /> Ver Disponibilidade</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 bg-neutral-950 border-b border-white/5 text-center italic">
        <div className="max-w-4xl mx-auto px-6">
          <Quote className={`w-12 h-12 ${currentVenue.accentClass} mx-auto mb-8 opacity-40`} />
          <div className="relative overflow-hidden h-48 md:h-40">
            {REVIEWS_DATA.map((review, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-700 ${currentReviewIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-xl md:text-2xl text-white italic mb-6 font-bold">"{review.text}"</p>
                <div className="flex justify-center mb-2"><StarRating accentClass={currentVenue.accentClass} /></div>
                <h4 className={`${currentVenue.accentClass} uppercase text-xs tracking-widest font-black`}>{review.name} — {review.role}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="py-24 px-6 bg-black border-b border-white/5 text-center italic">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-16 gap-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white">Nossa <span className={currentVenue.accentClass}>Galeria</span></h2>
            {isAlbumOpen && (
              <button onClick={() => setIsAlbumOpen(false)} className={`mt-4 flex items-center gap-2 ${currentVenue.accentClass} hover:text-white transition-colors uppercase text-[10px] font-black`}>
                <ArrowLeft size={18} /> Voltar para Álbuns
              </button>
            )}
          </div>

          {!isAlbumOpen ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-smooth">
              {STATIC_GALLERY.map((album) => (
                <div key={album.id} onClick={() => { setActiveAlbumId(album.id); setIsAlbumOpen(true); }} className={`group relative cursor-pointer overflow-hidden rounded-[3rem] aspect-[4/3] border border-white/10 bg-neutral-900 shadow-2xl transition-transform hover:scale-[1.02] ${currentVenue.hoverBorderAccentClass}`}>
                  <img src={album.cover} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700" alt={album.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 text-left">
                     <div className={`${currentVenue.bgAccentClass} text-white px-4 py-1 rounded-full text-[8px] w-fit mb-3 uppercase font-black italic`}>Pasta</div>
                     <h3 className="text-2xl italic uppercase font-black text-white">{album.name}</h3>
                     <p className="text-gray-400 text-[10px] mt-1 uppercase font-black opacity-60">{album.photos.length} Fotos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-smooth">
              {currentAlbum.photos.map((photoName, idx) => (
                <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-xl">
                   <img 
                    src={`${currentAlbum.folder}/${photoName}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={`Foto ${idx}`} 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800"; }}
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white"><Download size={24} /></button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="clube-vip" className="py-24 px-6 bg-neutral-950 text-center italic relative overflow-hidden">
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] ${currentVenue.bgAccentClass} blur-[120px] opacity-5 rounded-full pointer-events-none`} />
         <div className="max-w-3xl mx-auto relative z-10">
            <div className={`w-16 h-16 mx-auto rounded-3xl ${currentVenue.bgAccentClass} flex items-center justify-center mb-8 shadow-2xl`}>
                <Star className={`w-8 h-8 ${activeVenue === 'spfc' ? 'text-white' : 'text-black'}`} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 text-white">Clube VIP <span className={currentVenue.accentClass}>Henko</span></h2>
            <p className="text-gray-400 text-sm mb-12 uppercase tracking-widest font-bold">Cadastre-se para receber promoções, informações e participar dos sorteios do Camarote Arena Henko.</p>

            {vipSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/50 p-8 rounded-[3rem] animate-smooth">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl text-white uppercase mb-2">Cadastro Confirmado!</h3>
                    <p className="text-emerald-400 text-sm">Você já faz parte do nosso clube exclusivo.</p>
                </div>
            ) : (
                <form onSubmit={handleVipSubmit} className="bg-black border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-3xl text-left space-y-6 relative overflow-hidden">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-2 px-2">Nome Completo *</label>
                            <input type="text" required value={vipForm.name} onChange={e => setVipForm({...vipForm, name: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="Digite seu nome" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-2 px-2">WhatsApp *</label>
                                <input type="tel" required value={vipForm.phone} onChange={handlePhoneChange} className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 tracking-widest block mb-2 px-2">E-mail</label>
                                <input type="email" value={vipForm.email} onChange={e => setVipForm({...vipForm, email: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-gray-700 font-bold" placeholder="contato@email.com" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmittingVip} className={`w-full py-6 rounded-2xl ${currentVenue.bgAccentClass} ${activeVenue === 'spfc' ? 'text-white' : 'text-black'} text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 mt-4`}>
                        {isSubmittingVip ? <Loader2 className="animate-spin w-5 h-5" /> : <><Send className="w-5 h-5" /> CADASTRAR AGORA</>}
                    </button>
                </form>
            )}
         </div>
      </section>

      <footer id="contato" className="py-32 bg-neutral-950 border-t border-neutral-900 text-center italic">
        <h2 className="text-5xl md:text-7xl font-black mb-20 uppercase italic text-white leading-none">VIVA SUA <br/><span className={currentVenue.accentClass}>ARENA HENKO.</span></h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 text-white uppercase text-[10px] tracking-widest mb-20 font-black">
            <a href="https://instagram.com/arenahenko" target="_blank" rel="noopener noreferrer" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 ${currentVenue.hoverBorderAccentClass} transition-all flex flex-col items-center gap-5 shadow-2xl italic`}><Instagram className={`${currentVenue.accentClass} w-12 h-12`} /> Instagram</a>
            <a href="https://wa.me/5511940741355" target="_blank" rel="noopener noreferrer" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 ${currentVenue.hoverBorderAccentClass} transition-all flex flex-col items-center gap-5 shadow-2xl italic`}><Phone className={`${currentVenue.accentClass} w-12 h-12`} /> WhatsApp</a>
            <a href="mailto:sergio@henkoproducoes.com.br" className={`bg-black p-14 rounded-[3rem] border border-neutral-800 ${currentVenue.hoverBorderAccentClass} transition-all flex flex-col items-center gap-5 shadow-2xl italic`}><Mail className={`${currentVenue.accentClass} w-12 h-12`} /> E-mail</a>
        </div>
        <img src={LOGO_URL} className="h-16 mx-auto opacity-30" alt="" />
      </footer>

      {toast && <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] ${currentVenue.bgAccentClass} text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest animate-bounce flex items-center gap-3`}><AlertTriangle size={16} /> {toast}</div>}
    </div>
  );
};

export default App;
