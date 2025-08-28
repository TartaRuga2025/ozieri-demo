
// DEMO build: install disabled, service worker disabled
const DEMO = true;

// ===== DATA =====
const sections = {
  "BUSINESS": {
    "Bars & Restaurants": [
      { "name": "Caff&egrave; Cardinale",            "url": "https://www.facebook.com/p/Caff%C3%A8-Cardinale-61570281903849/" },
      { "name": "Caff&egrave; Torino",     "url": "https://example.com" },
      { "name": "Ristorante La Torre",            "url": "https://www.latorreozieri.com/" }
    ],
    "Hotels & BnBs": [
      { "name": "Hotel xxx",          "url": "https://example.com" },
      { "name": "B&amp;B Dal Cardinale",            "url": "https://www.booking.com/hotel/it/b-amp-b-dal-cardinale.it.html" }
    ],
    "Sport": [
      { "name": "Public Swimming Pool",        "url": "https://example.com" },
      { "name": "Gym xxx",            "url": "https://" }
    ],
    "Real Estate": [
      { "name": "Agenzia xxx",      "url": "https://example.com" },
      { "name": "Agenzia xxx",            "url": "https://" }
    ],
    "Healthcare": [
      { "name": "Clinic xxx",     "url": "https://example.com" },
      { "name": "Dentist: xxx",            "url": "https://" }
    ],
    "Professionals": [
      { "name": "Lawyer: xxx",     "url": "https://example.com" },
      { "name": "Architect: xxx",            "url": "https://" }
    ]
  },

  "SERVICES": {
    "Municipal Offices": [
      { "name": "Town Hall",        "url": "https://example.com" },
      { "name": "Registry Office",            "url": "https://" }
    ],
    "Tax Office & CAF": [
      { "name": "Tax Office",         "url": "https://example.com" },
      { "name": "Tax Office - Payments",            "url": "https://" }
    ],
    "Utilities": [
      { "name": "Abbanoa",                 "url": "https://example.com" },
      { "name": "ENEL",            "url": "https://" }
    ],
    "Schools": [
      { "name": "Liceo xxx",   "url": "https://example.com" },
      { "name": "Liceo xxx",            "url": "https://" }
    ],
    "Transport": [
      { "name": "Buses (ARST)",         "url": "https://example.com" },
      { "name": "Taxi (Olbia)",            "url": "https://" }
    ],
    "Waste Collection": [
      { "name": "Collection Schedule",       "url": "https://example.com" },
      { "name": "Town Dump",            "url": "https://" }
    ]
  },

  "PHRASEBOOK": {
    "Greetings": [
      { "name": "Hello",            "url": "./phrasebook/greetings_hello.html" },
      { "name": "Goodbye",            "url": "./phrasebook/greetings_goodbye.html" },
      { "name": "How are you?",         "url": "#" }
    ],
    "Numbers": [
      { "name": "1 - 10",             "url": "#" },
      { "name": "20 - 100",         "url": "#" }
    ],
    "Shopping": [
      { "name": "How much is it?",         "url": "#" },
      { "name": "Have you got ...?",         "url": "#" }
    ],
    "Pharmacy": [
      { "name": "I need...",        "url": "#" },
      { "name": "Have you got something for ...",         "url": "#" }
    ],
    "Doctor": [
      { "name": "My symptoms",           "url": "#" },
      { "name": "My medications",         "url": "#" }
    ],
    "Food & Beverage": [
      { "name": "Beverages",    "url": "#" },
      { "name": "Asking for ...",         "url": "#" }
    ],
    "Courses & Teachers": [
      { "name": "Italian Tutor xxx",      "url": "https://example.com" },
      { "name": "Italian Evening Classes",            "url": "https://" }
    ]
  },

  "SOS": {
    "Emergency Numbers": [
      { "name": "112 - Universal emergency number", "url": "tel:xxx" },
      { "name": "118 - Medical Emergency",  "url": "tel:xxx" },
      { "name": "115 - Fire Brigade",     "url": "tel:xxx" }
    ],
    "Local Help": [
      { "name": "Medical Help - Guardia Medica 116117",          "url": "tel:xxx" },
      { "name": "Pharmacy on Duty 24h",       "url": "https://example.com" }
    ],
    "Trades": [
      { "name": "Emergency Plumber",     "url": "tel:xxx" },
      { "name": "Locksmith",      "url": "tel:xxx" }
    ]
  }
};

// ===== LOGIC =====
function el(html){
  const t=document.createElement('template');
  t.innerHTML=html.trim();
  return t.content.firstChild;
}

function renderSection(key){
  const mount=document.querySelector('#mount');
  mount.innerHTML='';
  const data=sections[key];
  for(const cat in data){
    mount.appendChild(el(`<div class="category"><h3>${cat}</h3></div>`));
    data[cat].forEach(item=>{
      mount.appendChild(el(`<div class="card"><a href="${item.url}" rel="noopener">${item.name}</a></div>`));
    });
  }
  localStorage.setItem('section', key);
}

function activate(btn){
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderSection(btn.dataset.section);
}

// Optional safety: unregister any old SWs at same scope
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations?.().then(regs => regs.forEach(r => r.unregister()));
}

function hideSplash(){ document.querySelector('.splash')?.classList.add('hidden'); }

window.addEventListener('DOMContentLoaded', ()=>{
  const nav = document.querySelector('.nav');

  Object.keys(sections).forEach(k => {
    const b = el(`<button data-section="${k}" aria-controls="mount">${k}</button>`);
    b.addEventListener('click', () => activate(b));
    nav.appendChild(b);
  });

  // NEW: restore last-opened tab
  const saved = localStorage.getItem('section');
  const buttons = [...document.querySelectorAll('.nav button')];
  const toActivate = buttons.find(b => b.dataset.section === saved) || buttons[0];
  if (toActivate) activate(toActivate);

  setTimeout(hideSplash, 1200);
  
  // Install prompt intentionally disabled in DEMO build
  if(!DEMO){
    let deferredPrompt;
    const install=document.querySelector('#install');
    window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; install.hidden=false; });
    install?.addEventListener('click', async()=>{ install.hidden=true; if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt=null; } });
  }
});



// Service worker intentionally disabled in DEMO build
if(!DEMO && 'serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js'));
}
