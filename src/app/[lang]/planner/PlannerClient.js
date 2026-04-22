"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, ArrowLeft, Check,
  Search, X, Star, ChevronDown, ChevronUp, ChevronRight,
  Users, Calendar, MapPin, DollarSign, Loader2,
  ListChecks, Store, Heart,
  Building, Building2, Flame, Plus, User, Package,
  Cake, Camera, Video, Flower2, Music, Mic, Gem,
  Monitor, Smile, UtensilsCrossed, Briefcase, GraduationCap,
  Baby, AlertTriangle,
} from "lucide-react";

/* ══════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════ */
const C = {
  bg:           "#ffffff",
  surface:      "rgba(255,255,255,0.65)",
  border:       "rgba(0,0,0,0.07)",
  borderStrong: "rgba(0,0,0,0.12)",
  text:         "#111827",
  text2:        "#6b7280",
  text3:        "#9ca3af",
  orange:       "#f97316",
  pink:         "#e11d5c",
  purple:       "#7c3aed",
  green:        "#16a34a",
  grad:         "linear-gradient(135deg,#f97316,#e11d5c,#7c3aed)",
};

/* ══════════════════════════════════════════════
   SERVICE ICONS  (lucide, no emoji)
══════════════════════════════════════════════ */
const SERVICE_ICON_MAP = {
  church:           Building,
  baptism_candle:   Flame,
  cross:            Plus,
  kavor:            User,
  kavork:           User,
  baby_outfit:      Package,
  venue:            Building2,
  catering:         UtensilsCrossed,
  cake:             Cake,
  wedding_cake:     Cake,
  photographer:     Camera,
  videographer:     Video,
  decoration:       Sparkles,
  balloon_decoration: Sparkles,
  flowers:          Flower2,
  music:            Music,
  tamada:           Mic,
  wedding_rings:    Gem,
  ring:             Gem,
  bridal_dress:     Gem,
  ceremony_venue:   Building,
  reception_venue:  Building2,
  av_tech:          Monitor,
  entertainment:    Music,
  animator:         Smile,
};
const getServiceIcon = (type, props={}) => {
  const Icon = SERVICE_ICON_MAP[type] || Star;
  return <Icon {...props}/>;
};

/* ══════════════════════════════════════════════
   EVENT TYPE ICONS
══════════════════════════════════════════════ */
const EVENT_ICON_MAP = {
  christening: Building,
  wedding:     Gem,
  birthday:    Cake,
  kids_party:  Smile,
  corporate:   Briefcase,
  engagement:  Heart,
  anniversary: Star,
  baby_shower: Baby,
  graduation:  GraduationCap,
};
const getEventIcon = (type, props={}) => {
  const Icon = EVENT_ICON_MAP[type] || Star;
  return <Icon {...props}/>;
};

const CATEGORY_LABELS = {
  religious:"Religious", roles:"Key Roles", clothing:"Attire",
  ceremony:"Ceremony", reception:"Reception", celebration:"Celebration",
  food:"Food & Cake", decoration:"Decorations", media:"Photo & Video",
  entertainment:"Entertainment", attire:"Attire", venue:"Venue",
  tech:"Tech & AV", other:"Other",
};

