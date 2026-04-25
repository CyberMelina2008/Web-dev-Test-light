gsap.registerPlugin(ScrollTrigger);

const planets = [
    { name: "Merkurius", dist: 57900000, color: "#9ca3af", desc: "Planet terdekat dengan Matahari. Terpapar radiasi paling intens." },
    { name: "Venus", dist: 108200000, color: "#fb923c", desc: "Suhu ekstrem akibat efek rumah kaca yang tidak terkendali." },
    { name: "Bumi", dist: 149600000, color: "#3b82f6", desc: "Satu-satunya rumah yang kita kenal di tengah kegelapan." },
    { name: "Mars", dist: 227900000, color: "#ef4444", desc: "Dunia merah yang menyimpan rahasia masa lalu air." },
    { name: "Jupiter", dist: 778600000, color: "#d97706", desc: "Raksasa gas dengan gravitasi yang menjaga orbit kita." },
    { name: "Saturnus", dist: 1433500000, color: "#fcd34d", desc: "Keindahan cincin yang terbentuk dari es dan debu purba." },
    { name: "Uranus", dist: 2872500000, color: "#22d3ee", desc: "Raksasa es yang berputar pada sisinya yang miring." },
    { name: "Neptunus", dist: 4495100000, color: "#6366f1", desc: "Batas terjauh di mana angin supersonik menderu kencang." }
];

const solarSystem = document.getElementById('solarSystem');
const markerContainer = document.getElementById('planetMarkers');
const maxDist = planets[planets.length - 1].dist;
const maxTimeSeconds = 200; // Waktu tempuh ke Neptunus

// Inisialisasi Konten Planet
planets.forEach(p => {
    const section = document.createElement('section');
    section.className = 'planet-section';
    section.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
            <div class="flex justify-center order-2 md:order-1">
                <div class="planet-visual" style="background: radial-gradient(circle at 30% 30%, ${p.color}, #000)">
                    <div class="planet-glow" style="background-color: ${p.color}"></div>
                </div>
            </div>
            <div class="order-1 md:order-2" id="info-${p.name}">
                <h2 class="text-5xl font-light mb-2 font-space uppercase tracking-tighter">${p.name}</h2>
                <div class="text-slate-500 font-mono text-[10px] mb-6 tracking-[0.4em] uppercase">Status: Terdeteksi</div>
                <p class="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm font-light italic">${p.desc}</p>
            </div>
        </div>
    `;
    solarSystem.appendChild(section);

    const marker = document.createElement('div');
    marker.className = 'planet-marker';
    marker.style.top = `${(p.dist / maxDist) * 100}%`;
    markerContainer.appendChild(marker);

    gsap.from(`#info-${p.name}`, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1
        },
        y: 30, opacity: 0
    });
});

let photonState = { progress: 0 };
const photonDot = document.getElementById('photonDot');
const photonLabel = document.getElementById('photonPlanetLabel');
const globalTimer = document.getElementById('globalTimer');
const distDisplay = document.getElementById('distDisplay');
const photonBeam = document.getElementById('photonBeam');
let lastPlanet = "Matahari";

function startPhoton() {
    gsap.to(photonState, {
        progress: 1, duration: 45, ease: "none", repeat: -1,
        onUpdate: () => {
            const p = photonState.progress;
            const realTimeSeconds = p * maxTimeSeconds;
            
            globalTimer.textContent = formatMinimal(realTimeSeconds);
            distDisplay.textContent = `${Math.floor(p * maxDist / 1000000)} Juta km`;
            
            photonDot.style.top = `${p * 100}%`;
            updateLabel(p * maxDist);

            const beamOpacity = Math.sin(p * Math.PI);
            photonBeam.style.opacity = beamOpacity * 0.4;
        }
    });
}

function updateLabel(d) {
    let cp = "Matahari";
    for (let i = 0; i < planets.length; i++) { 
        if (d >= planets[i].dist) cp = planets[i].name; 
    }
    if (cp !== lastPlanet) {
        lastPlanet = cp;
        photonLabel.textContent = cp;
        gsap.fromTo(photonLabel, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.5 });
    }
}

function formatMinimal(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    
    if (h > 0) {
        return `${h}j ${m}m`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Inisialisasi Bintang
const stars = document.getElementById('stars');
for (let i = 0; i < 150; i++) {
    const s = document.createElement('div');
    s.style.cssText = `position:absolute;width:1px;height:1px;background:white;top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:${Math.random()*0.4}`;
    stars.appendChild(s);
}

window.onload = startPhoton;
