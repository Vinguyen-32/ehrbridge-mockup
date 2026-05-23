import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#F0F4F9", white:"#FFFFFF",
  border:"#DDE6F0", borderMid:"#C8D6E8",
  accent:"#0072C6", accentLight:"#EBF4FF", accentMid:"#BFDBFE",
  success:"#10B981", successLight:"#ECFDF5",
  warning:"#F59E0B", warningLight:"#FFFBEB",
  danger:"#DC2626", dangerLight:"#FFF5F5",
  purple:"#7C3AED", purpleLight:"#F5F3FF",
  text:"#0F1C2E", textMid:"#374151", textMuted:"#6B7280", textLight:"#9CA3AF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 2px; }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes fade-up { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
  @keyframes drop-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .animate-in { animation: fade-up 0.22s ease both; }
  .drop-in { animation: drop-in 0.18s ease both; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
  input { font-family: 'DM Sans', sans-serif; }
`;

const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard", icon:"⬡" },
  { id:"connections", label:"Connections", icon:"⇌" },
  { id:"synclog", label:"Sync Log", icon:"≡" },
  { id:"fieldmap", label:"Field Mapping", icon:"⊞" },
  { id:"ai", label:"AI Assistant", icon:"◈" },
  { id:"settings", label:"Settings", icon:"⚙" },
];

// ── Shared primitives ────────────────────────────────────────────────────────

const Tag = ({ children, color = C.accent, bg }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:4,
    background: bg || `${color}18`, border:`1px solid ${color}30`,
    color, fontSize:10, fontWeight:600, fontFamily:"'DM Mono',monospace", letterSpacing:"0.02em",
  }}>{children}</span>
);

const Dot = ({ status }) => {
  const map = { active:C.success, error:C.danger, paused:C.warning, idle:C.textLight };
  const c = map[status] || C.textLight;
  return <span style={{ width:7, height:7, borderRadius:"50%", background:c, display:"inline-block", boxShadow:`0 0 4px ${c}80`, flexShrink:0 }} />;
};

const Card = ({ children, style }) => (
  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:18, boxShadow:"0 1px 3px rgba(0,0,0,0.04)", ...style }}>{children}</div>
);

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom:18 }}>
    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:C.text, marginBottom:3 }}>{title}</div>
    {sub && <div style={{ color:C.textMuted, fontSize:12 }}>{sub}</div>}
  </div>
);

// ── DASHBOARD ────────────────────────────────────────────────────────────────

const ACTIVITY = [
  { time:"10:42 AM", action:"Patient sync", detail:"Jane Cooper → Office Ally", status:"success", records:1 },
  { time:"10:30 AM", action:"Appointment sync", detail:"Batch: 14 records", status:"success", records:14 },
  { time:"10:15 AM", action:"Patient sync", detail:"Robert Fox → Practice Fusion", status:"error", records:0 },
  { time:"10:00 AM", action:"Scheduled poll", detail:"Practice Fusion → Office Ally", status:"success", records:8 },
  { time:"09:45 AM", action:"Patient sync", detail:"Eleanor Pena → Office Ally", status:"success", records:1 },
];

const DashboardScreen = () => (
  <div className="animate-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <SectionTitle title="Overview" sub="Last updated 2 minutes ago" />
      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
        <Dot status="active" />
        <span style={{ color:C.success, fontSize:12, fontWeight:500 }}>All systems operational</span>
      </div>
    </div>
    <div style={{ display:"flex", gap:10 }}>
      {[
        { label:"Total syncs today", value:"247", sub:"↑ 12% vs last week", subColor:C.success },
        { label:"Active connections", value:"2", sub:"Practice Fusion + Office Ally", subColor:C.textMuted, valColor:C.accent },
        { label:"Success rate", value:"98.4%", sub:"↑ 0.2% vs last week", subColor:C.success, valColor:C.success },
        { label:"Avg sync time", value:"1.3s", sub:"per resource", subColor:C.textMuted },
      ].map((m,i) => (
        <Card key={i} style={{ flex:1 }}>
          <div style={{ color:C.textMuted, fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{m.label}</div>
          <div style={{ fontSize:24, fontWeight:700, fontFamily:"'Syne',sans-serif", color:m.valColor||C.text, lineHeight:1 }}>{m.value}</div>
          <div style={{ color:m.subColor, fontSize:11, marginTop:5 }}>{m.sub}</div>
        </Card>
      ))}
    </div>
    <div style={{ display:"flex", gap:14 }}>
      <Card style={{ flex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:C.text }}>Sync activity</span>
          <Tag color={C.success} bg={C.successLight}>Live</Tag>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {ACTIVITY.map((a,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 11px", borderRadius:8, background:C.bg, borderLeft:`3px solid ${a.status==="success"?C.success:C.danger}` }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.textMuted, minWidth:60 }}>{a.time}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{a.action}</div>
                <div style={{ fontSize:10, color:C.textMuted }}>{a.detail}</div>
              </div>
              {a.records > 0 && <Tag color={C.success} bg={C.successLight}>{a.records} record{a.records>1?"s":""}</Tag>}
              {a.status === "error" && <Tag color={C.danger} bg={C.dangerLight}>Failed</Tag>}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:C.text, marginBottom:12 }}>Connection health</div>
          {["Practice Fusion","Office Ally"].map((n,i) => (
            <div key={i} style={{ marginBottom:i===0?12:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}><Dot status="active" /><span style={{ fontSize:12, color:C.text }}>{n}</span></div>
                <span style={{ fontSize:10, color:C.textMuted }}>2 min ago</span>
              </div>
              <div style={{ height:4, background:C.border, borderRadius:2 }}>
                <div style={{ width:`${i===0?100:98}%`, height:"100%", background:C.success, borderRadius:2 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:C.text, marginBottom:12 }}>Next scheduled syncs</div>
          {[{l:"Patient poll",t:"in 13 min",c:C.accent},{l:"Appointment poll",t:"in 28 min",c:C.purple},{l:"Bulk export",t:"Tonight 2:00 AM",c:C.textLight}].map((s,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:i<2?9:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:s.c, display:"inline-block", flexShrink:0 }} />
                <span style={{ fontSize:12, color:C.text }}>{s.l}</span>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:C.textMuted }}>{s.t}</span>
            </div>
          ))}
        </Card>
        <div style={{ background:C.accentLight, border:`1px solid ${C.accentMid}`, borderRadius:12, padding:14 }}>
          <div style={{ fontSize:10, color:C.accent, fontWeight:600, marginBottom:5, letterSpacing:"0.04em" }}>AI INSIGHT</div>
          <div style={{ fontSize:12, color:C.textMid, lineHeight:1.55 }}>1 sync failure at 10:15 AM — rate limit from Practice Fusion. Auto-retried successfully at 10:17 AM.</div>
        </div>
      </div>
    </div>
  </div>
);

// ── CONNECTIONS ──────────────────────────────────────────────────────────────

const ConnectionsScreen = () => {
  const [pfSyncing, setPfSyncing] = useState(false);
  const [oaSyncing, setOaSyncing] = useState(false);
  const [bothSyncing, setBothSyncing] = useState(false);
  const [pfPct, setPfPct] = useState(0);
  const [oaPct, setOaPct] = useState(0);
  const [bothPct, setBothPct] = useState(0);
  const [pfResult, setPfResult] = useState(null);
  const [oaResult, setOaResult] = useState(null);
  const [bothResult, setBothResult] = useState(null);
  const [pfLastSync, setPfLastSync] = useState("2 min ago");
  const [oaLastSync, setOaLastSync] = useState("2 min ago");

  const runSync = (which) => {
    const setSyncing = which==="pf"?setPfSyncing:which==="oa"?setOaSyncing:setBothSyncing;
    const setPct = which==="pf"?setPfPct:which==="oa"?setOaPct:setBothPct;
    const setResult = which==="pf"?setPfResult:which==="oa"?setOaResult:setBothResult;
    setSyncing(true); setPct(0); setResult(null);
    let p=0;
    const iv=setInterval(()=>{
      p+=Math.random()*18+4;
      if(p>=100){
        p=100; clearInterval(iv);
        const records=Math.floor(Math.random()*20)+5;
        setSyncing(false); setResult(which==="both"?records*2:records);
        if(which!=="oa") setPfLastSync("just now");
        if(which!=="pf") setOaLastSync("just now");
      }
      setPct(Math.min(p,100));
    },120);
  };

  const SyncBtn = ({which,label,syncing,pct}) => (
    <button onClick={()=>runSync(which)} disabled={syncing} style={{
      display:"flex",alignItems:"center",gap:7,
      padding:"9px 16px",borderRadius:8,border:"none",
      background:syncing?"#E0E7FF":which==="both"?C.accent:C.accentLight,
      color:syncing?"#6B7280":which==="both"?"#fff":C.accent,
      fontSize:12,fontWeight:600,cursor:syncing?"not-allowed":"pointer",
      boxShadow:which==="both"&&!syncing?"0 2px 6px rgba(0,114,198,0.3)":"none",
    }}>
      <span style={{display:"inline-block",animation:syncing?"spin 1s linear infinite":"none",fontSize:14}}>↻</span>
      {syncing?"Syncing...":label}
    </button>
  );

  const ProgressBar = ({pct,syncing,result}) => {
    if(!syncing&&!result) return null;
    return <div style={{marginTop:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:10,color:C.textMuted}}>{syncing?"Sync in progress...":"Sync complete"}</span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:syncing?C.accent:C.success}}>{Math.round(pct)}%</span>
      </div>
      <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:syncing?C.accent:C.success,borderRadius:3,transition:"width 0.1s linear"}}/>
      </div>
      {result && <div style={{marginTop:8,padding:"7px 10px",borderRadius:6,background:C.successLight,border:`1px solid ${C.success}30`,fontSize:11,color:C.success,fontWeight:500}}>✓ {result} records synced · just now</div>}
    </div>;
  };

  return (
  <div className="animate-in" style={{ display:"flex", flexDirection:"column", gap:14 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <SectionTitle title="Connections" sub="Manage your EHR integrations and trigger manual syncs" />
      <button style={{ background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:600, boxShadow:"0 2px 6px rgba(0,114,198,0.3)" }}>+ Add connection</button>
    </div>

    {/* Manual Sync Hero Card */}
    <div style={{background:`linear-gradient(135deg,${C.accentLight},#F0EBFF)`,border:`2px solid ${C.accentMid}`,borderRadius:14,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:C.text,marginBottom:4}}>Manual Sync</div>
          <div style={{fontSize:12,color:C.textMuted,lineHeight:1.55,maxWidth:420}}>
            Trigger an immediate sync between your connected EHRs — useful after a batch of updates, during onboarding, or any time you want to confirm both systems are in sync right now.
          </div>
          <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
            <Tag color={C.accent} bg={C.accentLight}>Auto: every 30 min</Tag>
            <Tag color={C.purple} bg={C.purpleLight}>Manual: anytime</Tag>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
          <SyncBtn which="both" label="Sync All Now" syncing={bothSyncing} pct={bothPct}/>
          <div style={{display:"flex",gap:8}}>
            <SyncBtn which="pf" label="Sync PF → OA" syncing={pfSyncing} pct={pfPct}/>
            <SyncBtn which="oa" label="Sync OA → PF" syncing={oaSyncing} pct={oaPct}/>
          </div>
        </div>
      </div>
      <ProgressBar pct={bothPct} syncing={bothSyncing} result={bothResult}/>
    </div>
    <Card>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Active connection pair</div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
        <div style={{ flex:1, padding:16, borderRadius:10, background:C.accentLight, border:`1px solid ${C.accentMid}` }}>
          <div style={{ fontSize:9, color:C.accent, marginBottom:5, fontWeight:600, letterSpacing:"0.06em" }}>SOURCE / TARGET</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:C.accent }}>Practice Fusion</div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>Veradigm · FHIR R4</div>
          <div style={{ display:"flex", gap:5, marginTop:10 }}>
            <Tag color={C.success} bg={C.successLight}>Connected</Tag>
            <Tag color={C.textMuted} bg={C.bg}>OAuth active</Tag>
          </div>
        </div>
        <div style={{ flex:"0 0 90px", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:20, color:C.accent }}>⇌</span>
          <Tag color={C.success} bg={C.successLight}>Bidirectional</Tag>
          <div style={{ fontSize:9, color:C.textMuted, textAlign:"center" }}>FHIR R4 · OAuth 2.0</div>
        </div>
        <div style={{ flex:1, padding:16, borderRadius:10, background:C.purpleLight, border:"1px solid #DDD6FE" }}>
          <div style={{ fontSize:9, color:C.purple, marginBottom:5, fontWeight:600, letterSpacing:"0.06em" }}>SOURCE / TARGET</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:C.purple }}>Office Ally EHR 24/7</div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>FHIR R4</div>
          <div style={{ display:"flex", gap:5, marginTop:10 }}>
            <Tag color={C.success} bg={C.successLight}>Connected</Tag>
            <Tag color={C.textMuted} bg={C.bg}>OAuth active</Tag>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        {[
          { label:"RESOURCES SYNCED", content: <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{["Patient","Appointment","Practitioner"].map(r=><Tag key={r} color={C.accent} bg={C.accentLight}>{r}</Tag>)}</div> },
          { label:"SYNC SCHEDULE", content: <div style={{ display:"flex", gap:5 }}><Tag color={C.purple} bg={C.purpleLight}>Every 30 min</Tag><Tag color={C.textMuted} bg={C.bg}>Bulk nightly 2AM</Tag></div> },
          { label:"COMPLIANCE", content: <div style={{ display:"flex", gap:5 }}><Tag color={C.success} bg={C.successLight}>BAA signed</Tag><Tag color={C.success} bg={C.successLight}>HIPAA</Tag></div> },
        ].map((s,i) => (
          <div key={i} style={{ flex:1, padding:11, borderRadius:8, background:C.bg }}>
            <div style={{ fontSize:9, color:C.textMuted, marginBottom:5, fontWeight:600 }}>{s.label}</div>
            {s.content}
          </div>
        ))}
      </div>
    </Card>
    <div>
      <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, fontWeight:500 }}>More EHR connectors — coming soon</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {["DrChrono","Kareo / Tebra","athenahealth","eClinicalWorks","NextGen"].map(e => (
          <div key={e} style={{ padding:"8px 14px", borderRadius:8, background:C.white, border:`1px solid ${C.border}`, fontSize:12, color:C.textMuted }}>{e}</div>
        ))}
      </div>
    </div>
  </div>
  );
};

