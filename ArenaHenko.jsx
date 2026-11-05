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
          { id: 'br_spfc_flu_20261119', date: '19/11', home: 'SPFC', away: 'FLUMINENSE', time: '21h30', homeLogo: TEAM_LOGOS.SPFC, awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/3445.png', stadium: 'MorumBIS' }
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
        matches: [] 
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
    id: 'show_buteco', 
    name: 'O MAIOR BUTECO DO MUNDO', 
    date: '12/12/2026', 
    image: 'https://i.imgur.com/9x3iz4o.png', 
    desc: 'A maior experiência sertaneja do Brasil com open bar premium e vista privilegiada.',
    imgClass: 'object-bottom origin-bottom scale-[1.20] group-hover:scale-[1.25]'
  },
  {
    id: 'show_foo_fighters',
    name: 'FOO FIGHTERS - TAKE COVER TOUR',
    date: '20/02/2027 • 20h',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Foo_Fighters_-_Rock_am_Ring_2018-5550.jpg?width=1200',
    imageCredit: 'Foto: Andreas Lawen / CC BY-SA 4.0',
    imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:Foo_Fighters_-_Rock_am_Ring_2018-5550.jpg',
    desc: 'Foo Fighters no MorumBIS. Consulte disponibilidade de camarote e condições de hospitalidade com a Arena Henko. Vagas sujeitas a confirmação.',
    imgClass: 'scale-105 group-hover:scale-110'
  },
  {
    id: 'show_u2',
    name: 'U2 - THE GREATEST SHOW ON EARTH',
    date: '10, 12, 14 e 16/03/2027 • 21h',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/U2_in_London_%2835012585704%29.jpg?width=1200',
    imageCredit: 'Foto: U2start / CC BY 2.0',
    imageCreditUrl: 'https://commons.wikimedia.org/wiki/File:U2_in_London_(35012585704).jpg',
    desc: 'Quatro apresentações no MorumBIS. Consulte disponibilidade para cada data e condições de hospitalidade. Sujeito a confirmação.',
    imgClass: 'scale-105 group-hover:scale-110'
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
    id: 'bts-28-10-2026',
    name: 'BTS - 28/10/2026',
    folder: '',
    cover: 'https://drive.google.com/thumbnail?id=1X9Ty2Q1biL9RN4BLzgOtZslKloBTztXA&sz=w1200',
    photos: [{"name":"30E8BE46-C63D-4EAE-A54B-B181A3D05005.JPG","url":"https://drive.google.com/thumbnail?id=1X9Ty2Q1biL9RN4BLzgOtZslKloBTztXA&sz=w1600","href":"https://drive.google.com/file/d/1X9Ty2Q1biL9RN4BLzgOtZslKloBTztXA/view"},{"name":"IMG_0358.HEIC","url":"https://drive.google.com/thumbnail?id=1k5-GA3ewPH2PkwiJUfea0BT75z2Gvzgx&sz=w1600","href":"https://drive.google.com/file/d/1k5-GA3ewPH2PkwiJUfea0BT75z2Gvzgx/view"},{"name":"PRINTS/01.png","url":"https://drive.google.com/thumbnail?id=1AWWcNH2iyPCWKC8bokEg59P1RRdQgxP9&sz=w1600","href":"https://drive.google.com/file/d/1AWWcNH2iyPCWKC8bokEg59P1RRdQgxP9/view"},{"name":"PRINTS/02.png","url":"https://drive.google.com/thumbnail?id=1f8Iac5u9OydtYhSjjUiGs0qDAlH7TlUD&sz=w1600","href":"https://drive.google.com/file/d/1f8Iac5u9OydtYhSjjUiGs0qDAlH7TlUD/view"},{"name":"PRINTS/03.png","url":"https://drive.google.com/thumbnail?id=1EgMQ_--zH8Ipw2-x8wXzRQa8hnxVaSiA&sz=w1600","href":"https://drive.google.com/file/d/1EgMQ_--zH8Ipw2-x8wXzRQa8hnxVaSiA/view"},{"name":"PRINTS/04.png","url":"https://drive.google.com/thumbnail?id=1qX8aosCilYki_d_WhVZFOWOkJZ4xC3jV&sz=w1600","href":"https://drive.google.com/file/d/1qX8aosCilYki_d_WhVZFOWOkJZ4xC3jV/view"},{"name":"PRINTS/05.png","url":"https://drive.google.com/thumbnail?id=110NVtxPB_QOKL7eKzx57COv0hF-cailL&sz=w1600","href":"https://drive.google.com/file/d/110NVtxPB_QOKL7eKzx57COv0hF-cailL/view"},{"name":"PRINTS/06.JPG","url":"https://drive.google.com/thumbnail?id=1lqvOr_QQ2yel6kLwRTGQiZDTKf2p3ceE&sz=w1600","href":"https://drive.google.com/file/d/1lqvOr_QQ2yel6kLwRTGQiZDTKf2p3ceE/view"},{"name":"PRINTS/07.png","url":"https://drive.google.com/thumbnail?id=1YJ5kpLtaaOUausdfe6SXHjFke4MyUsqf&sz=w1600","href":"https://drive.google.com/file/d/1YJ5kpLtaaOUausdfe6SXHjFke4MyUsqf/view"},{"name":"PRINTS/08.png","url":"https://drive.google.com/thumbnail?id=1yQmwRArWESTNN5bCI_wHzh6-4vHbbmn6&sz=w1600","href":"https://drive.google.com/file/d/1yQmwRArWESTNN5bCI_wHzh6-4vHbbmn6/view"},{"name":"IMG_7193.JPG","url":"https://drive.google.com/thumbnail?id=1Y9T7D60kTj18xmFNJN2eMvvWuhA--asu&sz=w1600","href":"https://drive.google.com/file/d/1Y9T7D60kTj18xmFNJN2eMvvWuhA--asu/view"},{"name":"IMG_7217.HEIC","url":"https://drive.google.com/thumbnail?id=1Va-bieyIsr5JO9UHiRVCe8ZaKnJjxXSM&sz=w1600","href":"https://drive.google.com/file/d/1Va-bieyIsr5JO9UHiRVCe8ZaKnJjxXSM/view"},{"name":"IMG_7209.JPG","url":"https://drive.google.com/thumbnail?id=1rMEh3qX4TOhKH7TNu3ff98pPzWj_Kx6O&sz=w1600","href":"https://drive.google.com/file/d/1rMEh3qX4TOhKH7TNu3ff98pPzWj_Kx6O/view"},{"name":"IMG_7203.JPG","url":"https://drive.google.com/thumbnail?id=1smbsHi_aYWcVMzz_LxIaGL3nD3L_EO89&sz=w1600","href":"https://drive.google.com/file/d/1smbsHi_aYWcVMzz_LxIaGL3nD3L_EO89/view"},{"name":"IMG_7168.HEIC","url":"https://drive.google.com/thumbnail?id=15Hl4NnlP0tn7CHL4XOPxdZKimLodQVs_&sz=w1600","href":"https://drive.google.com/file/d/15Hl4NnlP0tn7CHL4XOPxdZKimLodQVs_/view"}],
    videos: [{"name":"copy_6FAB2230-CBFB-4F53-8A3F-0AD4FF9D2A99.MOV","href":"https://drive.google.com/file/d/111K-wVl3B8iKBHxrB4IHgpthj3sQg-gL/view"},{"name":"IMG_0295.mov","href":"https://drive.google.com/file/d/18PRpzBgPTe3t1uCHRRqi7U4H0sJ3av6P/view"},{"name":"IMG_0294.MOV","href":"https://drive.google.com/file/d/1XsNUgt3uZy6G9TMXSjpmJaTwt5aSHCjc/view"},{"name":"IMG_0297.MOV","href":"https://drive.google.com/file/d/1uzZqrOf1QHW53rX6sx_FtXHt9vWQUHmf/view"},{"name":"IMG_0298.MOV","href":"https://drive.google.com/file/d/11Yp_OVF_5ePsdUQJmqycwhyv9QfGr4sZ/view"},{"name":"IMG_0306.MOV","href":"https://drive.google.com/file/d/1Q9GAV6EmjI4QrzzXxV4JV7J8CvP9radq/view"},{"name":"IMG_0307.MOV","href":"https://drive.google.com/file/d/12Tgz_LO9ifCwLURMqtyCqdIHOMGakfJP/view"},{"name":"IMG_0308.mov","href":"https://drive.google.com/file/d/1EHysewGONbm-eEPslpedjCmSq-VWRE90/view"},{"name":"IMG_0318.MOV","href":"https://drive.google.com/file/d/15nIdyI1ItlWf62n4j9BGyteP-NabynAF/view"},{"name":"IMG_0346.MOV","href":"https://drive.google.com/file/d/1z9B7en-ZT0MlFO7L9K9Chavuj9V3FVWm/view"},{"name":"IMG_0388.mov","href":"https://drive.google.com/file/d/1Qr58YwEtGuognkLO0hltdhmMipYu89MP/view"}]
  },
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
          const mapped=payload.matches.filter(m => !(team === 'spfc' && /corinthians/i.test(m.away) && new Date(m.utcDate).toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'}) === '2026-11-04')).map(m=>{
            const dateObj=new Date(m.utcDate);
            const date=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit'}).format(dateObj);
            const time=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',hour12:false}).format(dateObj).replace(':','h');
            const special=localMatches.find(x=>x.date===date && x.away==='PALMEIRAS' && /palmeiras/i.test(m.away));
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
  const [activeGalleryVideo, setActiveGalleryVideo] = useState(null);

  useEffect(() => {
    if (!activeGalleryVideo) return;
    const onKeyDown = (event) => { if (event.key === 'Escape') setActiveGalleryVideo(null); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeGalleryVideo]);

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

      {/* Destaque dos próximos três grandes shows */}
      <section className="relative overflow-hidden bg-neutral-950 border-b border-white/10 pt-28 md:pt-32 pb-12 md:pb-16 px-5 md:px-8 text-white" aria-label="Próximos grandes shows na Arena Henko">
        <div className="absolute -top-24 left-1/2 h-72 w-[80%] -translate-x-1/2 bg-red-700/10 blur-[110px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7 md:mb-9">
            <div>
              <p className="text-[10px] md:text-xs tracking-[0.35em] text-red-400 uppercase font-black mb-3">Arena Henko apresenta</p>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase italic leading-tight">Três shows gigantes.<br/><span className="text-white/55">Uma experiência única.</span></h1>
            </div>
            <a href="#eventos" className="self-start md:self-end inline-flex items-center gap-2 border border-white/30 hover:border-white hover:bg-white/10 rounded-full px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors">Confira os eventos <ArrowRight size={15}/></a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
            {SHOWS_DATA.map((show, index) => (
              <a key={show.id} href="#eventos" className="group relative min-h-[180px] md:min-h-[220px] overflow-hidden rounded-[1.7rem] border border-white/15 bg-neutral-900 hover:border-red-500/70 transition-colors">
                <img src={show.image} loading={index === 0 ? 'eager' : 'lazy'} alt={`Show ${show.name}`} className="absolute inset-0 h-full w-full object-cover object-center opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] text-red-300 uppercase tracking-[0.2em] font-bold mb-2">{show.date}</p>
                  <h2 className="text-xl md:text-2xl font-black uppercase italic leading-tight">{show.id === 'show_buteco' ? 'O Maior Buteco do Mundo' : show.id === 'show_foo_fighters' ? 'Foo Fighters' : 'U2'}</h2>
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-white/75">MorumBIS • Consulte disponibilidade</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[10px] text-white/45 mt-5 font-medium">Informações e disponibilidade de hospitalidade sujeitas a confirmação com a Arena Henko. Imagens ilustrativas de apresentações anteriores.</p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {SHOWS_DATA.map((show) => (
              <div key={show.id} className="group flex flex-col text-left">
                <div className={`relative h-[400px] rounded-[3.5rem] overflow-hidden mb-8 border border-neutral-800 ${currentVenue.hoverBorderAccentClass} transition-all duration-700 shadow-2xl bg-neutral-900`}>
                  <img src={show.image} className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ${show.imgClass || 'scale-105 group-hover:scale-110'}`} alt={show.name} />
                </div>
                {show.imageCredit && <a href={show.imageCreditUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-gray-300 mb-3 not-italic" title="Crédito e licença da fotografia">{show.imageCredit}</a>}
                <span className={`${currentVenue.accentClass} text-[11px] font-black uppercase tracking-[0.4em] mb-3 block italic`}>{show.date} • MorumBIS</span>
                <h3 className="text-3xl font-black uppercase mb-4 italic text-white leading-none">{show.name}</h3>
                <p className="text-gray-500 text-sm font-normal mb-8 leading-relaxed italic pr-4">{show.desc}</p>
                <button onClick={() => window.open(getWaLink(`Olá! Gostaria de consultar disponibilidade de camarote e condições de hospitalidade para ${show.name} (${show.date}). Entendo que a disponibilidade está sujeita a confirmação.`))} className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-3 text-white transition-colors hover:${currentVenue.accentClass}`}><ArrowRight size={18} /> Consultar Disponibilidade</button>
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
                     <p className="text-gray-400 text-[10px] mt-1 uppercase font-black opacity-60">{album.photos.length} Fotos{album.videos?.length ? ` • ${album.videos.length} Vídeos` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-smooth">
              {currentAlbum.photos.map((photoName, idx) => (
                <div key={idx} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 shadow-xl">
                   <img 
                    src={typeof photoName === 'string' ? `${currentAlbum.folder}/${photoName}` : photoName.url} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={typeof photoName === 'string' ? `Foto ${idx + 1}` : photoName.name} 
                    onError={(e) => { e.target.style.opacity = '0.1'; }}
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     {typeof photoName !== 'string' ? <a href={photoName.href} target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white"><ArrowRight size={24} /></a> : <span className="bg-white/10 backdrop-blur-md p-4 rounded-2xl text-white"><Download size={24} /></span>}
                   </div>
                </div>
              ))}
              {currentAlbum.videos?.map((video, idx) => (
                <button key={video.href} type="button" onClick={() => setActiveGalleryVideo({ ...video, number: idx + 1 })} aria-label={`Assistir vídeo ${idx + 1} do álbum ${currentAlbum.name}`} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 bg-neutral-900 shadow-xl hover:border-white/40 transition-all">
                  <img
                    src={`https://drive.google.com/thumbnail?id=${video.href.split('/d/')[1]?.split('/')[0]}&sz=w1200`}
                    alt={`Prévia do vídeo ${idx + 1} do show`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = currentAlbum.photos[idx % currentAlbum.photos.length]?.url || currentAlbum.cover;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-4 right-4 bg-black/55 backdrop-blur px-3 py-1 rounded-full text-[10px] tracking-widest uppercase text-white font-bold not-italic">Vídeo</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 text-white flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all"><Play size={30} fill="currentColor" className="ml-1" /></span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white not-italic">
                    <span className="font-bold text-sm">Momento {idx + 1}</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-white/75">Assistir <ArrowRight size={13} className="inline" /></span>
                  </div>
                </button>
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

      {activeGalleryVideo && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-8"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveGalleryVideo(null); }}
        >
          <div role="dialog" aria-modal="true" aria-label={`Vídeo ${activeGalleryVideo.number} da galeria`} className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-neutral-950 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 text-white">
              <span className="font-bold text-sm sm:text-base">BTS • 28/10/2026 | Vídeo {activeGalleryVideo.number}</span>
              <button type="button" onClick={() => setActiveGalleryVideo(null)} aria-label="Fechar vídeo" className="rounded-full p-2 hover:bg-white/15 transition-colors"><X size={24} /></button>
            </div>
            <iframe
              key={activeGalleryVideo.href}
              src={activeGalleryVideo.href.replace('/view', '/preview')}
              title={`Vídeo ${activeGalleryVideo.number} do BTS`}
              className="aspect-video w-full bg-black"
              allow="autoplay; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="flex justify-between items-center gap-3 px-5 py-4 text-xs text-gray-400">
              <span>Vídeo disponibilizado via Google Drive</span>
              <a href={activeGalleryVideo.href} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Abrir no Drive</a>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[500] ${currentVenue.bgAccentClass} text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest animate-bounce flex items-center gap-3`}><AlertTriangle size={16} /> {toast}</div>}
    </div>
  );
};

export default App;
