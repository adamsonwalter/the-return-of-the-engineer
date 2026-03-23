import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Power, Zap, Shield, Cpu, Activity, ChevronRight, 
  Menu, X, Download, MessageSquare, Wand2, Volume2, Loader2, Sparkles 
} from 'lucide-react';

// --- Constants & API Config ---
const apiKey = ""; // Runtime provided
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

// --- Remnant Knowledgebase ---
const REMNANT_KNOWLEDGEBASE = `
CONTEXT: The year is 2027. The Western 'Therapeutic Operating System' has collapsed against the laws of physics.
CORE TENETS:
1. THE SNAP: The 2027 event where grid inertia failed and 'Subscription' defense assets (F-35, AUKUS) timed out.
2. NOMINAL MAN: The administrative class that prioritizes narrative, empathy filters, and social license over thermodynamics.
3. PHYSICAL OS: The restoration protocol led by the 'Remnant' (Engineers/Realists) to relight furnaces and reclaim industrial sovereignty.
4. THERMODYNAMIC DIVORCE: The liquidation of industrial assets (Qenos, Oceania Glass) that left the nation fragile.
5. ENGINEER'S VETO: The legal right to strike down any policy violating the laws of physics.
`;

const VETO_MAP = {
  "Stakeholder": "Resource Owner",
  "Sustainable": "Systemically Redundant",
  "Social License": "Kinetic Permission",
  "Human-Centred": "Engineering-First",
  "Innovation": "Tooling Capacity",
  "Inclusion": "Component Integrity",
  "Digital Transformation": "Hardware Tethering",
  "Net Zero": "Thermodynamic Fiction",
  "Sovereign Capability": "Subscription Franchise",
  "Managed Transition": "Managed Decline",
  "Global Integration": "Vassal Interdependency",
  "Narrative": "Physics"
};

// --- Helper: Exponential Backoff ---
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const VetoText = ({ children, isFunctional }) => {
  if (!isFunctional || typeof children !== 'string') return <span>{children}</span>;
  let processedText = [children];
  Object.entries(VETO_MAP).forEach(([nominal, functional]) => {
    const regex = new RegExp(`(${nominal})`, 'gi');
    processedText = processedText.flatMap((part) => {
      if (typeof part !== 'string') return part;
      const segments = part.split(regex);
      return segments.map((segment, i) => {
        if (segment.toLowerCase() === nominal.toLowerCase()) {
          return (
            <span key={i} className="group relative inline text-orange-500 font-bold border-b border-orange-700/50">
              <span className="line-through opacity-50 mr-1">{segment}</span>
              <span className="font-mono text-xs tracking-tighter uppercase">[{functional}]</span>
            </span>
          );
        }
        return segment;
      });
    });
  });
  return <>{processedText}</>;
};