const LOGS = [
  { id:"job_8822", time:"10:42:03", type:"Patient",    dir:"PF → OA",        status:"success", records:1,  ms:312,  manual:false },
  { id:"job_8821", time:"10:35:00", type:"Manual Sync",dir:"Both directions", status:"success", records:22, ms:2140, manual:true  },
  { id:"job_8820", time:"10:30:00", type:"Appointment", dir:"PF → OA",        status:"success", records:14, ms:891,  manual:false },
  { id:"job_8819", time:"10:15:01", type:"Patient",    dir:"OA → PF",        status:"error",   records:0,  ms:5002, manual:false, err:"429 Rate limit — auto-retried" },
  { id:"job_8818", time:"10:00:00", type:"Patient",    dir:"PF → OA",        status:"success", records:8,  ms:670,  manual:false },
  { id:"job_8817", time:"09:30:00", type:"Manual Sync",dir:"Both directions", status:"success", records:18, ms:1980, manual:true  },
  { id:"job_8816", time:"09:00:00", type:"Appointment", dir:"PF → OA",        status:"success", records:6,  ms:512,  manual:false },
];

const SyncLogScreen = () => {
  const [filter, setFilter] = useState("all");
  const filtered = LOGS.filter(e => {
    if (filter === "all") return true;
    if (filter === "manual") return e.manual;
    return e.status === filter;
  });
  const Btn = ({ f, l }) => (
    <button onClick={() => setFilter(f)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:500, border:`1px solid ${filter===f?C.accent:C.border}`, background:filter===f?C.accent:C.white, color:filter===f?"#fff":C.textMuted }}>{l}</button>
  );
  return (
    <div className="animate-in" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <SectionTitle title="Sync Log" sub="Full audit trail — automated and manual sync jobs" />
        <div style={{ display:"flex", gap:6 }}>
          <Btn f="all" l="All" />
          <Btn f="success" l="Success" />
          <Btn f="error" l="Errors" />
          <Btn f="manual" l="Manual" />
        </div>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"105px 75px 110px 1fr 90px 65px", background:C.bg }}>
          {["Job ID","Time","Type","Direction / Note","Status","Duration"].map(h => (
            <div key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
          ))}
        </div>
        {filtered.map((e,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"105px 75px 110px 1fr 90px 65px", borderBottom:`1px solid ${C.border}`, background:i%2===0?C.white:C.bg }}>
            <div style={{ padding:"10px", fontFamily:"'DM Mono',monospace", fontSize:10, color:C.accent }}>{e.id}</div>
            <div style={{ padding:"10px", fontFamily:"'DM Mono',monospace", fontSize:10, color:C.textMuted }}>{e.time}</div>
            <div style={{ padding:"10px" }}>
              {e.manual
                ? <Tag color={C.purple} bg={C.purpleLight}>Manual</Tag>
                : <Tag color={C.accent} bg={C.accentLight}>{e.type}</Tag>}
            </div>
            <div style={{ padding:"10px", fontSize:11, color:C.text }}>
              {e.dir}
              {e.err && <div style={{ color:C.warning, fontSize:10, marginTop:2 }}>⚠ {e.err}</div>}
            </div>
            <div style={{ padding:"10px" }}>
              <Tag color={e.status==="success"?C.success:C.danger} bg={e.status==="success"?C.successLight:C.dangerLight}>
                {e.status==="success"?"Success":"Failed"}
              </Tag>
            </div>
            <div style={{ padding:"10px", fontFamily:"'DM Mono',monospace", fontSize:10, color:C.textMuted }}>{e.ms}ms</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ── FIELD MAPPING ────────────────────────────────────────────────────────────

const PF_FIELDS = ["First Name","Last Name","Date of Birth","Gender","Phone Number","Email Address","Street Address","City","State","ZIP Code","Social Security Number","Insurance ID","Primary Care Provider","Emergency Contact Name","Emergency Contact Phone"];
const OA_FIELDS = ["First Name","Last Name","Birth Date","Sex","Mobile Phone","Home Phone","Email","Address Line 1","City","State","Postal Code","SSN","Insurance Member ID","Referring Provider","Emergency Contact","Emergency Phone"];

const INIT_MAPPINGS = [
  { pfField:"First Name",    oaField:"First Name",         enabled:true },
  { pfField:"Last Name",     oaField:"Last Name",          enabled:true },
  { pfField:"Date of Birth", oaField:"Birth Date",         enabled:true },
  { pfField:"Gender",        oaField:"Sex",                enabled:true, note:"M→Male, F→Female" },
  { pfField:"Phone Number",  oaField:"Mobile Phone",       enabled:true },
  { pfField:"Email Address", oaField:"Email",              enabled:true },
  { pfField:"Street Address",oaField:"Address Line 1",     enabled:true },
  { pfField:"City",          oaField:"City",               enabled:true },
  { pfField:"State",         oaField:"State",              enabled:true },
  { pfField:"ZIP Code",      oaField:"Postal Code",        enabled:true },
  { pfField:"Social Security Number", oaField:"SSN",       enabled:false },
  { pfField:"Insurance ID",  oaField:"Insurance Member ID",enabled:true },
];

const FieldDropdown = ({ value, options, onSelect, color, label, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const filtered = options.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);
  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontSize:10, color, fontWeight:600, marginBottom:5, letterSpacing:"0.04em" }}>{label}</div>
      <div onClick={() => setOpen(o=>!o)} style={{ padding:"9px 12px", border:`1px solid ${open?color:C.border}`, borderRadius:8, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", background:C.white, color:value?C.text:C.textMuted, fontSize:12 }}>
        <span>{value || placeholder}</span>
        <span style={{ color:C.textMuted, fontSize:10 }}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div className="drop-in" style={{ position:"absolute", top:"100%", left:0, right:0, background:C.white, border:`1px solid ${color}`, borderRadius:8, marginTop:4, zIndex:100, boxShadow:"0 4px 16px rgba(0,0,0,0.12)", maxHeight:200, overflowY:"auto" }}>
          <div style={{ padding:8, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.white }}>
            <input ref={inputRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search fields..." style={{ width:"100%", padding:"6px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:12, color:C.text, outline:"none", background:C.bg }} />
          </div>
          {filtered.map(f => (
            <div key={f} onClick={()=>{ onSelect(f); setOpen(false); setSearch(""); }} style={{ padding:"9px 12px", cursor:"pointer", fontSize:12, color:f===value?color:C.text, background:f===value?(color==="var(--purple)"?C.purpleLight:C.accentLight):C.white, fontWeight:f===value?600:400 }}
              onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background=f===value?(color===C.purple?C.purpleLight:C.accentLight):C.white}>
              {f}
            </div>
          ))}
          {filtered.length===0 && <div style={{ padding:"10px 12px", fontSize:12, color:C.textMuted }}>No fields match</div>}
        </div>
      )}
    </div>
  );
};

