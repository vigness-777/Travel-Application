// Traveloop DB v4 — localStorage mock ORM
const DB = {
  _get: k => JSON.parse(localStorage.getItem(k) || 'null') || [],
  _set: (k,d) => localStorage.setItem(k, JSON.stringify(d)),
  _uid: () => Math.random().toString(36).slice(2,11),
  _now: () => new Date().toISOString(),

  // Generic CRUD
  findAll: (t) => DB._get(t),
  findById: (t,id) => DB._get(t).find(r => r.id === id) || null,
  insert: (t,data) => { const rows=DB._get(t); const row={id:DB._uid(),createdAt:DB._now(),...data}; rows.push(row); DB._set(t,rows); return row; },
  update: (t,id,data) => { const rows=DB._get(t); const i=rows.findIndex(r=>r.id===id); if(i<0)return null; rows[i]={...rows[i],...data,updatedAt:DB._now()}; DB._set(t,rows); return rows[i]; },
  delete: (t,id) => { const rows=DB._get(t).filter(r=>r.id!==id); DB._set(t,rows); },
  where: (t,fn) => DB._get(t).filter(fn),

  // Seed check
  isSeeded: () => !!localStorage.getItem('traveloop_seeded'),
  markSeeded: () => localStorage.setItem('traveloop_seeded','1'),
};

// ── IMAGE HELPER ──────────────────────────────────────────────
function imgTag(url, alt, cls='') {
  const letter = (alt||'?')[0].toUpperCase();
  const colors = ['#8b5cf6','#6d28d9','#0891b2','#0e7490','#7c3aed','#2563eb'];
  const c = colors[letter.charCodeAt(0) % colors.length];
  return `<div class="city-thumb ${cls}" style="background:linear-gradient(135deg,${c}33,${c}11)">
    <img src="${url}" alt="${alt}" loading="lazy" onerror="this.style.display='none'">
    <div class="thumb-fallback">
      <span class="fallback-letter">${letter}</span>
      <span class="fallback-name">${alt}</span>
    </div>
  </div>`;
}