/* ══════════════════════════════════════════════
   EVENT TEMPLATES
══════════════════════════════════════════════ */
const EVENT_TEMPLATES = {
  christening:{
    label:"Christening / Baptism", accent:"#7c3aed", gradient:"linear-gradient(135deg,#7c3aed,#a855f7)",
    services:[
      {service_type:"church",         title:"Church Booking",              category:"religious",   required:true},
      {service_type:"baptism_candle", title:"Baptism Candle (Knonki Mom)", category:"religious",   required:true},
      {service_type:"cross",          title:"Cross Necklace for Baby",     category:"religious",   required:true},
      {service_type:"kavor",          title:"Godfather (Kavor)",           category:"roles",       required:true},
      {service_type:"kavork",         title:"Godmother (Kavork)",          category:"roles",       required:true},
      {service_type:"baby_outfit",    title:"White Baby Outfit",           category:"clothing",    required:true},
      {service_type:"venue",          title:"Celebration Venue",           category:"celebration", required:true,  canSearch:true},
      {service_type:"catering",       title:"Food & Catering",             category:"celebration", required:true,  canSearch:true},
      {service_type:"cake",           title:"Christening Cake",            category:"celebration", required:true,  canSearch:true},
      {service_type:"photographer",   title:"Photographer",                category:"media",       required:true,  canSearch:true},
      {service_type:"decoration",     title:"Decorations",                 category:"celebration", required:false, canSearch:true},
    ],
  },
  wedding:{
    label:"Wedding", accent:"#e11d5c", gradient:"linear-gradient(135deg,#e11d5c,#f97316)",
    services:[
      {service_type:"ceremony_venue",  title:"Ceremony Venue",  category:"ceremony",      required:true},
      {service_type:"reception_venue", title:"Reception Hall",  category:"reception",     required:true, canSearch:true},
      {service_type:"tamada",          title:"Tamada (MC)",     category:"entertainment", required:true},
      {service_type:"wedding_rings",   title:"Wedding Rings",   category:"ceremony",      required:true},
      {service_type:"bridal_dress",    title:"Bridal Gown",     category:"attire",        required:true},
      {service_type:"wedding_cake",    title:"Wedding Cake",    category:"food",          required:true, canSearch:true},
      {service_type:"catering",        title:"Catering",        category:"food",          required:true, canSearch:true},
      {service_type:"photographer",    title:"Photographer",    category:"media",         required:true, canSearch:true},
      {service_type:"videographer",    title:"Videographer",    category:"media",         required:true, canSearch:true},
      {service_type:"flowers",         title:"Bridal Flowers",  category:"decoration",    required:true, canSearch:true},
      {service_type:"music",           title:"DJ / Live Music", category:"entertainment", required:true, canSearch:true},
    ],
  },
  birthday:{
    label:"Birthday Party", accent:"#3b82f6", gradient:"linear-gradient(135deg,#3b82f6,#06b6d4)",
    services:[
      {service_type:"cake",               title:"Birthday Cake",       category:"food",          required:true,  canSearch:true},
      {service_type:"venue",              title:"Venue",               category:"celebration",   required:true},
      {service_type:"catering",           title:"Catering",            category:"food",          required:true,  canSearch:true},
      {service_type:"balloon_decoration", title:"Balloon Decorations", category:"decoration",    required:true,  canSearch:true},
      {service_type:"music",              title:"Music / DJ",          category:"entertainment", required:false, canSearch:true},
      {service_type:"photographer",       title:"Photographer",        category:"media",         required:false, canSearch:true},
    ],
  },
  kids_party:{
    label:"Kids' Party", accent:"#10b981", gradient:"linear-gradient(135deg,#10b981,#059669)",
    services:[
      {service_type:"cake",               title:"Themed Cake",            category:"food",          required:true,  canSearch:true},
      {service_type:"balloon_decoration", title:"Balloon Decorations",    category:"decoration",    required:true,  canSearch:true},
      {service_type:"animator",           title:"Kids Animator",          category:"entertainment", required:true,  canSearch:true},
      {service_type:"venue",              title:"Venue",                  category:"celebration",   required:true},
      {service_type:"catering",           title:"Kids-Friendly Catering", category:"food",          required:true,  canSearch:true},
      {service_type:"decoration",         title:"Theme Decorations",      category:"decoration",    required:true,  canSearch:true},
      {service_type:"photographer",       title:"Photographer",           category:"media",         required:false, canSearch:true},
    ],
  },
  corporate:{
    label:"Corporate Event", accent:"#475569", gradient:"linear-gradient(135deg,#475569,#1e293b)",
    services:[
      {service_type:"venue",         title:"Conference / Event Venue", category:"venue",         required:true},
      {service_type:"catering",      title:"Catering & Coffee Breaks", category:"food",          required:true,  canSearch:true},
      {service_type:"av_tech",       title:"AV & Tech Setup",          category:"tech",          required:true},
      {service_type:"photographer",  title:"Event Photographer",       category:"media",         required:true,  canSearch:true},
      {service_type:"entertainment", title:"Evening Entertainment",    category:"entertainment", required:false, canSearch:true},
    ],
  },
  engagement:{
    label:"Engagement Party", accent:"#8b5cf6", gradient:"linear-gradient(135deg,#8b5cf6,#6d28d9)",
    services:[
      {service_type:"ring",         title:"Engagement Ring", category:"ceremony",    required:true},
      {service_type:"flowers",      title:"Flowers",         category:"decoration",  required:true, canSearch:true},
      {service_type:"photographer", title:"Photographer",    category:"media",       required:true, canSearch:true},
      {service_type:"venue",        title:"Party Venue",     category:"celebration", required:true},
      {service_type:"cake",         title:"Engagement Cake", category:"food",        required:true, canSearch:true},
      {service_type:"catering",     title:"Food & Drinks",   category:"food",        required:true, canSearch:true},
    ],
  },
  anniversary:{
    label:"Anniversary", accent:"#d97706", gradient:"linear-gradient(135deg,#f59e0b,#d97706)",
    services:[
      {service_type:"flowers",      title:"Flower Arrangement", category:"decoration",  required:true, canSearch:true},
      {service_type:"venue",        title:"Restaurant / Venue", category:"celebration", required:true},
      {service_type:"cake",         title:"Anniversary Cake",   category:"food",        required:true, canSearch:true},
      {service_type:"catering",     title:"Dinner / Catering",  category:"food",        required:true, canSearch:true},
      {service_type:"photographer", title:"Photographer",       category:"media",       required:false,canSearch:true},
    ],
  },
  baby_shower:{
    label:"Baby Shower", accent:"#0ea5e9", gradient:"linear-gradient(135deg,#38bdf8,#0ea5e9)",
    services:[
      {service_type:"balloon_decoration", title:"Balloon Decorations",    category:"decoration", required:true,  canSearch:true},
      {service_type:"cake",               title:"Baby Shower Cake",       category:"food",       required:true,  canSearch:true},
      {service_type:"catering",           title:"Finger Food / Catering", category:"food",       required:true,  canSearch:true},
      {service_type:"decoration",         title:"Theme Decorations",      category:"decoration", required:true,  canSearch:true},
      {service_type:"photographer",       title:"Photographer",           category:"media",      required:false, canSearch:true},
    ],
  },
  graduation:{
    label:"Graduation Party", accent:"#ea580c", gradient:"linear-gradient(135deg,#f59e0b,#ea580c)",
    services:[
      {service_type:"venue",              title:"Venue",            category:"celebration", required:true},
      {service_type:"cake",               title:"Graduation Cake",  category:"food",        required:true,  canSearch:true},
      {service_type:"catering",           title:"Catering",         category:"food",        required:true,  canSearch:true},
      {service_type:"balloon_decoration", title:"Balloons & Decor", category:"decoration",  required:false, canSearch:true},
      {service_type:"photographer",       title:"Photographer",     category:"media",       required:false, canSearch:true},
    ],
  },
};