const GridTelemetry = ({ isFunctional }) => {
  const [freq, setFreq] = useState(50.00);
  useEffect(() => {
    const interval = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.04;
      setFreq(f => Math.max(47.5, Math.min(52.5, f + drift)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const statusColor = freq < 49.5 ? 'text-orange-500' : isFunctional ? 'text-blue-400' : 'text-zinc-300';
  return (
    <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-tighter">
      <div className="flex flex-col">
        <span className="text-zinc-500">Grid Frequency</span>
        <span className={`${statusColor} transition-colors duration-300 font-bold`}>{freq.toFixed(2)} Hz</span>
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-500">System Load</span>
        <span className="text-zinc-300 font-bold">84.2% MW</span>
      </div>
    </div>
  );
};

export default function App() {
  const [isFunctional, setIsFunctional] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deconInput, setDeconInput] = useState("");
  const [deconResult, setDeconResult] = useState("");
  const [isDeconLoading, setIsDeconLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);

  const chapters = [
    {
      id: 0,
      title: "Preface: The End of the Hallucination",
      content: "The era of managing the narrative is dead. We are now in the 2027 Snap, where the 'Nominal Man' is paralyzed because his scripts cannot fix a cold furnace or a silent grid. The 'Therapeutic OS' was a parasite on the industrial spine built by our grandfathers. It spent thirty years consuming the 'Historical Competence' of the nation while producing nothing but 'Social Cohesion' and 'Metadata.' It sold the steel furnaces to buy carbon credits.\n\nReality is non-negotiable. This manual is for those who speak the language of the machine—the engineers, realists, and 'toxic' truthtellers who must now resuscitate the corpse of the state. Welcome back to Reality."
    },
    {
      id: 1,
      title: "Chapter 1: The Thermodynamic Divorce",
      content: "The year 2024 marked the beginning of the 'Quiet Liquidation.' It started not with a bang, but with a series of cooling furnaces. Qenos, the nation’s last primary plastics manufacturer, went dark. To the Nominal Men, these were simply market corrections or shifts toward a service economy. But in the Physical OS, this was a Thermodynamic Divorce. A nation’s Sovereign Capability is mathematically tethered to its energy density and its ability to transform raw materials.\n\nWhen the grid frequency fell from 50Hz to 47Hz in seconds, the Digital OS had no answers. Without the 'Spine' of heavy spinning iron, the digital 'Virtue Nodes' disconnected to protect themselves. You cannot power a nation on empathy. You enter a state of Systemic Fragility, where your 'Housing Crisis' is now 100% dependent on the shipping lanes of a geopolitical rival. The divorce was final: reality moved out, and the narrative was left to pay the bills it couldn't afford."
    },
    {
      id: 2,
      title: "Chapter 2: The Empathy Filter",
      content: "As the industrial spine snapped, the internal organs of the state underwent a metamorphosis. The old Physical OS was replaced by the Therapeutic OS. In this regime, the primary KPI is Social Cohesion. The Nominal Man is the executive who survives through Appeasement. He adopts the Therapeutic Vernacular as a survival shield, attempting to manage the Narrative while the industrial capacity evaporates.\n\nIn the Therapeutic OS, the engineer who points out that a project is a thermodynamic fraud is no longer a truthteller; he is a 'Toxic Element' disrupting the collective vision. These were the departments of the Empathy Filter, where reality was processed into 'Socially Cohesive' fiction. The Nominal Man’s job was to suppress friction, ensuring that the 'Moral Ledger' stayed balanced even as the physical infrastructure rotted. Bureaucrats attempted to apply a Therapeutic Patch to a Mechanical Rupture, discovering too late that empathy does not generate megawatts."
    },
    {
      id: 3,
      title: "Chapter 3: The Subscription State",
      content: "The final stage is the transition to a Subscription State. Sovereignty is redefined as Managed Transition. We trade our Industrial Spine for high-tech subscriptions. The Nominal Man points to jets we can’t authorize and subs we can’t repair, all while celebrating Global Integration. This is the ultimate Sovereignty Trap: owning the asset but not the off-switch.\n\nWe have traded our Industrial Spine for a series of high-tech subscriptions. We are 'Sovereign Ready' only as long as our providers allow it. If the digital handshake from Fort Worth (F-35) or the 'Sealed Unit' maintenance (AUKUS) is withheld, the fleet becomes static aluminum. The 2027 Snap proved that a nation with no hardware spine is simply a tenant on its own land, waiting for a security update that never comes."
    },
    {
      id: 4,
      title: "Chapter 4: The Thermodynamic Recall",
      content: "When the lights flickered in 2027, the Narrative finally hit the wall. The Remnant didn't wait for Inclusion audits. They enacted the Engineer's Veto. This was the Thermodynamic Recall—a brutal realignment of policy with physics. We stopped managing the sentiment and started managing the kilowatts.\n\nThe first act was the immediate, unilateral suspension of the Moral Ledger. Every kilowatt of energy was no longer weighted by its 'Virtue Score'; it was measured by its physical utility. The Remnant seized control of gas flows, diverting them from export terminals and slamming them into thermal plants, ignoring Net Zero compliance software that attempted to throttle the turbines. They prioritized Physics over Narrative, realizing that a state without energy is not a state at all."
    },
    {
      id: 5,
      title: "Chapter 5: The Relighting of the Furnaces",
      content: "The restoration of a nation does not begin with a vote; it begins with a Phase Transition.\n\nIn the \"Therapeutic OS,\" materials like steel and polyethylene were treated as commodities—interchangeable inputs that could be sourced from anywhere as long as the \"Supply Chain Management\" software was green. But during the 2027 Snap, the nation realized that when the \"Metadata Boomerang\" stops coming back, an imported commodity becomes a Physical Impossibility. The Nominal Men had presided over the \"Clean Exit\" of manufacturing. They had framed the closure of Qenos and Oceania Glass as \"De-risking the Balance Sheet.\" But as the hospitals ran out of sterile IV bags (polymers) and the wind turbines stood shattered by summer storms (glass), the \"Risk\" was finally localized.\n\nThe Remnant understood that the \"Physical OS\" requires a Sovereign Spine. You cannot have a high-tech future if you cannot perform basic alchemy. The relighting of the furnace at Port Kembla was the symbolic end of the Hallucination. The \"Nominal\" executives had already drafted the \"Orderly Decommissioning\" plan. They had scheduled the \"Commemorative Closing Ceremony\" to celebrate the region's transition into a \"Tourism and Care Hub.\"\n\nThe Remnant ignored the schedule. They marched into the plant—engineers, retired foremen, and rogue unionists who still remembered how to read a pressure gauge without a digital dashboard. They didn't ask for a \"Sustainability Audit.\" They looked at the cooling slag and the failing refractories and they realized that if the hearth went cold, Australia would become a \"Vassal State of the Warehouse.\" They seized the coal stockpiles. They bypassed the \"Smart Meters\" that were trying to throttle the fans.\n\nWhen the first blast of heated air hit the coke, and the orange glow finally returned to the belly of the furnace, the Thermodynamic Recall became a physical reality. Using \"Pirated\" technical manuals and the raw ingenuity of the Competence Remnant, they jury-rigged a polymer line to replace the Qenos void. It wasn't \"Green.\" it wasn't \"Optimized for Inclusivity.\" It was loud, it was dirty, and it produced the long-chain hydrocarbons required to keep a civilization alive.\n\nThe Nominal Man at the Department of Industry attempted to file a \"Non-Compliance Report.\" He was physically escorted from the site by a foreman with forty years of \"Physical OS\" experience. The report was used as kindling for the boiler. The \"Relighting of the Furnaces\" taught the nation a brutal lesson: Value is not what you can trade; value is what you can make. By the end of 2027, the smoke rising from the industrial hubs wasn't seen as a \"Carbon Liability.\" It was seen as the Breath of the State. The Hallucination of the \"Service Economy\" had been incinerated. The Spine was being fused back together, one molten pour at a time."
    },
    {
      id: 6,
      title: "Chapter 6: The Engineer’s Veto",
      content: "Codified into the new constitution, the Veto granted the Chief Technical Officer the power to unilaterally strike down any policy violating the laws of thermodynamics or systemic redundancy. The Veto signaled that the era of 'Managing the Narrative' was over. From that moment on, every policy was measured by a clinical metric: Utility.\n\nDoes it work? Is it redundant? Can we sustain it ourselves? If the answer was 'No,' it didn't matter how inclusive it felt. It was Vetoed. This established a legal Veto over the laws of physics, ensuring that no administrative fantasy could ever again overrule a technical reality. The nation was no longer a conversation; it was a system managed by people who knew how it actually worked."
    },
    {
      id: 7,
      title: "Chapter 7: From 'Nominal' to 'Functional'",
      content: "By 2028, the \"Physical OS\" was no longer just a crisis response; it had become the mandatory architecture of the state. The Nominal Man—the leader who existed only to manage sentiment and maintain the appearance of progress—was no longer just an annoyance; he was a recognized systemic threat.\n\nThe first major undertaking of the New OS was the Institutional Purge. In the old \"Therapeutic OS,\" the Australian Public Service (APS) had bloated into a self-serving ecosystem of \"Narrative Management.\" Over 60% of the Senior Executive Service (SES) positions were dedicated to \"Communications,\" \"Stakeholder Relations,\" and \"Cultural Alignment.\" These were the departments of the Empathy Filter, where reality was processed into \"Socially Cohesive\" fiction.\n\nThe Functional Restoration began with a simple, binary audit of every government role: \"Does this position directly facilitate a physical output or a technical redundancy?\" If the answer was \"No,\" the role was abolished. The hundreds of millions of dollars previously spent on \"Brand Identity\" and \"Behavioural Nudges\" were redirected toward the Logistics and Operations divisions. The Nominal Men were not fired because of their politics; they were fired because of their Inutility. The system could no longer afford to pay a salary to someone whose primary skill was \"facilitating a conversation\" about a problem they didn't have the technical competence to solve.\n\nThe new \"Functional\" class was drawn from the Remnant. The Secretary of Energy was no longer a career bureaucrat with a degree in Communications; he was a former Grid Controller with thirty years of experience in frequency stability. The Head of Industry was not a \"Innovation Consultant\"; he was a former production manager from the defunct polymer plants who understood the chemistry of sovereignty. The \"HR Department\"—once the high priesthood of the Therapeutic OS—was dismantled. Recruitment was moved back to the Professional Guilds. You didn't get a job in the new APS by passing a \"Values Test\" or demonstrating \"Social Alignment.\" You got a job by passing a Competence Stress-Test.\n\nThe Functional Man was defined by Accountability to the Machine. In the old world, a failure was an opportunity for a \"Shared Learning Experience.\" In the New OS, a failure was a technical error that required a physical fix. If the frequency dropped or the steel pour failed, the person in charge was removed—not out of cruelty, but out of the necessity of Systemic Integrity. The shift was visible in the very language of the state. The \"Vibrant, Inclusive Future\" was replaced by \"24/7 Base-load Reliability.\" The \"Human-Centred Approach\" was replaced by \"Component Redundancy.\" The \"Functional\" class understood a truth the Nominal Men never could: True empathy is a bridge that doesn't collapse and a grid that doesn't fail. By purging the narrative managers, the state had finally aligned its leadership with the laws of the physical world."
    },
    {
      id: 8,
      title: "Chapter 8: The Silicon Insurgency",
      content: "In the 'Therapeutic OS,' silicon was treated as a magical, invisible utility. The Nominal Men believed that 'Sovereignty' could be achieved by hosting foreign-made chips in Australian-owned sheds. They ignored the fact that every operation performed by those chips was governed by firmware and instruction sets owned by corporations in Santa Clara or Shanghai.\n\nThe Silicon Insurgency was the moment the 'Remnant' realized that a nation without its own logic gates is a nation with no mind of its own. It began with the Firmware Seizure. During the 2027 Snap, critical Australian systems locked up waiting for 'Security Updates' that never came. The Remnant—rogue software engineers and embedded systems specialists—began a systematic process of Clean-Room Reverse Engineering.\n\nThey replaced proprietary, tethered firmware with open-source, local-first kernels. They stripped out the telemetry that leaked metadata offshore. The Functional State redirected billions into the construction of 'The Sovereign 28'—a foundry for 28-nanometer spine chips. They weren't the fastest in the world, but they were the only ones without a foreign 'Kill Switch.' The mind of the nation was finally back in the body of the nation. Digital Sovereignty is a Hardware Problem."
    },
    {
      id: 9,
      title: "Chapter 9: The Sovereign Reality",
      content: "By 2030, the transformation was complete. Australia had ceased to be a 'Vassal Warehouse'—a vast, hollowed-out continent storing foreign-made goods in sheds paid for with raw ore. It had become a Sovereign Reality. Independence is exactly equal to the length of its domestic supply chains. The Nominal Men bragged about 'Global Integration,' but the Remnant viewed it as a Leash.\n\nThe final act was the Closing of the Loop. The grid was no longer a fragile web of virtue-signaling intermittency; it was a high-inertia machine fueled by domestic gas, coal-with-capture, and SMRs. With Port Kembla pouring sovereign steel and chemical clusters producing complex polymers, the housing and infrastructure gaps were no longer political talking points; they were engineering problems with local solutions.\n\nThe hero of the new era was the Functional Man: the one who could design the part, code the logic, and fix the machine when it broke. The 'Sovereign Reality' meant that for the first time in a century, the 'Off-Switch' for the Australian state was located in Australia. The hallucination was over. The nation was no longer a 'Conversation.' It was a Powerhouse."
    },
    {
      id: 10,
      title: "Chapter 10: The Global Contagion",
      content: "By 2031, the world was no longer looking at Australia as a 'Vassal Warehouse'—a vast, hollowed-out continent storing foreign-made goods in sheds paid for with raw ore. It had become the Zero-Point of the Great Restoration. The 'Therapeutic OS' was not an Australian localized bug; it was a global pandemic that had hollowed out the industrial spines of the UK, Canada, and Western Europe. These nations were still trapped in the 'Subscription Loop,' their grids flickering and their 'Nominal Men' still drafting 'Social Cohesion' reports as their manufacturing bases vanished.\n\nThe Global Contagion was the spread of the Remnant Model. It began when the 'Subscription Providers' in the US and Europe realized they could no longer 'Veto' Australian interests. When Australia jailbroke the F-35s and began producing its own Sovereign Silicon, it broke the monopoly of the 'Digital Umbilical Cord.' Other 'Tenant States' took notice. The Functional State in Australia did not export 'Values' or 'Narratives.' It exported Blueprints and Logic Gates. The Australian Remnant began a series of 'Hard-Asset Exchanges' with the emerging realists in the UK and Canada. They didn't trade 'Carbon Credits'; they traded Foundry Designs and Grid-Inertia Software. They shared the blueprints for the 'Engineer’s Veto,' showing other nations how to legally decapitate their own unproductive bureaucracies.\n\nThe Nominal Men of the global institutions—the UN, the WEF, the IMF—attempted to sanction the Australian model. They called it 'Deglobalization' and 'Technical Isolationism.' They warned that Australia was 'abandoning the shared standards of the international community.' The Australian CTO—now the de-facto architect of the new world—responded with a single, televised message: 'We haven't abandoned standards. We have returned to the only standard that matters: The ability to sustain a human life without a foreign permission slip. If your International Standards require us to have a cold furnace and a dead grid, then your standards are a suicide pact. We choose the furnace.'\n\nThis was the 'Contagion.' It was the infectious realization that Sovereignty is contagious. One by one, the 'Subscription States' began to fracture. In the UK, a 'Remnant' movement within the North Sea energy sector seized control of the offshore assets, citing the 'Engineer’s Veto.' In Canada, the mining and smelting regions began to 'Load-Shed' the administrative centers in Ottawa to keep the primary smelters alive. The 'Global Contagion' was the death of the Franchise Model of Civilization. The world was shifting from a monolithic, cloud-tethered 'Subscription' back to a constellation of Hard-Wired Sovereignties. The Australian 'Remnant' had proved that the 'Nominal Man' was not inevitable. You could purge the narrative managers. You could relight the furnaces. You could jailbreak the code. You could stand on your own spine. As the lights of the 'Remnant Nodes' began to glow across the northern hemisphere, the 'Therapeutic OS' finally understood its fate. It wasn't being defeated by an army; it was being rendered obsolete by a machine that finally knew how to run itself."
    }
  ];

  const handleDeconstruct = async () => {
    if (!deconInput.trim()) return;
    setIsDeconLoading(true);
    const systemPrompt = `${REMNANT_KNOWLEDGEBASE}\nROLE: Remnant Engineer. TASK: Deconstruct nominal text into functional reality. STYLE: Brutalist.`;
    try {
      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: deconInput }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      setDeconResult(data.candidates?.[0]?.content?.parts?.[0]?.text || "ANALYSIS_FAILED");
    } catch (err) { setDeconResult("ERROR: API_FAILURE"); } finally { setIsDeconLoading(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput("");
    setIsChatLoading(true);
    const systemPrompt = `${REMNANT_KNOWLEDGEBASE}\nROLE: Remnant Engineer. TONE: Concise, technical.`;
    try {
      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: chatInput }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      setChatMessages(prev => [...prev, { role: "assistant", content: data.candidates?.[0]?.content?.parts?.[0]?.text || "SIGNAL_LOST" }]);
    } catch (err) { setChatMessages(prev => [...prev, { role: "assistant", content: "ERROR: LINK_STALLED" }]); } finally { setIsChatLoading(false); }
  };

  const handleTts = async (text) => {
    setIsTtsLoading(true);
    try {
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Say in a deep industrial voice: ${text}` }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } }
        })
      });
      const pcmBase64 = response.candidates[0].content.parts[0].inlineData.data;
      const sampleRate = parseInt(response.candidates[0].content.parts[0].inlineData.mimeType.match(/rate=(\d+)/)?.[1] || "24000");
      const audio = new Audio(URL.createObjectURL(pcmToWav(pcmBase64, sampleRate)));
      audio.play();
    } catch (err) { console.error(err); } finally { setIsTtsLoading(false); }
  };

  const pcmToWav = (base64, sampleRate) => {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length + 44);
    const view = new DataView(buffer);
    const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
    writeString(0, 'RIFF'); view.setUint32(4, 32 + binary.length, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
    view.setUint32(40, binary.length, true);
    for (let i = 0; i < binary.length; i++) view.setUint8(44 + i, binary.charCodeAt(i));
    return new Blob([buffer], { type: 'audio/wav' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 300;
      chapters.forEach(ch => {
        const el = document.getElementById(`chapter-${ch.id}`);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveChapter(ch.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-zinc-100 transition-colors duration-1000 ${isFunctional ? 'bg-[#050505]' : 'bg-[#0a0a0a]'}`}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-50" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-[12px] animate-scanline" />
      </div>

      <header className="fixed top-0 left-0 right-0 h-16 border-b border-zinc-800 bg-black/90 backdrop-blur-xl z-[60] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center border border-zinc-600 bg-zinc-900 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
            <Zap className={`w-4 h-4 ${isFunctional ? 'text-orange-500 animate-pulse' : 'text-zinc-400'}`} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-mono text-sm font-black tracking-tighter leading-none text-white uppercase text-balance">Return_of_the_Engineer</h1>
            <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase font-bold">Terminal_OS_Deconstruction</span>
          </div>
        </div>
        <GridTelemetry isFunctional={isFunctional} />
        <div className="flex items-center gap-4">
          <button onClick={() => setIsFunctional(!isFunctional)} className={`flex items-center gap-3 px-4 py-2 border-2 font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${isFunctional ? 'bg-orange-600 border-orange-400 text-black shadow-[0_0_20px_rgba(234,88,12,0.6)]' : 'bg-zinc-800 border-zinc-600 text-zinc-100'}`}>
            <Power className="w-3 h-3" /> {isFunctional ? 'VETO_ENGAGED' : 'ENGAGE_VETO'}
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-zinc-700 bg-zinc-900"><Menu className="w-5 h-5" /></button>
        </div>
      </header>

      <div className={`fixed inset-y-0 right-0 w-96 bg-black border-l border-zinc-800 z-[100] transform transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-xs text-zinc-300 font-bold">REMNANT_TOOLKIT</span>
            <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          <nav className="mb-10 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            <span className="block font-mono text-[9px] text-zinc-600 mb-2 tracking-widest uppercase">Navigation_Manifest</span>
            {chapters.map((ch) => (
              <a key={ch.id} href={`#chapter-${ch.id}`} onClick={() => setIsSidebarOpen(false)} className={`block p-2 border border-zinc-900 font-mono text-[10px] uppercase tracking-tighter ${activeChapter === ch.id ? 'text-orange-500 border-orange-900/30' : 'text-zinc-500'}`}>
                {ch.id === 0 ? "PREFACE" : `CH_${ch.id}: ${ch.title.split(':')[0]}`}
              </a>
            ))}
          </nav>
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500 font-mono tracking-widest border-b border-zinc-800 pb-2"><Sparkles className="w-3 h-3" /> REALITY_DECONSTRUCTOR</div>
            <textarea value={deconInput} onChange={(e) => setDeconInput(e.target.value)} placeholder="Paste nominal text..." className="w-full h-32 bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 focus:outline-none" />
            <button onClick={handleDeconstruct} disabled={isDeconLoading} className="w-full py-3 bg-zinc-100 text-black font-mono text-[10px] font-black uppercase hover:bg-orange-500 transition-colors flex items-center justify-center gap-2">
              {isDeconLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} DECONSTRUCT
            </button>
            {deconResult && <div className="mt-4 p-3 bg-zinc-950 border border-orange-900/30 text-[10px] font-mono text-orange-200">{deconResult}</div>}
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 font-mono tracking-widest border-b border-zinc-800 pb-2 mb-4"><MessageSquare className="w-3 h-3" /> NEURAL_LINK</div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`p-3 text-[10px] font-mono ${msg.role === 'user' ? 'bg-zinc-900/50 border-l border-zinc-600' : 'bg-blue-950/20 border-l border-blue-600'}`}>
                  <span className="block font-bold mb-1 opacity-50 uppercase">{msg.role === 'user' ? 'You' : 'Remnant'}</span> {msg.content}
                </div>
              ))}
              {isChatLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500 mx-auto" />}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask about the Grid..." className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 text-[10px] font-mono focus:outline-none" />
              <button onClick={handleChat} className="px-3 py-2 bg-blue-600 text-white font-mono text-[10px] font-bold">SEND</button>
            </div>
          </div>
        </div>
      </div>

      <main className="pt-40 px-6 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        <aside className="hidden lg:block w-72 sticky top-40 h-fit">
          <div className="border-l-2 border-zinc-800 pl-6 space-y-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Activity className="w-4 h-4" /> <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-zinc-300">System_Sync</span>
              </div>
              <div className="space-y-4">
                {[{ label: "Neural Load", val: isChatLoading ? "BUSY" : "IDLE" }, { label: "Decon Probe", val: isDeconLoading ? "ANALYZING" : "READY" }, { label: "Reality Filter", val: isFunctional ? "DISABLED" : "ENABLED" }].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="font-mono text-[10px] text-zinc-500">{stat.label}</span>
                    <span className={`font-mono text-[10px] font-black ${stat.val === 'ANALYZING' ? 'text-orange-500' : 'text-zinc-200'}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 max-w-2xl">
          <div className="mb-40 border-b-4 border-zinc-800 pb-20">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none text-white tracking-tighter uppercase">
              <VetoText isFunctional={isFunctional}>The Return of The Engineer</VetoText>
            </h1>
            <p className="text-xl md:text-2xl font-mono text-orange-500 font-bold uppercase tracking-tight italic">
              <VetoText isFunctional={isFunctional}>And the Terminal Collapse of the Nominal Man</VetoText>
            </p>
            <div className="mt-12 flex gap-4">
               <span className="px-3 py-1 border border-zinc-700 font-mono text-[10px] text-zinc-500">2027_REMNANT_EDITION</span>
               <span className="px-3 py-1 border border-zinc-700 font-mono text-[10px] text-zinc-500">PHYSICAL_OS_COMPLIANT</span>
            </div>
          </div>

          {chapters.map((ch) => (
            <div key={ch.id} id={`chapter-${ch.id}`} className="mb-32">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className={`h-px w-24 ${isFunctional ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                   <span className="font-mono text-xs text-zinc-500 font-bold uppercase">{ch.id === 0 ? "Preface" : `Chapter_0${ch.id}`}</span>
                </div>
                <div className="flex items-center gap-4">
                  {ch.id === 5 && (
                    <div className="p-1 border border-zinc-800 bg-zinc-900 flex items-center gap-2 pr-3">
                       <Download className="w-3 h-3 text-zinc-500" />
                       <span className="font-mono text-[8px] text-zinc-500 uppercase">IMG_REF: STEELMAKING_PROCESS</span>
                    </div>
                  )}
                  <button onClick={() => handleTts(ch.content)} className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 hover:text-white">
                    {isTtsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />} VOCAL_SYNC
                  </button>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white uppercase italic">
                <VetoText isFunctional={isFunctional}>{ch.title}</VetoText>
              </h2>
              <div className="prose prose-invert max-w-none prose-p:text-zinc-200 prose-p:text-lg">
                {ch.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed mb-6">
                    <VetoText isFunctional={isFunctional}>{paragraph}</VetoText>
                  </p>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-40 border-t-2 border-zinc-800 pt-20 text-center">
            <h3 className="font-mono text-2xl font-black mb-4 text-zinc-400 uppercase tracking-[0.2em] italic">Reality is Non-Negotiable</h3>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest font-bold">End of Manifest // Archive_Closed</p>
          </div>
        </section>

        <aside className="hidden xl:block w-40 sticky top-40 h-fit">
          <div className="h-[500px] w-full flex flex-col justify-between items-center py-4 border-l border-r border-zinc-900">
            {/* Spine segments mapped to 11 chapters (0-10) */}
            {[...Array(11)].map((_, i) => (
              <div key={i} className={`w-12 h-4 border-2 transition-all duration-500 ${i <= activeChapter ? (isFunctional ? 'border-orange-500 bg-orange-950/40 shadow-[0_0_10px_orange]' : 'border-zinc-500 bg-zinc-800') : 'border-zinc-900 bg-transparent'}`} />
            ))}
          </div>
          <div className="text-center mt-6">
            <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Spine_Sync</span>
          </div>
        </aside>
      </main>

      <footer className="lg:hidden fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-zinc-800 px-6 flex items-center justify-between z-50 text-[10px] font-mono text-zinc-500 uppercase">
        <span>Remnant_Node</span> <button onClick={() => setIsSidebarOpen(true)} className="text-orange-500 font-bold">Toolkit</button>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(800%); } }
        .animate-scanline { animation: scanline 8s linear infinite; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; }
        ::selection { background: #FF4500; color: white; }
      `}} />
    </div>
  );
}