const FieldMappingScreen = () => {
  const [resource, setResource] = useState("Patient");
  const [mappings, setMappings] = useState(INIT_MAPPINGS);
  const [addingNew, setAddingNew] = useState(false);
  const [newPF, setNewPF] = useState("");
  const [newOA, setNewOA] = useState("");
  const enabledCount = mappings.filter(m=>m.enabled).length;

  const toggle = i => setMappings(ms => ms.map((m,j) => j===i ? {...m, enabled:!m.enabled} : m));
  const saveNew = () => {
    if (!newPF || !newOA) return;
    setMappings(ms => [...ms, { pfField:newPF, oaField:newOA, enabled:true }]);
    setAddingNew(false); setNewPF(""); setNewOA("");
  };

  return (
    <div className="animate-in" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <SectionTitle title="Field Mapping" sub="Control which fields sync between Practice Fusion and Office Ally" />
        <div style={{ display:"flex", gap:6 }}>
          {["Patient","Appointment","Practitioner"].map(r => (
            <button key={r} onClick={()=>setResource(r)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:500, border:`1px solid ${resource===r?C.accent:C.border}`, background:resource===r?C.accentLight:C.white, color:resource===r?C.accent:C.textMuted }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 48px 1fr 80px", marginBottom:6, padding:"0 2px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:C.accentLight, border:`1px solid ${C.accentMid}`, borderRadius:"8px 0 0 8px" }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:C.accent, flexShrink:0 }} />
          <div>
            <div style={{ fontWeight:600, fontSize:12, color:C.accent }}>Practice Fusion</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Source field</div>
          </div>
        </div>
        <div style={{ background:C.bg, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:C.textMuted }}>→</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:C.purpleLight, border:"1px solid #DDD6FE", borderRadius:"0 8px 8px 0" }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:C.purple, flexShrink:0 }} />
          <div>
            <div style={{ fontWeight:600, fontSize:12, color:C.purple }}>Office Ally</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Maps to field</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:10, color:C.textMuted, fontWeight:500 }}>{enabledCount}/{mappings.length} active</span>
        </div>
      </div>

      {/* Mapping rows */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", marginBottom:12 }}>
        {mappings.map((m,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 48px 1fr 80px", borderBottom:i===mappings.length-1?"none":`1px solid ${C.border}`, background:m.enabled?C.white:"#FAFBFC", opacity:m.enabled?1:0.6 }}>
            <div style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:m.enabled?C.accent:C.borderMid, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{m.pfField}</div>
                {m.note && <div style={{ fontSize:10, color:C.warning, marginTop:1 }}>⚡ {m.note}</div>}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", color:m.enabled?C.accent:C.borderMid, fontSize:14 }}>→</div>
            <div style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:m.enabled?C.purple:C.borderMid, flexShrink:0 }} />
              <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{m.oaField}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div onClick={()=>toggle(i)} title={m.enabled?"Disable":"Enable"} style={{ width:32, height:18, borderRadius:9, background:m.enabled?C.accent:C.borderMid, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:2, left:m.enabled?16:2, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new mapping */}
      {addingNew ? (
        <div className="drop-in" style={{ background:C.white, border:`2px solid ${C.accent}`, borderRadius:10, padding:16, marginBottom:12 }}>
          <div style={{ fontWeight:600, fontSize:13, color:C.text, marginBottom:14 }}>Add new field mapping</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:0, alignItems:"start" }}>
            <FieldDropdown value={newPF} options={PF_FIELDS} onSelect={setNewPF} color={C.accent} label="PRACTICE FUSION FIELD" placeholder="Select a field..." />
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:10, paddingTop:22, fontSize:18, color:C.textLight }}>→</div>
            <FieldDropdown value={newOA} options={OA_FIELDS} onSelect={setNewOA} color={C.purple} label="OFFICE ALLY FIELD" placeholder="Select a field..." />
          </div>
          <div style={{ display:"flex", gap:8, marginTop:14, justifyContent:"flex-end" }}>
            <button onClick={()=>{setAddingNew(false);setNewPF("");setNewOA("");}} style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${C.border}`, background:C.white, color:C.textMuted, fontSize:12 }}>Cancel</button>
            <button onClick={saveNew} style={{ padding:"7px 16px", borderRadius:8, background:newPF&&newOA?C.accent:"#94A3B8", border:"none", color:"#fff", fontWeight:600, fontSize:12, cursor:newPF&&newOA?"pointer":"default" }}>Save mapping</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setAddingNew(true)} style={{ width:"100%", padding:10, borderRadius:10, border:`2px dashed ${C.border}`, background:"transparent", color:C.textMuted, fontSize:12, fontWeight:500, display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:12 }}>
          <span style={{ fontSize:16, color:C.accent }}>+</span> Add new field mapping
        </button>
      )}

      <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
        <button style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${C.border}`, background:C.white, color:C.textMuted, fontSize:12 }}>Reset to defaults</button>
        <button style={{ padding:"7px 18px", borderRadius:8, background:C.accent, border:"none", color:"#fff", fontWeight:600, fontSize:12, boxShadow:"0 2px 6px rgba(0,114,198,0.3)" }}>Save all changes</button>
      </div>
    </div>
  );
};