/* ══════════════════════════════════════════════
   ACTION PROCESSOR
══════════════════════════════════════════════ */
function applyActions(actions, prev) {
  let state = {...prev};
  const searches = [];
  for (const a of actions) {
    switch (a.type) {
      case "set_event_type": {
        if (state.event_type === a.event_type) break;
        const tpl = EVENT_TEMPLATES[a.event_type];
        state = {...state,
          event_type: a.event_type,
          event_type_label: tpl?.label || a.event_type,
          accent: tpl?.accent || C.pink,
          gradient: tpl?.gradient,
          services: state.services?.length
            ? state.services
            : (tpl?.services||[]).map(s=>({...s,status:"pending"})),
        };
        break;
      }
      case "set_guest_count": state={...state,guest_count:a.guest_count}; break;
      case "set_location":    state={...state,city:a.city}; break;
      case "set_event_date":  state={...state,date:a.date}; break;
      case "set_budget":      state={...state,budget:{description:a.description,budget_level:a.budget_level}}; break;
      case "set_style":       state={...state,style:a.style}; break;
      case "set_notes":       state={...state,notes:a.notes}; break;
      case "add_service": {
        if (!state.services?.find(s=>s.service_type===a.service_type))
          state={...state,services:[...(state.services||[]),{service_type:a.service_type,title:a.title||a.service_type.replace(/_/g," "),category:a.category||"other",required:a.priority==="required",status:"pending",canSearch:true}]};
        break;
      }
      case "remove_service":
        state={...state,services:(state.services||[]).filter(s=>s.service_type!==a.service_type)}; break;
      case "mark_required_item":
      case "mark_optional_item": {
        if (!state.services?.find(s=>s.service_type===a.item_type))
          state={...state,services:[...(state.services||[]),{service_type:a.item_type,title:a.title||a.item_type.replace(/_/g," "),category:a.category||"other",required:a.type==="mark_required_item",status:"pending"}]};
        break;
      }
      case "search_vendors":
        searches.push(a);
        state={...state,services:(state.services||[]).map(s=>s.service_type===a.service_type?{...s,searching:true}:s)};
        break;
      case "select_vendor":
        state={...state,
          selected_vendors:{...state.selected_vendors,[a.service_type]:{id:a.vendor_id,name:a.vendor_name}},
          services:(state.services||[]).map(s=>s.service_type===a.service_type?{...s,status:"selected",searching:false}:s),
        };
        break;
      case "unselect_vendor": {
        const sv={...state.selected_vendors}; delete sv[a.service_type];
        state={...state,selected_vendors:sv,services:(state.services||[]).map(s=>s.service_type===a.service_type?{...s,status:"pending"}:s)};
        break;
      }
      default: break;
    }
  }
  return {state, searches};
}

