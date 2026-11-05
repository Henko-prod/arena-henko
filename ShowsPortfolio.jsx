import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, X, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';
import { STATIC_GALLERY } from './ArenaHenko.jsx';

const LOGO_URL = 'https://i.imgur.com/vIWDDID.png';
const getAlbumFromUrl = () => {
  const id = new URLSearchParams(window.location.search).get('album');
  return STATIC_GALLERY.find(album => album.id === id)?.id || null;
};
const thumbnailFromDrive = href => {
  const id = href?.match(/\/d\/([^/]+)/)?.[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200` : null;
};

export default function ShowsPortfolio() {
  const [albumId, setAlbumId] = useState(getAlbumFromUrl);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);
  const activeAlbum = STATIC_GALLERY.find(a => a.id === albumId);

  useEffect(() => {
    const onPop = () => { setAlbumId(getAlbumFromUrl()); setActiveVideo(null); setActivePhoto(null); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (!activeVideo && !activePhoto) return;
    const onKey = event => { if (event.key === 'Escape') { setActiveVideo(null); setActivePhoto(null); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeVideo, activePhoto]);

  const openAlbum = id => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('album', id);
    else url.searchParams.delete('album');
    window.history.pushState({}, '', url);
    setAlbumId(id);
    setActivePhoto(null);
    setActiveVideo(null);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };
  const photoSource = (album, photo) => typeof photo === 'string' ? `${album.folder}/${photo}` : photo.url;
  const photoHref = (album, photo) => typeof photo === 'string' ? photoSource(album, photo) : photo.href;
  const photoName = (photo, index) => typeof photo === 'string' ? `Foto ${index+1}` : photo.name;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <a href="/" aria-label="Arena Henko, voltar ao site" className="flex items-center gap-3">
            <img src={LOGO_URL} className="h-10 md:h-14 w-auto object-contain" alt="Arena Henko" />
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 border-l border-white/20 pl-4">Portfólio de Shows</span>
          </a>
          <a href="/" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border border-white/25 rounded-full px-4 py-3 hover:bg-white/10 transition-colors"><ArrowLeft size={16}/> Voltar ao site</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-24">
        <div className="mb-12">
          <p className="text-red-500 uppercase font-black text-xs tracking-[0.33em] mb-4">Arena Henko • Experiências ao vivo</p>
          <h1 className="uppercase italic font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none">
            {activeAlbum ? activeAlbum.name : <>Grandes <span className="text-red-600">Shows.</span></>}
          </h1>
          <p className="text-white/55 mt-5 max-w-2xl text-sm sm:text-base leading-relaxed">
            {activeAlbum ? 'Momentos registrados durante uma experiência Arena Henko.' : 'Um portfólio de experiências marcantes. Escolha um show para explorar fotos e vídeos.'}
          </p>
          {activeAlbum && <button type="button" onClick={()=>openAlbum(null)} className="inline-flex items-center gap-2 mt-7 text-sm font-bold text-red-400 hover:text-white"><ArrowLeft size={17}/> Todos os shows</button>}
        </div>

        {!activeAlbum ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {STATIC_GALLERY.map((album) => (
              <button key={album.id} type="button" onClick={()=>openAlbum(album.id)} className="relative group text-left rounded-[2rem] overflow-hidden border border-white/15 hover:border-red-500/70 bg-neutral-900 aspect-[4/3] transition-all">
                <img src={album.cover} alt={album.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                {album.featuredVideo && <span className="absolute top-5 right-5 flex items-center gap-2 px-3 py-2 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm"><Play size={13} fill="currentColor" /> Vídeo especial</span>}
                <div className="absolute left-6 right-6 bottom-6">
                  <span className="inline-block bg-red-600 text-white rounded-full px-3 py-1 text-[10px] uppercase font-black tracking-widest mb-3">Álbum</span>
                  <h2 className="font-black uppercase italic text-2xl sm:text-3xl">{album.name}</h2>
                  <p className="text-white/60 text-xs mt-2">{album.photos.length} fotos{album.videos?.length ? ` • ${album.videos.length} vídeos` : ''}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {activeAlbum.featuredVideo && (
              <button type="button" onClick={() => setActiveVideo({video: activeAlbum.featuredVideo, idx: -1})} className="group block relative w-full aspect-video max-h-[500px] overflow-hidden rounded-[1.8rem] sm:rounded-[2.5rem] border border-red-500/30 hover:border-red-500/80 bg-neutral-900 mb-10 text-left shadow-2xl transition-colors" aria-label={`Assistir ${activeAlbum.featuredVideo.title}`}>
                <img src={thumbnailFromDrive(activeAlbum.featuredVideo.href)||activeAlbum.cover} alt={`Capa do vídeo de apresentação de ${activeAlbum.name}`} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=activeAlbum.cover;}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <span className="absolute top-5 left-5 sm:top-8 sm:left-8 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold bg-red-600 px-4 py-2 rounded-full">Destaque do show</span>
                <span className="absolute inset-0 flex items-center justify-center"><span className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 border border-white/75 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600/80 transition-all"><Play size={39} fill="currentColor" className="ml-1.5" /></span></span>
                <span className="absolute bottom-6 left-6 right-6 sm:bottom-9 sm:left-9 text-lg sm:text-3xl font-black uppercase italic tracking-tight">{activeAlbum.featuredVideo.title}<span className="block text-xs sm:text-sm text-white/65 not-italic normal-case mt-2 tracking-normal font-medium">Clique para assistir sem sair do portfólio</span></span>
              </button>
            )}
            <p className="text-white/45 text-xs uppercase tracking-widest mb-6 font-bold">{activeAlbum.photos.length} fotos{activeAlbum.videos?.length ? ` • ${activeAlbum.videos.length} vídeos` : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
              {activeAlbum.photos.map((photo, idx) => (
                <button type="button" key={`photo-${idx}`} onClick={()=>setActivePhoto({src:photoSource(activeAlbum,photo),href:photoHref(activeAlbum,photo),name:photoName(photo,idx)})}
                  aria-label={`Ampliar ${photoName(photo,idx)}`} className="group relative aspect-square overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-neutral-900 hover:border-white/40 transition-colors">
                  <img src={photoSource(activeAlbum,photo)} alt={photoName(photo,idx)} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={e=>{e.currentTarget.style.opacity='0.15';}}/>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity flex items-center justify-center"><ImageIcon size={28}/></div>
                </button>
              ))}
              {(activeAlbum.videos||[]).map((video,idx)=>(
                <button type="button" key={video.href} onClick={()=>setActiveVideo({video,idx})} aria-label={`Assistir vídeo ${idx+1}`} className="group relative aspect-square overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-neutral-900 hover:border-white/40">
                  <img src={thumbnailFromDrive(video.href)||activeAlbum.cover} alt={`Prévia do vídeo ${idx+1}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=activeAlbum.photos[idx%activeAlbum.photos.length]?.url||activeAlbum.cover;}} />
                  <div className="absolute inset-0 bg-black/25"/>
                  <span className="absolute top-3 right-3 bg-black/55 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase font-bold">Vídeo</span>
                  <span className="absolute inset-0 flex items-center justify-center"><span className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-white/60 bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform"><Play size={26} fill="white" className="ml-1"/></span></span>
                  <span className="absolute bottom-4 left-4 text-xs font-bold drop-shadow">Momento {idx+1}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-white/10 bg-neutral-950 px-5 py-9 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-white/45">Arena Henko • Uma experiência única</p>
        <a href="/" className="mt-3 inline-block text-xs text-white/80 underline underline-offset-4">Conheça a Arena Henko</a>
      </footer>

      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8 bg-black/90 backdrop-blur-xl" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActiveVideo(null);}}>
          <div role="dialog" aria-modal="true" aria-label="Assistir vídeo do show" className="relative w-full max-w-5xl bg-neutral-950 border border-white/20 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 flex justify-between items-center"><span className="font-bold text-sm">{activeVideo.idx < 0 ? activeVideo.video.title : `Vídeo ${activeVideo.idx+1} • ${activeAlbum.name}`}</span><button type="button" onClick={()=>setActiveVideo(null)} aria-label="Fechar vídeo" className="p-2 rounded-full hover:bg-white/10"><X/></button></div>
            <iframe key={activeVideo.video.href} src={activeVideo.video.href.replace('/view','/preview')} title={`Vídeo ${activeVideo.idx+1}`} className="aspect-video w-full bg-black" allow="autoplay; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
            <div className="px-5 py-4 flex justify-end"><a href={activeVideo.video.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white">Abrir original <ExternalLink size={13}/></a></div>
          </div>
        </div>
      )}

      {activePhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-xl" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActivePhoto(null);}}>
          <div role="dialog" aria-modal="true" aria-label="Visualizar foto" className="relative max-w-6xl w-full flex flex-col items-center gap-4">
            <div className="w-full flex justify-end"><button type="button" className="p-3 bg-white/10 rounded-full hover:bg-white/20" onClick={()=>setActivePhoto(null)} aria-label="Fechar foto"><X/></button></div>
            <img src={activePhoto.src} alt={activePhoto.name} className="max-h-[75vh] max-w-full object-contain rounded-lg"/>
            <a href={activePhoto.href} target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 hover:text-white flex items-center gap-2">Abrir original <ArrowRight size={15}/></a>
          </div>
        </div>
      )}
    </div>
  );
}
