Perfect! Here’s the complete updated code. Copy everything below and paste it into your GitHub src/App.jsx file:

import { useState, useMemo } from "react";

const CATEGORIES = [
  { id: "food", label: "Food & Dining", icon: "🍽️", color: "#e07b54" },
  { id: "transport", label: "Transport", icon: "🚌", color: "#2ecc71" },
  { id: "shopping", label: "Shopping", icon: "🛍️", color: "#e05498" },
  { id: "health", label: "Health", icon: "💊", color: "#54c99a" },
  { id: "entertainment", label: "Entertainment", icon: "🎬", color: "#a854e0" },
  { id: "utilities", label: "Utilities", icon: "💡", color: "#e0c354" },
  { id: "other", label: "Other", icon: "📦", color: "#8899aa" },
];

const DEFAULT_BUDGETS = {
  food: 500, transport: 375, shopping: 200, health: 150, entertainment: 350, utilities: 175, other: 250,
};

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const today = () => new Date().toISOString().split("T")[0];

let _id = 1;
const seed = [
  { id: _id++, desc: "Breakfast",  amount: 5,     cat: "food",      location: "McDonald's",           date: "2026-06-01" },
  { id: _id++, desc: "Lunch",      amount: 4.20,  cat: "food",      location: "Foodcourt",             date: "2026-06-01" },
  { id: _id++, desc: "Coke",       amount: 1.10,  cat: "food",      location: "Foodcourt",             date: "2026-06-01" },
  { id: _id++, desc: "Drink",      amount: 1.50,  cat: "food",      location: "7-Eleven",              date: "2026-06-01" },
  { id: _id++, desc: "Drink",      amount: 8.24,  cat: "food",      location: "Cafe",                  date: "2026-06-01" },
  { id: _id++, desc: "Snack",      amount: 3.80,  cat: "food",      location: "Mr Bean",               date: "2026-06-01" },
  { id: _id++, desc: "Dinner",     amount: 22.18, cat: "food",      location: "Seoul Noodle Shop",     date: "2026-06-01" },
  { id: _id++, desc: "Water",      amount: 3.10,  cat: "food",      location: "7-Eleven",              date: "2026-06-01" },
  { id: _id++, desc: "Groceries",  amount: 38.65, cat: "shopping",  location: "Scarlett Supermarket",  date: "2026-06-01" },
  { id: _id++, desc: "Lunch",      amount: 16,    cat: "food",      location: "Ubereats",              date: "2026-06-01" },
  { id: _id++, desc: "Public transport", amount: 8.28, cat: "transport", location: "",               date: "2026-06-01" },
  { id: _id++, desc: "Charge phone", amount: 1.50, cat: "utilities", location: "",                   date: "2026-06-01" },
  { id: _id++, desc: "Fruit",      amount: 2.90,  cat: "food",      location: "7-Eleven",             date: "2026-06-02" },
  { id: _id++, desc: "Lunch",      amount: 11.70, cat: "food",      location: "Foodcourt",            date: "2026-06-02" },
  { id: _id++, desc: "Fruit",      amount: 2.30,  cat: "food",      location: "7-Eleven",             date: "2026-06-02" },
  { id: _id++, desc: "Pancake",    amount: 3.80,  cat: "food",      location: "Mr Bean",              date: "2026-06-02" },
  { id: _id++, desc: "Public transport", amount: 9.41, cat: "transport", location: "", date: "2026-06-02" },
  { id: _id++, desc: "Public transport", amount: 7.69, cat: "transport", location: "", date: "2026-06-02" },
  { id: _id++, desc: "Drink",      amount: 3.50,  cat: "food",      location: "Cafe",                 date: "2026-06-03" },
  { id: _id++, desc: "Lunch",      amount: 9.90,  cat: "food",      location: "Foodcourt",            date: "2026-06-03" },
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState(seed);
  const [form, setForm] = useState({ desc: "", amount: "", cat: "food", location: "", date: today() });
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState("");
  const [view, setView] = useState("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date("2026-06-01"));
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [editingBudget, setEditingBudget] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfilePhoto(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const filtered = useMemo(() => filter === "all" ? expenses : expenses.filter((e) => e.location === filter), [expenses, filter]);
  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.cat] = (map[e.cat] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const byLocation = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { const l = e.location || "Unknown"; map[l] = (map[l] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const locations = useMemo(() => [...new Set(expenses.map((e) => e.location).filter(Boolean))], [expenses]);

  const byDate = useMemo(() => {
    const map = {};
    filtered.forEach((e) => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e); });
    return map;
  }, [filtered]);

  const byCategorySpending = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.cat] = (map[e.cat] || 0) + e.amount; });
    return map;
  }, [expenses]);

  function submit() {
    if (!form.desc.trim()) return setErr("Add a description");
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return setErr("Enter a valid amount");
    setExpenses([{ id: _id++, desc: form.desc.trim(), amount: amt, cat: form.cat, location: form.location.trim(), date: form.date }, ...expenses]);
    setForm({ desc: "", amount: "", cat: "food", location: "", date: today() });
    setAdding(false);
    setErr("");
  }

  function remove(id) { setExpenses(expenses.filter((e) => e.id !== id)); }

  const cat = (id) => CATEGORIES.find((c) => c.id === id);
  const LOC_COLORS = ["#2ecc71","#e07b54","#54c99a","#a854e0","#e0c354","#e05498","#54c9c9","#e08054"];
  const locColor = (loc) => LOC_COLORS[byLocation.findIndex(([l]) => l === loc) % LOC_COLORS.length];

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const calendarDays = [];
  for (let d = new Date(startDate); d <= monthEnd; d.setDate(d.getDate() + 1)) {
    calendarDays.push(new Date(d));
  }
  const fillDays = 42 - calendarDays.length;
  for (let i = 0; i < fillDays; i++) {
    calendarDays.push(new Date(monthEnd));
  }

  const dayExpTotal = (d) => {
    const dateStr = d.toISOString().split("T")[0];
    return byDate[dateStr]?.reduce((s, e) => s + e.amount, 0) || 0;
  };

  const isCurrentMonth = (d) => d.getMonth() === calendarMonth.getMonth();

  const photoStyle = {
    width: 60,
    height: 60,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2ecc71",
    cursor: "pointer",
    filter: `brightness(${brightness}%) contrast(${contrast}%) rotate(${rotation}deg) scale(${zoom / 100})`,
    transition: "filter 0.2s"
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffe5cc 0%, #fff0e6 25%, #ffe5f0 50%, #f0e6ff 75%, #e6f5ff 100%)", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1a1a2e", padding: "24px 16px", position: "relative", overflow: "hidden" }}>
      {/* Cute cats background decoration */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.08, fontSize: "80px", overflow: "hidden", display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-around", padding: "20px" }}>
        {["🐱", "😻", "😸", "😹", "😺", "😻", "😼", "😽", "😾", "😿", "🐱", "😻", "🐈", "🐱", "😸", "🐈‍⬛"].map((cat, i) => (
          <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, fontSize: "60px", opacity: 0.1 }}>
            {cat}
          </div>
        ))}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .row:hover { background: rgba(255,255,255,0.5) !important; }
        .chip:hover { opacity: 0.85; cursor: pointer; }
        .del-btn { opacity: 0; transition: opacity .15s; }
        .row:hover .del-btn { opacity: 1; }
        input, select { background: #ffffff; border: 1px solid #ddd; color: #000; border-radius: 6px; padding: 10px 12px; font-family: inherit; font-size: 14px; outline: none; transition: border-color .2s; width: 100%; }
        input::placeholder { color: #999; }        select { color: #000; }
        input:focus, select:focus { border-color: #27ae60; background: #fff; }
        input[type="range"] { width: 100%; }
        .add-btn { background: #2ecc71; color: #fff; border: none; border-radius: 6px; padding: 10px 20px; font-family: inherit; font-size: 12px; font-weight: 500; cursor: pointer; }
        .add-btn:hover { background: #27ae60; }
        .cancel-btn { background: transparent; color: #666; border: 1px solid #ddd; border-radius: 6px; padding: 10px 20px; font-family: inherit; font-size: 12px; cursor: pointer; }
        .cancel-btn:hover { border-color: #999; color: #333; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              {profilePhoto ? (
                <>
                  <img src={profilePhoto} alt="Profile" style={photoStyle} onClick={() => document.getElementById("photo-input").click()} />
                  <button onClick={() => setShowPhotoEdit(!showPhotoEdit)} style={{ position: "absolute", bottom: -5, right: -5, width: 26, height: 26, borderRadius: "50%", background: "#2ecc71", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Edit photo">⚙️</button>
                </>
              ) : (
                <button onClick={() => document.getElementById("photo-input").click()} style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(46,204,113,0.2)", border: "2px dashed #2ecc71", color: "#2ecc71", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              )}
              <input id="photo-input" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5, background: "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 4 }}>Shi Jie's</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#1a1a2e" }}>Expense Tracker</div>
              <div style={{ color: "#7a7a9a", fontSize: 12, marginTop: 6, letterSpacing: 0.5 }}>{new Date(calendarMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}</div>
            </div>
          </div>

          {/* Photo adjustment panel */}
          {showPhotoEdit && profilePhoto && (
            <div style={{ background: "rgba(255,255,255,0.65)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: 14, marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Adjust Photo</div>
              
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Brightness: {brightness}%</div>
                <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} />
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Contrast: {contrast}%</div>
                <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Rotate: {rotation}°</div>
                <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>Zoom: {zoom}%</div>
                <input type="range" min="80" max="150" value={zoom} onChange={(e) => setZoom(parseInt(e.target.value))} />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setBrightness(100); setContrast(100); setRotation(0); setZoom(100); }} className="cancel-btn"