// ── AI ASSISTANT ─────────────────────────────────────────────────────────────

const INIT_MESSAGES = [
  { role:"assistant", text:"Hi! I can help you understand sync activity, explain errors, or look up a patient's current data live from your connected EHRs — nothing is stored. What would you like to know?" },
  { role:"user", text:"Why did the sync fail at 10:15 AM?" },
  { role:"assistant", text:"Job job_8819 failed at 10:15:01 AM when syncing a Patient record from Office Ally to Practice Fusion.\n\nThe error was a 429 Rate Limit Exceeded — Office Ally's API was called too frequently. EHRBridge automatically retried with backoff and the job succeeded at 10:17:08 AM. No data was lost.\n\nTip: Consider increasing your poll interval to 45 minutes to avoid hitting this limit." },
  { role:"user", text:"Show me patient Jane Cooper from Practice Fusion" },
  { role:"assistant", text:"Here's Jane Cooper's current record, pulled live from Practice Fusion:", patient:{ name:"Jane Cooper", dob:"March 12, 1984", gender:"Female", phone:"(555) 291-4820", address:"3892 Walnut Ave, San Jose, CA 95128", lastVisit:"April 14, 2025" } },
];

const PatientCard = ({ data }) => (
  <div style={{ marginTop:10, padding:14, borderRadius:10, background:C.bg, border:`1px solid ${C.border}` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
      <div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:C.text }}>{data.name}</div>
        <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>DOB: {data.dob} · {data.gender}</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
        <Tag color={C.accent} bg={C.accentLight}>Practice Fusion</Tag>
        <span style={{ fontSize:9, color:C.danger, fontWeight:600, marginTop:2 }}>READ-ONLY · NOT STORED</span>
      </div>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
      {[{l:"PHONE",v:data.phone},{l:"LAST VISIT",v:data.lastVisit},{l:"ADDRESS",v:data.address,span:true}].map((r,i) => (
        <div key={i} style={{ gridColumn:r.span?"1/-1":"auto" }}>
          <div style={{ fontSize:9, color:C.textMuted, marginBottom:2, fontWeight:500 }}>{r.l}</div>
          <div style={{ fontSize:12, color:C.text }}>{r.v}</div>
        </div>
      ))}
    </div>
  </div>
);