/* ══════════════════════════════════════════════
   FLOATING ORB
══════════════════════════════════════════════ */
function Orb({size=68}) {
  return (
    <motion.div animate={{y:[0,-10,0]}} transition={{duration:3.5,repeat:Infinity,ease:"easeInOut"}}
      style={{width:size,height:size,borderRadius:"50%",position:"relative",flexShrink:0}}>
      <div style={{position:"absolute",inset:-size*0.25,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"radial-gradient(circle at 35% 28%,#f0abfc 0%,#a855f7 30%,#7c3aed 58%,#1e1b4b 100%)",boxShadow:`0 0 ${size*0.4}px rgba(168,85,247,0.4),0 ${size*0.15}px ${size*0.4}px rgba(0,0,0,0.15)`,overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",top:"12%",left:"18%",width:"38%",height:"32%",borderRadius:"50%",background:"rgba(255,255,255,0.35)",filter:"blur(4px)",transform:"rotate(-25deg)"}}/>
      </div>
    </motion.div>
  );
}

function BotAvatar({size=28}) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:"radial-gradient(circle at 35% 30%,#f0abfc,#7c3aed 60%,#1e1b4b)",boxShadow:"0 2px 10px rgba(124,58,237,0.3)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:"14%",left:"18%",width:"35%",height:"30%",borderRadius:"50%",background:"rgba(255,255,255,0.35)",filter:"blur(2px)"}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TYPING INDICATOR
══════════════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
      <BotAvatar/>
      <div style={{background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${C.border}`,borderRadius:"18px 18px 18px 4px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
        {[0,0.15,0.30].map((d,i)=>(
          <motion.span key={i} animate={{y:[0,-4,0],opacity:[0.35,1,0.35]}} transition={{duration:0.65,repeat:Infinity,delay:d,ease:"easeInOut"}}
            style={{width:6,height:6,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#e11d5c)",display:"block"}}/>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════ */
function MessageBubble({msg}) {
  const isBot = msg.role==="bot";
  const lines = msg.text.split("\n");
  const renderLine=(line,li)=>{
    const parts=line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={li}>
        {parts.map((p,j)=>p.startsWith("**")&&p.endsWith("**")?<strong key={j} style={{fontWeight:600}}>{p.slice(2,-2)}</strong>:p)}
        {li<lines.length-1&&<br/>}
      </span>
    );
  };
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.18,ease:[0.22,1,0.36,1]}}
      style={{display:"flex",flexDirection:"column",alignItems:isBot?"flex-start":"flex-end"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:8,maxWidth:"82%"}}>
        {isBot && <BotAvatar/>}
        <div style={{
          background: isBot ? "rgba(255,255,255,0.7)" : "linear-gradient(135deg,#f97316,#e11d5c)",
          backdropFilter: isBot ? "blur(20px)" : "none",
          WebkitBackdropFilter: isBot ? "blur(20px)" : "none",
          border: isBot ? "1px solid rgba(124,58,237,0.1)" : "none",
          boxShadow: isBot ? "0 4px 24px rgba(124,58,237,0.08),0 1px 3px rgba(0,0,0,0.05)" : "0 4px 20px rgba(249,115,22,0.25)",
          color: isBot ? C.text : "#fff",
          borderRadius: isBot ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
          padding:"12px 16px",fontSize:"0.875rem",lineHeight:1.65,letterSpacing:"-0.003em",
        }}>
          {lines.map(renderLine)}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   VENDOR CARD
══════════════════════════════════════════════ */
const VENDOR_PALETTES=[
  ["#7c3aed","rgba(124,58,237,0.08)"],["#e11d5c","rgba(225,29,92,0.07)"],
  ["#059669","rgba(5,150,105,0.07)"], ["#d97706","rgba(217,119,6,0.07)"],
  ["#0891b2","rgba(8,145,178,0.07)"], ["#db2777","rgba(219,39,119,0.07)"],
];

function VendorCard({vendor,onSelect}) {
  const [hov,setHov]=useState(false);
  const name    = vendor.business_name||vendor.name||"Vendor";
  const rating  = parseFloat(vendor.rating)||0;
  const city    = vendor.city||"";
  const initial = name[0]?.toUpperCase()||"V";
  const [fg,bg] = VENDOR_PALETTES[name.charCodeAt(0)%VENDOR_PALETTES.length];
  return (
    <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      initial={{opacity:0,scale:0.92,y:4}} animate={{opacity:1,scale:1,y:0}} whileHover={{y:-4}}
      transition={{type:"spring",stiffness:340,damping:24}}
      style={{background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${hov?fg+"44":C.border}`,boxShadow:hov?`0 12px 32px ${fg}22,0 2px 8px rgba(0,0,0,0.06)`:"0 2px 8px rgba(0,0,0,0.04)",borderRadius:14,minWidth:156,maxWidth:176,flexShrink:0,overflow:"hidden",cursor:"pointer",transition:"border-color 0.18s,box-shadow 0.18s"}}>
      <div style={{height:3,background:hov?`linear-gradient(90deg,${fg},${fg}99)`:"rgba(0,0,0,0.05)"}}/>
      <div style={{padding:"11px 12px 12px"}}>
        <div style={{width:34,height:34,borderRadius:9,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",fontWeight:800,color:fg,marginBottom:8}}>{initial}</div>
        <p style={{margin:"0 0 2px",fontSize:"0.76rem",fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</p>
        <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:9,minHeight:15}}>
          {rating>0&&<><Star size={9} style={{color:"#f59e0b",fill:"#f59e0b",flexShrink:0}}/><span style={{fontSize:"0.68rem",color:C.text2,fontWeight:600}}>{rating.toFixed(1)}</span></>}
          {city&&<span style={{fontSize:"0.65rem",color:C.text3,marginLeft:rating>0?2:0}}>{rating>0?"· ":""}{city}</span>}
        </div>
        <motion.button whileTap={{scale:0.96}} onClick={()=>onSelect(vendor)}
          style={{width:"100%",background:hov?`linear-gradient(135deg,${fg},${fg}cc)`:"transparent",border:`1px solid ${hov?fg:C.borderStrong}`,borderRadius:8,color:hov?"#fff":C.text2,fontSize:"0.7rem",fontWeight:600,padding:"6px 0",cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
          Select <ChevronRight size={10} strokeWidth={2.5}/>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   SERVICE ROW
══════════════════════════════════════════════ */
function ServiceRow({service,selectedVendor,vendorResults,onSelectVendor,onSearchVendors,onUnselectVendor,accent}) {
  const results    = vendorResults[service.service_type]||[];
  const isSelected = !!selectedVendor;
  const isSearching= service.searching;
  const hasResults = results.length>0&&!isSelected;
  const iconColor  = isSelected ? C.green : (accent||C.purple);

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0"}}>
        {/* Status circle */}
        <div style={{width:20,height:20,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isSelected ? (
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:460,damping:22}}
              style={{width:20,height:20,borderRadius:"50%",background:"#f0fdf4",border:"1.5px solid #86efac",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Check size={11} color={C.green} strokeWidth={2.5}/>
            </motion.div>
          ) : isSearching ? (
            <motion.div animate={{rotate:360}} transition={{duration:0.9,repeat:Infinity,ease:"linear"}}
              style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${(accent||C.purple)}22`,borderTopColor:accent||C.purple}}/>
          ) : (
            <div style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${C.border}`}}/>
          )}
        </div>

        {/* Lucide service icon */}
        <div style={{width:20,height:20,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",opacity: isSelected ? 0.6 : 0.7}}>
          {getServiceIcon(service.service_type, {size:15, color:iconColor, strokeWidth:1.8})}
        </div>

        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontSize:"0.8rem",fontWeight:600,letterSpacing:"-0.008em",color:isSelected?"#15803d":C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {service.title}
          </p>
          {isSelected&&selectedVendor&&<p style={{margin:"1px 0 0",fontSize:"0.7rem",color:"#16a34a",fontWeight:500}}>{selectedVendor.name}</p>}
          {!service.required&&!isSelected&&<span style={{fontSize:"0.6rem",background:"rgba(0,0,0,0.04)",color:C.text3,border:`1px solid ${C.border}`,borderRadius:100,padding:"1px 6px",fontWeight:600}}>optional</span>}
        </div>

        <div style={{flexShrink:0,display:"flex",alignItems:"center"}}>
          {isSelected ? (
            <button onClick={()=>onUnselectVendor(service.service_type)}
              style={{border:"none",background:"none",cursor:"pointer",padding:"3px 4px",color:C.text3,display:"flex",alignItems:"center",borderRadius:6,transition:"color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.text2} onMouseLeave={e=>e.currentTarget.style.color=C.text3}>
              <X size={13}/>
            </button>
          ) : hasResults ? (
            <span style={{fontSize:"0.66rem",background:"#fef9c3",color:"#854d0e",fontWeight:700,borderRadius:100,padding:"2px 8px",border:"1px solid #fef08a"}}>
              {results.length} found
            </span>
          ) : service.canSearch&&!isSearching ? (
            <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
              onClick={()=>onSearchVendors(service.service_type,service.title)}
              style={{display:"inline-flex",alignItems:"center",gap:3,background:C.surface,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`1px solid ${C.border}`,color:C.text2,borderRadius:8,padding:"5px 10px",fontSize:"0.7rem",fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.9)";e.currentTarget.style.color=C.text;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.text2;}}>
              <Search size={9} strokeWidth={2.5}/> Find
            </motion.button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {hasResults&&(
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.22}}
            style={{overflow:"hidden",paddingLeft:50,paddingBottom:10}}>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none",msOverflowStyle:"none"}}>
              {results.slice(0,6).map((v,i)=><VendorCard key={v.id||i} vendor={v} onSelect={vendor=>onSelectVendor(service.service_type,vendor)}/>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CATEGORY SECTION
══════════════════════════════════════════════ */
function CategorySection({label,services,selectedVendors,...rowProps}) {
  const [open,setOpen]=useState(true);
  const done=services.filter(s=>selectedVendors?.[s.service_type]).length;
  const all=done===services.length;
  return (
    <div style={{background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${C.border}`,borderRadius:14,marginBottom:6,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:"0.67rem",fontWeight:700,color:C.text2,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</span>
          {done>0&&(
            <span style={{fontSize:"0.62rem",fontWeight:700,borderRadius:100,padding:"2px 7px",background:all?"#f0fdf4":"rgba(0,0,0,0.04)",color:all?"#16a34a":C.text3,border:`1px solid ${all?"#bbf7d0":C.border}`}}>
              {done}/{services.length}
            </span>
          )}
        </div>
        {open?<ChevronUp size={12} style={{color:C.text3}}/>:<ChevronDown size={12} style={{color:C.text3}}/>}
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} transition={{duration:0.18}} style={{overflow:"hidden"}}>
            <div style={{padding:"0 14px 8px",borderTop:`1px solid ${C.border}`}}>
              {services.map((s,idx)=>(
                <div key={s.service_type}>
                  {idx>0&&<div style={{height:1,background:"rgba(0,0,0,0.03)"}}/>}
                  <ServiceRow service={s} selectedVendor={selectedVendors?.[s.service_type]} {...rowProps}/>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PLAN PANEL
══════════════════════════════════════════════ */
function Chip({icon,children}) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:"0.72rem",background:"rgba(255,255,255,0.2)",borderRadius:100,padding:"3px 9px",fontWeight:500,color:"#fff"}}>
      {icon}{children}
    </span>
  );
}

function EventPlanPanel({eventState,vendorResults,onSelectVendor,onSearchVendors,onUnselectVendor}) {
  const {event_type,event_type_label,accent,gradient,date,city,guest_count,style,budget,services=[],selected_vendors={}}=eventState;
  const searchable=services.filter(s=>s.canSearch);
  const sel=Object.keys(selected_vendors).length;
  const pct=searchable.length>0?Math.round((sel/searchable.length)*100):0;
  const grouped={};
  for(const s of services){if(!grouped[s.category])grouped[s.category]=[];grouped[s.category].push(s);}
  const missing=services.filter(s=>s.required&&s.canSearch&&!selected_vendors[s.service_type]);

  return (
    <div>
      {/* Header */}
      <div style={{background:gradient||C.grad,borderRadius:18,padding:"20px 22px",marginBottom:14,color:"#fff",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:-50,right:-50,width:170,height:170,borderRadius:"50%",background:"rgba(255,255,255,0.07)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            {/* Icon box instead of emoji */}
            <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {getEventIcon(event_type,{size:22,color:"#fff",strokeWidth:1.8})}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <h2 style={{margin:"0 0 6px",fontSize:"1.1rem",fontWeight:800,letterSpacing:"-0.03em"}}>{event_type_label}</h2>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {date&&<Chip icon={<Calendar size={10}/>}>{date}</Chip>}
                {city&&<Chip icon={<MapPin size={10}/>}>{city}</Chip>}
                {guest_count&&<Chip icon={<Users size={10}/>}>{guest_count} guests</Chip>}
                {budget?.description&&<Chip icon={<DollarSign size={10}/>}>{budget.description}</Chip>}
                {style&&<Chip><Sparkles size={10}/> {style}</Chip>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,height:4,background:"rgba(255,255,255,0.2)",borderRadius:10,overflow:"hidden"}}>
              <motion.div animate={{width:`${pct}%`}} transition={{duration:0.6,ease:"easeOut"}}
                style={{height:"100%",background:"rgba(255,255,255,0.9)",borderRadius:10}}/>
            </div>
            <span style={{fontSize:"0.73rem",fontWeight:700,opacity:0.85,flexShrink:0}}>{sel}/{searchable.length} vendors</span>
          </div>
        </div>
      </div>

      {/* Missing items */}
      {missing.length>0&&sel>0&&(
        <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
          style={{background:"rgba(254,243,199,0.7)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start"}}>
          <AlertTriangle size={15} color="#92400e" style={{flexShrink:0,marginTop:1}}/>
          <div>
            <p style={{margin:"0 0 2px",fontSize:"0.775rem",fontWeight:700,color:"#92400e"}}>Still needed:</p>
            <p style={{margin:0,fontSize:"0.72rem",color:"#b45309",lineHeight:1.5}}>{missing.map(s=>s.title).join(" · ")}</p>
          </div>
        </motion.div>
      )}

      {Object.entries(grouped).map(([cat,items])=>(
        <CategorySection key={cat} label={CATEGORY_LABELS[cat]||cat} services={items} selectedVendors={selected_vendors}
          vendorResults={vendorResults} onSelectVendor={onSelectVendor} onSearchVendors={onSearchVendors} onUnselectVendor={onUnselectVendor} accent={accent}/>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   CHAT WELCOME  (left panel)
══════════════════════════════════════════════ */
const FEATURES=[
  {icon:<ListChecks size={17} color={C.orange}/>,title:"Smart Checklist",desc:"Complete checklist built from your event instantly"},
  {icon:<Store size={17} color={C.pink}/>,        title:"Find Vendors",   desc:"Real vendors in your city, searched instantly"},
  {icon:<Heart size={17} color={C.purple}/>,      title:"Cultural Tips",  desc:"Armenian traditions & cultural guidance"},
];

function ChatWelcome() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"28px 24px",textAlign:"center"}}>
      <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:200,damping:20,delay:0.1}} style={{marginBottom:22}}>
        <Orb size={68}/>
      </motion.div>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.25}} style={{marginBottom:26,maxWidth:320}}>
        <h2 style={{margin:"0 0 10px",fontSize:"1.3rem",fontWeight:700,color:C.text,letterSpacing:"-0.03em",lineHeight:1.35}}>
          Hello! I'm your{" "}
          <span style={{background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",fontWeight:800}}>
            AI event planner
          </span>
          {" "}ready to create the{" "}
          <strong style={{fontWeight:800,color:C.text}}>perfect celebration.</strong>
        </h2>
        <p style={{margin:0,fontSize:"0.85rem",color:C.text2,lineHeight:1.6}}>
          Describe your event — type, guests, city, style.<br/>I'll handle the rest.
        </p>
      </motion.div>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
        style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",maxWidth:400}}>
        {FEATURES.map((f,i)=>(
          <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.38+i*0.07}}
            style={{background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${C.border}`,boxShadow:"0 4px 20px rgba(0,0,0,0.05)",borderRadius:14,padding:"14px 12px",textAlign:"left"}}>
            <div style={{marginBottom:8}}>{f.icon}</div>
            <p style={{margin:"0 0 4px",fontSize:"0.74rem",fontWeight:700,color:C.text}}>{f.title}</p>
            <p style={{margin:0,fontSize:"0.66rem",color:C.text3,lineHeight:1.5}}>{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   RIGHT EMPTY  (event type picker, icon-only)
══════════════════════════════════════════════ */
const EVENT_TYPES_GRID=[
  {key:"christening",label:"Christening",color:"#7c3aed"},
  {key:"wedding",    label:"Wedding",    color:"#e11d5c"},
  {key:"birthday",   label:"Birthday",   color:"#3b82f6"},
  {key:"kids_party", label:"Kids Party", color:"#10b981"},
  {key:"corporate",  label:"Corporate",  color:"#475569"},
  {key:"baby_shower",label:"Baby Shower",color:"#0ea5e9"},
  {key:"engagement", label:"Engagement", color:"#8b5cf6"},
  {key:"graduation", label:"Graduation", color:"#ea580c"},
];

function RightEmptyState({onPickType}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"32px 20px",textAlign:"center"}}>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} style={{marginBottom:24}}>
        <p style={{margin:"0 0 6px",fontSize:"0.67rem",fontWeight:700,color:C.text3,letterSpacing:"0.1em",textTransform:"uppercase"}}>Quick start</p>
        <h3 style={{margin:"0 0 8px",fontSize:"1.15rem",fontWeight:800,color:C.text,letterSpacing:"-0.03em"}}>Pick an event type</h3>
        <p style={{margin:0,fontSize:"0.82rem",color:C.text2,lineHeight:1.5,maxWidth:240}}>Or describe your event in the chat and I'll build the plan automatically.</p>
      </motion.div>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,width:"100%",maxWidth:380}}>
        {EVENT_TYPES_GRID.map((t,i)=>(
          <motion.button key={t.key}
            initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.22+i*0.04,type:"spring",stiffness:300}}
            whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.96}}
            onClick={()=>onPickType(t.label)}
            style={{background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${C.border}`,boxShadow:"0 2px 10px rgba(0,0,0,0.04)",borderRadius:14,padding:"16px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:7,transition:"all 0.18s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${t.color}10`;e.currentTarget.style.borderColor=`${t.color}44`;e.currentTarget.style.boxShadow=`0 8px 24px ${t.color}18`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.04)";}}>
            {/* Icon in a colored circle */}
            <div style={{width:36,height:36,borderRadius:"50%",background:`${t.color}14`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {getEventIcon(t.key,{size:18,color:t.color,strokeWidth:1.8})}
            </div>
            <span style={{fontSize:"0.62rem",fontWeight:700,color:C.text2}}>{t.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
const INITIAL_STATE={
  event_type:null,event_type_label:null,
  accent:C.pink,gradient:null,date:null,city:null,
  guest_count:null,style:null,budget:null,notes:null,
  services:[],selected_vendors:{},
};

const SITE_HEADER_H = 64;
const PLANNER_TOP_H = 52;

export default function PlannerClient({lang}) {
  const [messages,      setMessages]      = useState([]);
  const [eventState,    setEventState]    = useState(INITIAL_STATE);
  const [vendorResults, setVendorResults] = useState({});
  const [loading,       setLoading]       = useState(false);
  const [input,         setInput]         = useState("");
  const [focused,       setFocused]       = useState(false);

  const msgsRef  = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom=useCallback(()=>{if(msgsRef.current)msgsRef.current.scrollTop=msgsRef.current.scrollHeight;},[]);
  useEffect(()=>{scrollToBottom();},[messages,loading,scrollToBottom]);

  useEffect(()=>{
    if(eventState.event_type)
      localStorage.setItem("salooote_planner",JSON.stringify({eventState,vendorResults}));
  },[eventState,vendorResults]);

  useEffect(()=>{
    const t=setTimeout(()=>{
      setMessages([{id:1,role:"bot",text:"Hi! I'm your Salooote event planner.\n\nDescribe what you want to plan — event type, guests, city, style. I'll build your complete checklist and find vendors instantly!"}]);
    },400);
    return ()=>clearTimeout(t);
  },[]);

  const pushBot=useCallback(text=>{
    setMessages(prev=>[...prev,{id:Date.now()+Math.random(),role:"bot",text}]);
  },[]);

  const searchVendors=useCallback(async(service_type,search_term,filters={})=>{
    try{
      const base=process.env.NEXT_PUBLIC_API_URL||"http://localhost:8080/api/v1";
      const term=search_term||service_type.replace(/_/g," ");
      const params=new URLSearchParams({search:term,limit:"8"});
      const city=filters.city||eventState.city;
      if(city)params.set("city",city);
      let data=null;
      try{const r=await fetch(`${base}/vendors?${params}`);if(r.ok){const j=await r.json();data=j.data||[];}}catch{}
      if(!data?.length){const r=await fetch(`${base}/products?${params}`);if(r.ok){const j=await r.json();data=(j.data||[]).map(p=>({id:p.id,business_name:p.vendor_name||p.name,name:p.vendor_name||p.name,rating:p.rating,city:p.vendor_city||city||"",slug:p.vendor_slug||""}));}}
      if(data?.length)setVendorResults(prev=>({...prev,[service_type]:data}));
      setEventState(prev=>({...prev,services:prev.services.map(s=>s.service_type===service_type?{...s,searching:false}:s)}));
    }catch{setEventState(prev=>({...prev,services:prev.services.map(s=>s.service_type===service_type?{...s,searching:false}:s)}));}
  },[eventState.city]);

  const sendMessage=useCallback(async text=>{
    const t=text.trim();
    if(!t||loading)return;
    setInput("");
    const userMsg={id:Date.now(),role:"user",text:t};
    setMessages(prev=>[...prev,userMsg]);
    setLoading(true);
    try{
      const res=await fetch("/api/planner/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[...messages,userMsg],eventState})});
      const data=await res.json();
      if(data.error){pushBot(`${data.error}`);return;}
      const {state:newState,searches}=applyActions(data.actions||[],eventState);
      setEventState(newState);
      if(data.assistant_message)pushBot(data.assistant_message);
      for(const s of searches)searchVendors(s.service_type,s.search_term,s.filters||{});
    }catch{pushBot("Something went wrong. Please try again.");}
    finally{setLoading(false);setTimeout(()=>inputRef.current?.focus(),50);}
  },[messages,eventState,loading,searchVendors,pushBot]);

  const handleSelectVendor=useCallback((service_type,vendor)=>{
    const name=vendor.business_name||vendor.name||"Vendor";
    setEventState(prev=>({...prev,selected_vendors:{...prev.selected_vendors,[service_type]:{id:vendor.id,name}},services:prev.services.map(s=>s.service_type===service_type?{...s,status:"selected",searching:false}:s)}));
    setVendorResults(prev=>{const n={...prev};delete n[service_type];return n;});
    pushBot(`**${name}** added for **${service_type.replace(/_/g," ")}**. What's next?`);
  },[pushBot]);

  const handleSearchVendors=useCallback((service_type,title)=>{
    setEventState(prev=>({...prev,services:prev.services.map(s=>s.service_type===service_type?{...s,searching:true}:s)}));
    searchVendors(service_type,title);
  },[searchVendors]);

  const handleUnselectVendor=useCallback(service_type=>{
    setEventState(prev=>{const sv={...prev.selected_vendors};delete sv[service_type];return{...prev,selected_vendors:sv,services:prev.services.map(s=>s.service_type===service_type?{...s,status:"pending"}:s)};});
  },[]);

  const hasEvent    = !!eventState.event_type;
  const accent      = eventState.accent||C.purple;
  const canSend     = !!input.trim()&&!loading;
  const showWelcome = messages.length<=1&&!hasEvent;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:10px;}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.16);}
        .hide-scroll::-webkit-scrollbar{display:none;}
        .hide-scroll{scrollbar-width:none;-ms-overflow-style:none;}
      `}</style>

      <div style={{height:`calc(100vh - ${SITE_HEADER_H}px)`,display:"flex",flexDirection:"column",background:"#ffffff",overflow:"hidden",position:"relative"}}>

        {/* Subtle background blobs on white */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-10%",right:"-5%",  width:"50%",height:"55%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(249,115,22,0.07) 0%,transparent 65%)"}}/>
          <div style={{position:"absolute",bottom:"0",  left:"-10%", width:"55%",height:"55%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(124,58,237,0.07) 0%,transparent 65%)"}}/>
          <div style={{position:"absolute",top:"40%",   left:"30%",  width:"40%",height:"45%",borderRadius:"50%",background:"radial-gradient(ellipse,rgba(225,29,92,0.05) 0%,transparent 70%)"}}/>
        </div>

        {/* Top bar */}
        <div style={{height:PLANNER_TOP_H,flexShrink:0,position:"relative",zIndex:10,background:"rgba(255,255,255,0.75)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 36px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Link href={`/${lang}`} style={{textDecoration:"none"}}>
              <motion.button whileHover={{background:"rgba(0,0,0,0.04)"}} whileTap={{scale:0.93}}
                style={{width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.6)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.15s"}}>
                <ArrowLeft size={13} color={C.text2}/>
              </motion.button>
            </Link>
            <div style={{width:1,height:18,background:C.border}}/>
            <div style={{display:"flex",alignItems:"center",gap:6,background:C.grad,borderRadius:100,padding:"5px 14px",boxShadow:"0 4px 16px rgba(124,58,237,0.22)"}}>
              <Sparkles size={11} color="#fff" strokeWidth={2.2}/>
              <span style={{fontSize:"0.78rem",fontWeight:700,color:"#fff",letterSpacing:"-0.01em"}}>AI Planner</span>
            </div>
          </div>

          {hasEvent&&(
            <motion.div initial={{opacity:0,x:10}} animate={{opacity:1,x:0}}
              style={{display:"flex",alignItems:"center",gap:9,background:C.surface,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${C.border}`,boxShadow:"0 4px 16px rgba(0,0,0,0.05)",borderRadius:100,padding:"5px 14px 5px 10px"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:`${accent}18`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {getEventIcon(eventState.event_type,{size:13,color:accent,strokeWidth:2})}
              </div>
              <div>
                <p style={{margin:0,fontSize:"0.72rem",fontWeight:700,color:C.text,letterSpacing:"-0.02em",lineHeight:1.2}}>{eventState.event_type_label}</p>
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
                  <div style={{width:48,height:2.5,background:"rgba(0,0,0,0.08)",borderRadius:10,overflow:"hidden"}}>
                    <motion.div
                      animate={{width:`${eventState.services.filter(s=>s.canSearch).length>0?Math.round((Object.keys(eventState.selected_vendors).length/eventState.services.filter(s=>s.canSearch).length)*100):0}%`}}
                      style={{height:"100%",background:C.grad,borderRadius:10}} transition={{duration:0.5}}/>
                  </div>
                  <span style={{fontSize:"0.6rem",color:C.text3,fontWeight:600}}>
                    {Object.keys(eventState.selected_vendors).length}/{eventState.services.filter(s=>s.canSearch).length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main layout */}
        <div style={{flex:1,overflow:"hidden",display:"flex",padding:"20px 36px 20px",gap:20,position:"relative",zIndex:1}}>

          {/* LEFT: Chat — bigger (flex 1.5) */}
          <div style={{flex:"1.5",minWidth:0,display:"flex",flexDirection:"column",background:C.surface,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:`1px solid ${C.border}`,borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.04)",overflow:"hidden"}}>

            {/* Messages or Welcome */}
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <AnimatePresence mode="wait">
                {showWelcome ? (
                  <motion.div key="welcome" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.98}} transition={{duration:0.18}} style={{flex:1,overflow:"hidden"}}>
                    <ChatWelcome/>
                  </motion.div>
                ) : (
                  <motion.div key="chat" ref={msgsRef} className="hide-scroll"
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
                    style={{flex:1,overflowY:"auto",padding:"20px 20px 12px"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {messages.map(msg=><MessageBubble key={msg.id} msg={msg}/>)}
                      {loading&&<TypingIndicator/>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div style={{flexShrink:0,padding:"12px 18px 18px",borderTop:`1px solid ${C.border}`}}>
              <div style={{background:focused?"linear-gradient(135deg,#f97316,#e11d5c,#7c3aed)":"rgba(0,0,0,0.08)",borderRadius:16,padding:"1.5px",boxShadow:focused?"0 0 28px rgba(249,115,22,0.15),0 0 56px rgba(124,58,237,0.1)":"none",transition:"box-shadow 0.25s"}}>
                <div style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderRadius:"14.5px",padding:"10px 10px 10px 16px",display:"flex",alignItems:"center",gap:8}}>
                  <form onSubmit={e=>{e.preventDefault();sendMessage(input);}} style={{display:"flex",flex:1,alignItems:"center",gap:8}}>
                    <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                      disabled={loading} placeholder="Ask anything…" autoFocus
                      style={{flex:1,border:"none",outline:"none",fontSize:"0.9rem",background:"transparent",color:C.text,fontFamily:"inherit",letterSpacing:"-0.01em"}}/>
                    <motion.button type="submit" disabled={!canSend}
                      whileHover={canSend?{scale:1.08}:{}} whileTap={canSend?{scale:0.92}:{}}
                      style={{width:38,height:38,borderRadius:"50%",flexShrink:0,border:"none",background:canSend?"linear-gradient(135deg,#f97316,#e11d5c)":"rgba(0,0,0,0.07)",cursor:canSend?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:canSend?"0 4px 16px rgba(249,115,22,0.35)":"none",transition:"all 0.2s"}}>
                      {loading
                        ? <motion.div animate={{rotate:360}} transition={{duration:0.9,repeat:Infinity,ease:"linear"}}><Loader2 size={14} color={C.text3}/></motion.div>
                        : <Send size={14} color={canSend?"#fff":C.text3} strokeWidth={2.2}/>
                      }
                    </motion.button>
                  </form>
                </div>
              </div>
              <p style={{margin:"6px 0 0",fontSize:"0.62rem",color:C.text3,textAlign:"center"}}>AI may make mistakes · Always verify with vendors</p>
            </div>
          </div>

          {/* RIGHT: Plan — smaller (flex 1) */}
          <div style={{flex:"1",minWidth:0,display:"flex",flexDirection:"column",background:C.surface,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:`1px solid ${C.border}`,borderRadius:20,boxShadow:"0 8px 40px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.04)",overflow:"hidden"}}>
            <div style={{flex:1,overflowY:"auto",padding:hasEvent?"20px 18px 32px":"0"}}>
              <AnimatePresence mode="wait">
                {!hasEvent ? (
                  <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <RightEmptyState onPickType={label=>sendMessage(`I want to plan a ${label}`)}/>
                  </motion.div>
                ) : (
                  <motion.div key="plan" initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} transition={{duration:0.28,ease:[0.22,1,0.36,1]}}>
                    <EventPlanPanel eventState={eventState} vendorResults={vendorResults}
                      onSelectVendor={handleSelectVendor} onSearchVendors={handleSearchVendors} onUnselectVendor={handleUnselectVendor}/>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