// ── INDIAN CITIES ─────────────────────────────────────────────
const CITIES = [
  // Tamil Nadu
  {id:'tn1',name:'Chennai',state:'Tamil Nadu',tag:'Metropolitan',cost:2800,pop:95,desc:'Gateway to South India — Marina Beach, temples & culture',img:'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80&auto=format&fit=crop'},
  {id:'tn2',name:'Madurai',state:'Tamil Nadu',tag:'Heritage',cost:1800,pop:82,desc:'City of temples — Meenakshi Amman & ancient Dravidian art',img:'https://images.unsplash.com/photo-1512100356956-c1227c331f01?w=800&q=80&auto=format&fit=crop'},
  {id:'tn3',name:'Ooty',state:'Tamil Nadu',tag:'Hill Station',cost:2200,pop:78,desc:'Queen of Nilgiris — tea gardens, botanical gardens & mist',img:'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?w=800&q=80&auto=format&fit=crop'},
  {id:'tn4',name:'Kodaikanal',state:'Tamil Nadu',tag:'Hill Station',cost:2000,pop:74,desc:'Princess of Hill Stations — lakes, pine forests & falls',img:'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80&auto=format&fit=crop'},
  {id:'tn5',name:'Mahabalipuram',state:'Tamil Nadu',tag:'UNESCO',cost:1600,pop:70,desc:'Shore temples & rock-cut cave sculptures by the sea',img:'https://images.unsplash.com/photo-1581447100412-297597116773?w=800&q=80&auto=format&fit=crop'},
  {id:'tn6',name:'Pondicherry',state:'Tamil Nadu',tag:'Colonial',cost:2100,pop:80,desc:'French Quarter, Auroville & serene beaches',img:'https://images.unsplash.com/photo-1616422119106-5b68233364f9?w=800&q=80&auto=format&fit=crop'},
  {id:'tn7',name:'Rameswaram',state:'Tamil Nadu',tag:'Pilgrimage',cost:1500,pop:65,desc:'Sacred island temple & Pamban Bridge',img:'https://images.unsplash.com/photo-1603770174068-d0694e9f738a?w=800&q=80&auto=format&fit=crop'},
  // Kerala
  {id:'kl1',name:'Munnar',state:'Kerala',tag:'Hill Station',cost:2400,pop:88,desc:'Rolling tea estates & misty mountain peaks',img:'https://images.unsplash.com/photo-1580289143186-03f54224aad6?w=800&q=80&auto=format&fit=crop'},
  {id:'kl2',name:'Alleppey',state:'Kerala',tag:'Backwaters',cost:2600,pop:90,desc:'Venice of the East — houseboat cruises & serene backwaters',img:'https://images.unsplash.com/photo-1590073242678-70ee3fc28f17?w=800&q=80&auto=format&fit=crop'},
  {id:'kl3',name:'Kochi',state:'Kerala',tag:'Cultural',cost:2900,pop:85,desc:'Fort Kochi, spice markets & Chinese fishing nets',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop'},
  {id:'kl4',name:'Thekkady',state:'Kerala',tag:'Wildlife',cost:2200,pop:72,desc:'Periyar Tiger Reserve & spice plantation tours',img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80&auto=format&fit=crop'},
  // Rajasthan
  {id:'rj1',name:'Jaipur',state:'Rajasthan',tag:'Pink City',cost:2700,pop:92,desc:'Amber Fort, Hawa Mahal & vibrant bazaars',img:'https://images.unsplash.com/photo-1477587458883-47145ed6979c?w=800&q=80&auto=format&fit=crop'},
  {id:'rj2',name:'Jodhpur',state:'Rajasthan',tag:'Blue City',cost:2300,pop:83,desc:'Mehrangarh Fort & the azure blue cityscape',img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80&auto=format&fit=crop'},
  {id:'rj3',name:'Udaipur',state:'Rajasthan',tag:'Lake City',cost:3200,pop:91,desc:'City of Lakes — palaces, romance & sunsets',img:'https://images.unsplash.com/photo-1599661046289-e31897e2b6ea?w=800&q=80&auto=format&fit=crop'},
  {id:'rj4',name:'Jaisalmer',state:'Rajasthan',tag:'Desert',cost:2400,pop:79,desc:'Golden Fort & Thar Desert camp under stars',img:'https://images.unsplash.com/photo-1597149304997-6e2ceba90c2c?w=800&q=80&auto=format&fit=crop'},
  // Goa
  {id:'ga1',name:'North Goa',state:'Goa',tag:'Beaches',cost:3500,pop:93,desc:'Baga, Calangute & vibrant beach parties',img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80&auto=format&fit=crop'},
  {id:'ga2',name:'South Goa',state:'Goa',tag:'Peaceful',cost:2800,pop:82,desc:'Palolem & Agonda — tranquil coves & clear water',img:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80&auto=format&fit=crop'},
  // Himachal Pradesh
  {id:'hp1',name:'Manali',state:'Himachal Pradesh',tag:'Adventure',cost:3100,pop:90,desc:'Rohtang Pass, Solang Valley & snow adventures',img:'https://images.unsplash.com/photo-1558618047-f4e0b9a8a2d6?w=800&q=80&auto=format&fit=crop'},
  {id:'hp2',name:'Shimla',state:'Himachal Pradesh',tag:'Colonial',cost:2500,pop:85,desc:'Summer capital, toy train & Mall Road',img:'https://images.unsplash.com/photo-1609619385076-36a873425636?w=800&q=80&auto=format&fit=crop'},
  {id:'hp3',name:'Spiti Valley',state:'Himachal Pradesh',tag:'Remote',cost:2800,pop:68,desc:'High altitude cold desert — monasteries & stargazing',img:'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&q=80&auto=format&fit=crop'},
  // Other
  {id:'up1',name:'Agra',state:'Uttar Pradesh',tag:'UNESCO',cost:2600,pop:94,desc:'The Taj Mahal — wonder of the world',img:'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80&auto=format&fit=crop'},
  {id:'wb1',name:'Darjeeling',state:'West Bengal',tag:'Tea & Mountains',cost:2200,pop:80,desc:'Toy train, tiger hill sunrise & Himalayan tea',img:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80&auto=format&fit=crop'},
  {id:'sk1',name:'Gangtok',state:'Sikkim',tag:'Himalayan',cost:2700,pop:75,desc:'Rumtek monastery, cable cars & Himalayan views',img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80&auto=format&fit=crop'},
  {id:'ap1',name:'Hampi',state:'Karnataka',tag:'UNESCO Ruins',cost:1800,pop:77,desc:'Vijayanagara Empire ruins & boulder landscapes',img:'https://images.unsplash.com/photo-1600001236678-57c3ef1ede00?w=800&q=80&auto=format&fit=crop'},
  {id:'od1',name:'Puri',state:'Odisha',tag:'Pilgrimage',cost:1700,pop:73,desc:'Jagannath Temple & golden Puri beach',img:'https://images.unsplash.com/photo-1567784177701-1f2d8d08fec7?w=800&q=80&auto=format&fit=crop'},
  {id:'as1',name:'Kaziranga',state:'Assam',tag:'Wildlife',cost:2300,pop:70,desc:'One-horned rhinos, elephants & UNESCO forest',img:'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80&auto=format&fit=crop'},
];

// ── ACTIVITIES ────────────────────────────────────────────────
const ACTIVITIES = [
  {id:'a1',name:'Temple Tour',icon:'🛕',category:'Culture',duration:3,cost:300,rating:4.8},
  {id:'a2',name:'Backwater Houseboat',icon:'🚢',category:'Nature',duration:8,cost:4500,rating:4.9},
  {id:'a3',name:'Sunrise Trek',icon:'🥾',category:'Adventure',duration:4,cost:800,rating:4.7},
  {id:'a4',name:'Street Food Walk',icon:'🍛',category:'Food',duration:2,cost:400,rating:4.9},
  {id:'a5',name:'Desert Safari',icon:'🐪',category:'Adventure',duration:5,cost:2500,rating:4.8},
  {id:'a6',name:'Tea Garden Visit',icon:'🍵',category:'Nature',duration:3,cost:600,rating:4.6},
  {id:'a7',name:'Heritage Walk',icon:'🏛️',category:'Culture',duration:3,cost:500,rating:4.7},
  {id:'a8',name:'Beach Sunset',icon:'🌅',category:'Nature',duration:2,cost:0,rating:4.9},
  {id:'a9',name:'Elephant Sanctuary',icon:'🐘',category:'Wildlife',duration:4,cost:1800,rating:4.9},
  {id:'a10',name:'Scuba Diving',icon:'🤿',category:'Adventure',duration:3,cost:3500,rating:4.7},
  {id:'a11',name:'Local Market',icon:'🛍️',category:'Shopping',duration:2,cost:200,rating:4.5},
  {id:'a12',name:'Yoga & Meditation',icon:'🧘',category:'Wellness',duration:2,cost:700,rating:4.8},
  {id:'a13',name:'Boat Ride',icon:'⛵',category:'Nature',duration:2,cost:600,rating:4.6},
  {id:'a14',name:'Cooking Class',icon:'👨‍🍳',category:'Food',duration:4,cost:1200,rating:4.8},
  {id:'a15',name:'Bird Watching',icon:'🦅',category:'Wildlife',duration:3,cost:500,rating:4.5},
  {id:'a16',name:'Rock Climbing',icon:'🧗',category:'Adventure',duration:4,cost:1500,rating:4.6},
  {id:'a17',name:'Photography Tour',icon:'📷',category:'Culture',duration:3,cost:800,rating:4.7},
  {id:'a18',name:'Waterfall Hike',icon:'🌊',category:'Nature',duration:4,cost:400,rating:4.8},
];

// ── SEED DATA ─────────────────────────────────────────────────
function seedData() {
  if(DB.isSeeded()) return;

  // Admin user
  DB.insert('users',{
    name:'Saran', email:'saran@gmail.com', password:'saran1',
    avatar:'S', role:'admin', tripsCount:0, citiesVisited:0, totalKm:0,
    bio:'Traveloop Admin — India\'s smartest trip planner 🇮🇳',
    savedCities:[],
  });

  // New user
  DB.insert('users',{
    name:'Arjun Das', email:'arjundas0022@gmail.com', password:'arjun0022',
    avatar:'AD', tripsCount:0, citiesVisited:0, totalKm:0,
    bio:'Exploring incredible India 🇮🇳',
    savedCities:[],
  });

  // Demo user
  DB.insert('users',{
    name:'Arjun Mehta', email:'arjun.223@gmail.com', password:'demo123',
    avatar:'AM', tripsCount:4, citiesVisited:12, totalKm:8400,
    bio:'Passionate explorer of incredible India 🇮🇳',
    savedCities:['tn1','kl1','rj3','ga1'],
  });

  // Sample trips
  const user = DB.findAll('users')[0]; // Attach to first user (Admin)
  const userId = user ? user.id : 'demo';

  const t1 = DB.insert('trips',{
    userId:userId,name:'Tamil Nadu Heritage Trail',
    startDate:'2025-06-10',endDate:'2025-06-20',budget:18000,
    travelers:2,transport:'Train',status:'upcoming',
    cityIds:['tn2','tn3','tn5'],cover:CITIES.find(c=>c.id==='tn2').img,
    description:'Exploring ancient Dravidian temples and hill stations.',
  });
  DB.insert('stops',{tripId:t1.id,cityId:'tn2',cityName:'Madurai',days:3,order:0,activities:['a1','a4','a7'],hotelCost:2400,transportCost:800,foodCost:900,activityCost:600});
  DB.insert('stops',{tripId:t1.id,cityId:'tn3',cityName:'Ooty',days:3,order:1,activities:['a6','a3','a8'],hotelCost:2700,transportCost:700,foodCost:750,activityCost:500});
  DB.insert('stops',{tripId:t1.id,cityId:'tn5',cityName:'Mahabalipuram',days:2,order:2,activities:['a7','a8'],hotelCost:1800,transportCost:600,foodCost:600,activityCost:300});

  const t2 = DB.insert('trips',{
    userId:userId,name:'Kerala Backwaters & Spice',
    startDate:'2025-08-05',endDate:'2025-08-13',budget:28000,
    travelers:2,transport:'Flight',status:'upcoming',
    cityIds:['kl3','kl2','kl1'],cover:CITIES.find(c=>c.id==='kl2').img,
    description:'Alleppey houseboats, Munnar tea and Kochi heritage.',
  });
  DB.insert('stops',{tripId:t2.id,cityId:'kl3',cityName:'Kochi',days:2,order:0,activities:['a7','a4','a11'],hotelCost:3500,transportCost:1200,foodCost:1100,activityCost:700});
  DB.insert('stops',{tripId:t2.id,cityId:'kl2',cityName:'Alleppey',days:3,order:1,activities:['a2','a13'],hotelCost:5000,transportCost:800,foodCost:1200,activityCost:2500});
  DB.insert('stops',{tripId:t2.id,cityId:'kl1',cityName:'Munnar',days:3,order:2,activities:['a6','a3','a12'],hotelCost:4000,transportCost:900,foodCost:1000,activityCost:800});

  DB.insert('trips',{
    userId:userId,name:'Rajasthan Royal Journey',
    startDate:'2024-12-22',endDate:'2024-12-30',budget:35000,
    travelers:4,transport:'Train',status:'completed',
    cityIds:['rj1','rj3','rj2'],cover:CITIES.find(c=>c.id==='rj3').img,
    description:'Royal palaces, desert sunsets and camel safaris.',
  });
  DB.insert('trips',{
    userId:userId,name:'Goa Beach Escape',
    startDate:'2025-01-10',endDate:'2025-01-15',budget:22000,
    travelers:3,transport:'Flight',status:'completed',
    cityIds:['ga1','ga2'],cover:CITIES.find(c=>c.id==='ga1').img,
    description:'Sun, sand, seafood and sunsets in Goa.',
  });

  // Notes
  DB.insert('notes',{tripId:t1.id,day:1,city:'Madurai',content:'Meenakshi temple visit in the morning. The gopuram is breathtaking! Afternoon auto ride to Thirumalai Nayak Palace.',time:'09:00',type:'experience'});
  DB.insert('notes',{tripId:t1.id,day:2,city:'Madurai',content:'Local Chettinad food is amazing. Try the Kari Dosa at the street stall near the temple.',time:'13:00',type:'food'});
  DB.insert('notes',{tripId:t1.id,day:3,city:'Ooty',content:'Early morning Nilgiri Toy Train. Book tickets at least a day before, very crowded!',time:'07:30',type:'tip'});

  // Checklist
  DB.insert('checklist',{tripId:t1.id,category:'Documents',item:'Aadhaar Card / ID',packed:true});
  DB.insert('checklist',{tripId:t1.id,category:'Documents',item:'Train tickets (printed)',packed:true});
  DB.insert('checklist',{tripId:t1.id,category:'Documents',item:'Hotel booking confirmations',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Clothes',item:'Cotton shirts (×5)',packed:true});
  DB.insert('checklist',{tripId:t1.id,category:'Clothes',item:'Comfortable walking shoes',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Clothes',item:'Light jacket for Ooty',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Electronics',item:'Power bank',packed:true});
  DB.insert('checklist',{tripId:t1.id,category:'Electronics',item:'Camera',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Electronics',item:'Travel adapter',packed:true});
  DB.insert('checklist',{tripId:t1.id,category:'Essentials',item:'Sunscreen SPF 50',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Essentials',item:'Insect repellent',packed:false});
  DB.insert('checklist',{tripId:t1.id,category:'Essentials',item:'Water bottle',packed:true});

  DB.markSeeded();
}

// Auth helpers
const Auth = {
  login:(email,password) => {
    const users = DB.findAll('users');
    return users.find(u=>u.email===email && u.password===password) || null;
  },
  register:(name,email,password) => {
    const existing = DB.findAll('users').find(u=>u.email===email);
    if(existing) return null;
    return DB.insert('users',{name,email,password,avatar:name.slice(0,2).toUpperCase(),tripsCount:0,citiesVisited:0,totalKm:0,bio:'',savedCities:[]});
  },
  currentUser:() => {
    const id = sessionStorage.getItem('tl_user');
    return id ? DB.findById('users',id) : null;
  },
  setUser:(user) => sessionStorage.setItem('tl_user', user.id),
  logout:() => { sessionStorage.removeItem('tl_user'); window.location.href='index.html'; },
  require:() => { if(!Auth.currentUser()){ window.location.href='index.html'; return false; } return true; },
};

// Toast helper
function showToast(msg, type='success', dur=3000){
  let tc = document.getElementById('toast-container');
  if(!tc){ tc=document.createElement('div'); tc.id='toast-container'; tc.className='toast-container'; document.body.appendChild(tc); }
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span><span>${msg}</span>`;
  tc.appendChild(t);
  setTimeout(()=>{ t.style.animation='slideOut 0.3s ease forwards'; setTimeout(()=>t.remove(),300); },dur);
}

// Format helpers
const fmt = {
  currency: n => '₹'+(+n).toLocaleString('en-IN'),
  date: d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),
  days: (s,e) => Math.max(1,Math.round((new Date(e)-new Date(s))/(86400000))),
};

// Sidebar builder
function buildNav(active='') {
  const user = Auth.currentUser();
  const navItems = [
    {icon:'🏠',label:'Dashboard',href:'dashboard.html',key:'dashboard'},
    {icon:'✈️',label:'My Trips',href:'my-trips.html',key:'trips'},
    {icon:'🗺️',label:'Plan New Trip',href:'create-trip.html',key:'create'},
    {icon:'🔍',label:'Explore Cities',href:'city-search.html',key:'cities'},
    {icon:'🎯',label:'Activities',href:'activities.html',key:'activities'},
    {icon:'📊',label:'Budget Tracker',href:'budget.html',key:'budget'},
    {icon:'✅',label:'Packing List',href:'checklist.html',key:'checklist'},
    {icon:'📔',label:'Trip Journal',href:'notes.html',key:'notes'},
    {icon:'🔗',label:'Shared Trips',href:'shared-trip.html',key:'shared'},
    {icon:'📈',label:'Analytics',href:'admin.html',key:'admin'},
  ];
  return `
  <nav class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">✈️</div>
      <div>
        <div class="logo-text">Traveloop</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:1px">India Explorer</div>
      </div>
    </div>
    <div class="nav-section" style="flex:1;overflow-y:auto">
      <div class="nav-label">Navigation</div>
      ${navItems.map(n=>`<a href="${n.href}" class="nav-item ${active===n.key?'active':''}">
        <span class="nav-icon">${n.icon}</span><span>${n.label}</span>
      </a>`).join('')}
    </div>
    <div class="sidebar-footer">
      <a href="profile.html" class="nav-item">
        <div class="avatar" style="width:28px;height:28px;font-size:12px">${user?user.avatar:'?'}</div>
        <div><div style="font-size:13px;font-weight:600">${user?user.name:'Guest'}</div>
        <div style="font-size:11px;color:var(--text-muted)">${user?user.email:''}</div></div>
      </a>
      <button onclick="Auth.logout()" class="btn btn-ghost btn-sm" style="width:100%;margin-top:8px;justify-content:center">Sign Out</button>
    </div>
  </nav>`;
}

// Topbar builder
function buildTopbar(title='') {
  return `
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:16px">
      <button onclick="document.getElementById('sidebar').classList.toggle('open')" style="display:none;background:none;border:none;color:var(--text-primary);font-size:22px;cursor:pointer" id="menu-btn">☰</button>
      <div class="topbar-title">${title}</div>
    </div>
    <div class="topbar-actions">
      <div class="topbar-search">
        <span>🔍</span>
        <input type="text" placeholder="Search cities, trips..." onkeydown="if(event.key==='Enter')window.location.href='city-search.html?q='+this.value">
      </div>
      <a href="create-trip.html" class="btn btn-primary btn-sm">+ New Trip</a>
      <a href="profile.html"><div class="avatar">${Auth.currentUser()?Auth.currentUser().avatar:'?'}</div></a>
    </div>
  </div>`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  seedData();
  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  if(menuBtn) menuBtn.style.display='flex';
});