const QUICK_PROMPTS = ["What synced in the last hour?","Show today's errors","Look up patient Robert Fox","What's the sync schedule?"];

const AIScreen = () => {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(m => [...m, { role:"user", text:msg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role:"assistant", text:"I checked your sync logs and connections. Today shows 247 completed syncs with a 98.4% success rate. The only issue was the rate limit at 10:15 AM which auto-resolved within 2 minutes. Would you like details on a specific job or patient?" }]);
    }, 1600);
  };

  return (
    <div className="animate-in" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <SectionTitle title="AI Assistant" sub="Ask about sync activity or look up patient data live — nothing is stored" />
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, display:"flex", flexDirection:"column", height:430, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {messages.map((m,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start", marginBottom:12 }}>
              {m.role==="assistant" && <div style={{ fontSize:9, color:C.accent, fontWeight:700, marginBottom:4, letterSpacing:"0.06em" }}>EHR BRIDGE AI</div>}
              <div style={{ maxWidth:"82%", padding:"10px 14px", borderRadius:m.role==="user"?"12px 12px 4px 12px":"4px 12px 12px 12px", background:m.role==="user"?C.accentLight:C.bg, border:`1px solid ${m.role==="user"?C.accentMid:C.border}`, fontSize:12, lineHeight:1.65, color:C.text, whiteSpace:"pre-wrap" }}>
                {m.text}
                {m.patient && <PatientCard data={m.patient} />}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <div style={{ fontSize:9, color:C.accent, fontWeight:700 }}>EHR BRIDGE AI</div>
              <div style={{ display:"flex", gap:3 }}>
                {[0,200,400].map(d => <div key={d} style={{ width:5, height:5, borderRadius:"50%", background:C.accent, animation:`pulse-dot 1s ${d}ms ease infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding:"8px 12px", borderTop:`1px solid ${C.border}`, display:"flex", flexWrap:"wrap", gap:5, background:C.bg }}>
          {QUICK_PROMPTS.map(q => <button key={q} onClick={()=>send(q)} style={{ padding:"4px 10px", borderRadius:20, fontSize:11, background:C.white, border:`1px solid ${C.border}`, color:C.textMuted }}>{q}</button>)}
        </div>
        <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about sync jobs, errors, or look up a patient..." style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:12, outline:"none" }} />
          <button onClick={()=>send()} style={{ padding:"9px 16px", borderRadius:8, background:C.accent, border:"none", color:"#fff", fontWeight:600, fontSize:12, boxShadow:"0 2px 5px rgba(0,114,198,0.3)" }}>Send</button>
        </div>
      </div>
    </div>
  );
};

// ── SETTINGS ──────────────────────────────────────────────────────────────────

const SettingsScreen = () => (
  <div className="animate-in">
    <SectionTitle title="Settings" sub="Manage your organization, team, billing, and compliance documents" />
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {["Organization profile","Team members & roles","Billing & subscription","BAA documents","Notification preferences","API keys & webhooks"].map(s => (
        <Card key={s}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{s}</div>
            <button style={{ padding:"6px 14px", borderRadius:8, fontSize:11, border:`1px solid ${C.border}`, background:C.bg, color:C.textMid, fontWeight:500 }}>Configure →</button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const screens = { dashboard:<DashboardScreen/>, connections:<ConnectionsScreen/>, synclog:<SyncLogScreen/>, fieldmap:<FieldMappingScreen/>, ai:<AIScreen/>, settings:<SettingsScreen/> };
  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", height:"100vh", background:C.bg, overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:210, background:C.white, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, boxShadow:"2px 0 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, letterSpacing:"-0.02em" }}>
              <span style={{ color:C.accent }}>EHR</span><span style={{ color:C.text }}>Bridge</span>
            </div>
            <div style={{ fontSize:9, color:C.textLight, marginTop:2, letterSpacing:"0.08em", fontWeight:500 }}>INTEGRATION PLATFORM</div>
          </div>
          <div style={{ padding:"10px 12px", margin:"10px 10px 4px", borderRadius:8, background:C.bg, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:9, color:C.textMuted, marginBottom:3, fontWeight:600, letterSpacing:"0.06em" }}>PRACTICE</div>
            <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Wynn Medical Center</div>
            <div style={{ display:"flex", gap:5, marginTop:4, alignItems:"center" }}>
              <Dot status="active" />
              <span style={{ fontSize:10, color:C.success, fontWeight:500 }}>2 connections active</span>
            </div>
          </div>
          <nav style={{ flex:1, padding:"6px 8px" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={()=>setScreen(item.id)} style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 11px", borderRadius:8, border:"none", background:screen===item.id?C.accentLight:"transparent", color:screen===item.id?C.accent:C.textMuted, fontSize:12, fontWeight:screen===item.id?600:400, marginBottom:2, textAlign:"left", transition:"all 0.15s" }}>
                <span style={{ fontSize:15, width:18, textAlign:"center" }}>{item.icon}</span>
                {item.label}
                {item.id==="ai" && <span style={{ marginLeft:"auto", fontSize:8, padding:"2px 5px", borderRadius:4, background:C.purpleLight, color:C.purple, fontWeight:700 }}>AI</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"0 12px 14px" }}>
            <div style={{ padding:10, borderRadius:8, background:"#FFF5F5", border:"1px solid #FECDD3" }}>
              <div style={{ fontSize:9, color:C.danger, fontWeight:600, marginBottom:2 }}>HIPAA COMPLIANT</div>
              <div style={{ fontSize:10, color:C.textMuted }}>Data in transit only · BAA active</div>
            </div>
          </div>
        </div>
        {/* Main */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          {screens[screen]}
        </div>
      </div>
    </>
  );
}
