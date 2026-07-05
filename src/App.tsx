import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
Send,
  Database,
  Sparkles,
  DollarSign,
  Heart,
  Smile,
  TrendingUp,
  Coins,
  TrendingDown,
  RefreshCw,
  CheckCircle2,
  Copy,
  Plus,
  PiggyBank,
  CreditCard,
  Lock,
  ShoppingBag,
  Trash2,
  BookOpen,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  User,
  Coffee,
  CalendarDays,
  LayoutDashboard,
  Star,
  PartyPopper,
  TrendingDown as TrendingDownIcon,
  Rocket,
  Bot,
  Hand,
  Zap,
  Target
} from "lucide-react";
import { CFOAnalysis, ChatMessage, DBUser, DBCommitment, DBSession } from "./types";

export default function App() {
  // State for active simulated database tables
  const [users, setUsers] = useState<DBUser[]>([]);
  const [commitments, setCommitments] = useState<DBCommitment[]>([]);
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [loadingDb, setLoadingDb] = useState<boolean>(false);

  // Active analysis displayed in the main wellness plan panel
  const [activeAnalysis, setActiveAnalysis] = useState<CFOAnalysis>({
    essentialNeedsBudget: 18000,
    commitmentsSummary: 17500,
    familyHappinessBudget: 2500,
    mentalWellbeingBudget: 1500,
    savingsBuffer: 5000,
    financialWellnessScore: 68,
    potentialSavings: [
      {
        category: "Groceries & Provisioning",
        currentEstimate: 4500,
        suggestion: "Buy staples and rice in bulk from Uzhavar Sandhai (Tamil Nadu farmer markets) or local wholesalers instead of ordering through quick-commerce apps.",
        potentialSaveAmount: 700
      },
      {
        category: "Subscription Packages",
        currentEstimate: 999,
        suggestion: "Consolidate active streaming channels, rotate memberships month-on-month, and cancel unutilized services.",
        potentialSaveAmount: 300
      },
      {
        category: "Food Delivery & Dining",
        currentEstimate: 3000,
        suggestion: "Switch weekend restaurant deliveries with classic local Tamil Nadu homemade delicacies or quick tiffin options.",
        potentialSaveAmount: 800
      }
    ],
    summaryText: "CFO Recommendation: High fixed commitments leave minimal safety buffer. By optimizing groceries, you can unlock ₹1,800/month to fuel a compounded Tamil Nadu triple asset plan.",
    investmentStrategy: {
      sip: {
        monthlyAllocation: 2500,
        pros: [
          "Compound growth targeting average 12-15% annual long-term returns",
          "Automated rupee-cost averaging shields you from market-timing errors",
          "Extremely liquid - access funds within 2-3 working days in emergencies"
        ],
        cons: [
          "Subject to market volatility - short term values will fluctuate",
          "No guaranteed returns unlike fixed deposits or post office schemes"
        ],
        note: "A monthly SIP of ₹2,500 compounding at 12% is projected to grow to approximately ₹2.5 Lakhs in 10 years, and ₹5.5 Lakhs in 15 years, securing your child's higher education at premier state institutes like Anna University or PSG."
      },
      postOffice: {
        monthlyAllocation: 1500,
        pros: [
          "100% sovereign guarantee backed by the Government of India",
          "PPF interest is completely tax-free under Section 80C",
          "No market risk, stable interest rates revised quarterly"
        ],
        cons: [
          "Slightly lower return compared to equity mutual funds",
          "Strict lock-in periods (e.g., 15 years for PPF, 5 years for RD)"
        ],
        note: "Highly secure option. Perfect for locking in child safety pots or backing up high-yield equity bets with pristine sovereign trust."
      },
      gold: {
        monthlyAllocation: 1000,
        pros: [
          "Generational safety net with a massive cultural demand in Tamil Nadu",
          "Perfect hedge against inflation and currency depreciation",
          "Can be pledged instantly for quick agricultural or personal emergency loans"
        ],
        cons: [
          "Physical gold incurs making/wastage charges and storage security risks",
          "Sovereign Gold Bonds (SGB) are highly optimal but have lock-in periods"
        ],
        note: "Aligns with Chennai/Tamil Nadu's rich gold savings discipline. Accumulates solid tangible security that shields your household during general economic downturns."
      },
      drasticInactionConsequences: "⚠️ DANGER OF INACTION: If you do not start saving ₹5,000 now, inflation (currently ~5.5% in India) will reduce the purchasing power of your idle money by 50% in just 12 years. If an unexpected medical crisis or school fee hike hits, you run a high risk of falling into local private loan traps (interest rates ranging from 24% to 36% per annum), leading to a severe, stressful debt spiral that puts your family's daily peace and your children's higher education in jeopardy.",
      actionBenefits: "✨ POWER OF ACTION: Securing this triple allocation immediately cushions your household against inflation. Your gold acts as an instant shield, the Post Office provides an ironclad safety net, and your Mutual Fund SIP compounds quietly in the background. In 15 years, you will have created a multi-lakh safety buffer that guarantees absolute mental tranquility, funds premier education, and gives your family unmatched social freedom."
    }
  });

  // Client-side visual optimization simulator variables (grocery sliders/checklists)
  const [checkedSavings, setCheckedSavings] = useState<boolean[]>([true, true, true]);
  const [familySalaryInput, setFamilySalaryInput] = useState<number>(50000);
  const [familySizeInput, setFamilySizeInput] = useState<number>(4);
  const [activeTab, setActiveTab] = useState<"dashboard" | "premium">("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [language, setLanguage] = useState<"english" | "tamil" | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userPhone && userEmail) {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, phone: userPhone, email: userEmail })
        });
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('jwtToken', data.token);
        }
      } catch (error) {
        console.error("Failed to register:", error);
      }
      setIsLoggedIn(true);
      setShowLoginModal(false);
    }
  };

  const saveChatHistory = async (sender: 'user' | 'bot', messageText: string) => {
    try {
      await fetch('/api/save-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName,
          phone: userPhone,
          sender_type: sender,
          message_text: messageText
        })
      });
    } catch (e) {
      console.error(e);
    }
  };
  const [dashboardSubTab, setDashboardSubTab] = useState<"budget" | "investments" | "inaction">("budget");
  const [sipPercent, setSipPercent] = useState<number>(50);

  // Chatbot flow states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      sender: "bot",
      text: "Saranam! Welcome to Lakshi. Let's create your personalized family financial plan in 30 seconds.",
      timestamp: "10:30 AM"
    },
    {
      id: "m-1",
      sender: "bot",
      text: "What is your monthly household income (Salary)?",
      timestamp: "10:30 AM"
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [botStep, setBotStep] = useState<"salary" | "family" | "commitments" | "ready">("salary");

  // Temporary chat inputs to build analysis
  const [tempSalary, setTempSalary] = useState<number | string>(50000);
  const [tempFamilySize, setTempFamilySize] = useState<number | string>(4);
  const [tempCommitments, setTempCommitments] = useState<{ name: string; amount: number }[]>([]);
  const [newCommitmentName, setNewCommitmentName] = useState<string>("");
  const [newCommitmentAmount, setNewCommitmentAmount] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch db state on load
  const fetchDbState = async () => {
    setLoadingDb(true);
    try {
      const response = await fetch("/api/db-state");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setCommitments(data.commitments || []);
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching simulated database state:", error);
    } finally {
      setLoadingDb(false);
    }
  };

  const resetDbState = async () => {
    setLoadingDb(true);
    try {
      const response = await fetch("/api/db-reset", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setCommitments(data.commitments);
        setSessions(data.sessions);
        // Reset displayed analysis to default seed
        if (data.sessions.length > 0) {
          setActiveAnalysis(JSON.parse(data.sessions[0].analysis));
        }
      }
    } catch (error) {
      console.error("Error resetting database state:", error);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchDbState();
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetch('/api/verify', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsLoggedIn(true);
          setShowLoginModal(false);
          setUserName(data.user.name || "");
          setUserPhone(data.user.phone || "");
          setUserEmail(data.user.email || "");
        }
      }).catch(err => console.error("JWT verify failed", err));
    }
  }, []);

  // Scroll chat window to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle auto-simulation flow presets
  const runPresetFlow = async () => {
    // Completely automate a sample WhatsApp workflow in sequence!
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    setChatMessages([
      { id: "p-0", sender: "bot", text: "Saranam! Welcome to Lakshi. Let's create your personalized family financial plan in 30 seconds.", timestamp: "Just now" },
      { id: "p-1", sender: "bot", text: "What is your monthly household income (Salary)?", timestamp: "Just now" }
    ]);
    setBotStep("salary");
    await sleep(1000);

    // User inputs salary
    setChatMessages(prev => [...prev, { id: "p-u1", sender: "user", text: "65000", timestamp: "Just now" }]); saveChatHistory('user', '65000');
    setTempSalary(65000);
    setBotStep("family");
    await sleep(1200);

    setChatMessages(prev => [...prev, {
      id: "p-b2",
      sender: "bot",
      text: "Got it! ₹65,000 monthly income. How many members are in your family?",
      timestamp: "Just now"
    }]);
    await sleep(1000);

    // User inputs family size
    setChatMessages(prev => [...prev, { id: "p-u2", sender: "user", text: "3", timestamp: "Just now" }]); saveChatHistory('user', '3');
    setTempFamilySize(3);
    setBotStep("commitments");
    await sleep(1200);

    setChatMessages(prev => [...prev, {
      id: "p-b3",
      sender: "bot",
      text: "Perfect, a family of 3. Now enter your recurring monthly commitments (like Rent, Loans, Insurance, School Fees).\nFormat example: 'Rent 15000, EMI 4000, School Fee 2500'",
      timestamp: "Just now"
    }]);
    await sleep(1200);

    // User inputs commitments
    const customCommitments = [
      { name: "Rent", amount: 15000 },
      { name: "EMI", amount: 4000 },
      { name: "School Fee", amount: 2500 }
    ];
    setTempCommitments(customCommitments);

    setChatMessages(prev => [...prev, { id: "p-u3", sender: "user", text: "Rent 15000, EMI 4000, School Fee 2500", timestamp: "Just now" }]); saveChatHistory('user', 'Rent 15000, EMI 4000, School Fee 2500');
    setBotStep("ready");

    const loadingId = "p-loading";
    setChatMessages(prev => [...prev, { id: loadingId, sender: "bot", text: "Synthesizing Home CFO report. Balancing needs, child commitments, and calculating happiness buffer...", timestamp: "Just now", loading: true }]);
    await sleep(2000);

    // Request actual server-side analysis
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+91 95440 98712",
          salary: 65000,
          family_size: 3,
          commitments: customCommitments
        })
      });

      if (response.ok) {
        const result = await response.json();
        const analysisData: CFOAnalysis = result.data;

        setChatMessages(prev => prev.filter(m => m.id !== loadingId));
        setChatMessages(prev => [...prev, {
          id: `p-report-${Date.now()}`,
          sender: "bot",
          text: `📋 *Home CFO Report generated successfully!* Here's a quick look:\n\n• Income: ₹65,000\n• Commitments: ₹21,500\n• Essential Budget: ₹${analysisData.essentialNeedsBudget}\n• Savings Buffer: ₹${analysisData.savingsBuffer}\n\nCheck the dashboard panel on the left to explore the interactive visual breakdown, check leakages, and track your Family Happiness index!`,
          timestamp: "Just now",
          report: analysisData
        }]);

        setActiveAnalysis(analysisData);
        fetchDbState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Custom user text message submission
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    const newMsgId = `m-u-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updatedMessages = [...chatMessages, { id: newMsgId, sender: "user" as const, text: userMsg, timestamp: userTimestamp }];
    setChatMessages(updatedMessages);
    setInputMessage("");
    saveChatHistory("user", userMsg);

    const loadingId = `loading-${Date.now()}`;
    setChatMessages(prev => [...prev, {
      id: loadingId,
      sender: "bot",
      text: "...",
      timestamp: userTimestamp,
      loading: true
    }]);

    await new Promise(r => setTimeout(r, 600));

    if (botStep === "salary") {
      setTempSalary(userMsg);
      setBotStep("family");
      setChatMessages(prev => prev.filter(m => m.id !== loadingId));
      const nextMsg = language === 'tamil' ? "உங்கள் குடும்பத்தில் மொத்தம் எத்தனை நபர்கள்?" : "How many members are in your family?";
      setChatMessages(prev => [...prev, { id: `m-rep-${Date.now()}`, sender: "bot", text: nextMsg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      saveChatHistory("bot", nextMsg);
      return;
    }

    if (botStep === "family") {
      setTempFamilySize(userMsg);
      setBotStep("commitments");
      setChatMessages(prev => prev.filter(m => m.id !== loadingId));
      const nextMsg = language === 'tamil' ? "உங்களுடைய மாத செலவுகள், வாடகை, EMI போன்றவற்றை கூறவும் (உதா: வாடகை 12000, EMI 2500)." : "Please enter your fixed commitments like Rent, EMI, Fees (e.g., Rent 12000, EMI 2500).";
      setChatMessages(prev => [...prev, { id: `m-rep-${Date.now()}`, sender: "bot", text: nextMsg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      saveChatHistory("bot", nextMsg);
      return;
    }

    if (botStep === "commitments") {
      const customCommitments = userMsg.split(",").map(part => {
        const nameMatch = part.match(/[a-zA-Z\s]+/);
        const numMatch = part.match(/\d+/);
        return {
          name: nameMatch ? nameMatch[0].trim() : "Other",
          amount: numMatch ? parseInt(numMatch[0], 10) : 0
        };
      });
      setTempCommitments(customCommitments);
      setBotStep("ready");
      setChatMessages(prev => prev.filter(m => m.id !== loadingId));
      const nextMsg = language === 'tamil' ? "கொஞ்சம் காத்திருக்கவும்... உங்கள் தகவல்களை பகுப்பாய்வு செய்கிறேன்." : "Synthesizing Home CFO report. Balancing needs, child commitments, and calculating happiness buffer...";
      
      const newLoadingId = "final-loading";
      setChatMessages(prev => [...prev, { id: newLoadingId, sender: "bot", text: nextMsg, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), loading: true }]);
      saveChatHistory("bot", nextMsg);

      try {
        const analyzeRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: userPhone,
            salary: tempSalary,
            family_size: tempFamilySize,
            commitments: customCommitments
          })
        });

        if (analyzeRes.ok) {
          const analyzeResult = await analyzeRes.json();
          setChatMessages(prev => prev.filter(m => m.id !== newLoadingId));
          const finalMsg = analyzeResult.data?.botMessage || (language === 'tamil' ? "உங்கள் அறிக்கை தயாராக உள்ளது!" : "Your report is ready!");
          setChatMessages(prev => [...prev, {
            id: `m-rep-${Date.now()}`,
            sender: "bot",
            text: finalMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            report: analyzeResult.data
          }]);
          saveChatHistory("bot", finalMsg);
          setActiveAnalysis(analyzeResult.data || analyzeResult);
          fetchDbState();
        }
      } catch (error) {
        console.error("Failed to fetch full analysis:", error);
      }
      return;
    }
  };

  // Helper to calculate total opportunity savings
  const calculateOptimizedSavings = () => {
    let sum = 0;
    activeAnalysis.potentialSavings.forEach((saving, idx) => {
      if (checkedSavings[idx]) {
        sum += saving.potentialSaveAmount;
      }
    });
    return sum;
  };

  // Pre-fill fields for adding custom commitments manually to dashboard to test math
  const handleAddCommitmentDirectly = () => {
    const amount = Number(newCommitmentAmount);
    if (!newCommitmentName || !amount) return;

    const updatedCommitments = [
      ...tempCommitments,
      { name: newCommitmentName, amount }
    ];

    setTempCommitments(updatedCommitments);
    setNewCommitmentName("");
    setNewCommitmentAmount("");
  };

  const handleApplyDirectly = async () => {
    // Generate report instantly using the sidebar state
    setLoadingDb(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+91 90000 00000",
          salary: familySalaryInput,
          family_size: familySizeInput,
          commitments: tempCommitments.length > 0 ? tempCommitments : [
            { name: "Rent", amount: 12000 },
            { name: "School Fees", amount: 3000 }
          ]
        })
      });

      if (response.ok) {
        const result = await response.json();
        setActiveAnalysis(result.data);
        fetchDbState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDb(false);
    }
  };

  // Toggle checklist for leakages
  const toggleSavingIndex = (index: number) => {
    const next = [...checkedSavings];
    next[index] = !next[index];
    setCheckedSavings(next);
  };

  // SQL Script text to copy
  const supabaseSQLCode = `-- Create Supabase Schema for Day 1 Lakshi
-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  family_size INTEGER NOT NULL DEFAULT 2,
  salary NUMERIC NOT NULL CHECK (salary >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Commitments Table
CREATE TABLE IF NOT EXISTS commitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0)
);

-- 3. Create Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for WhatsApp client notifications
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE commitments;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;`;

  return (
    <div id="home_cfo_root" className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Top Premium Navigation bar using 'Vibrant Palette' Indigo palette */}
      <header id="app_header" className="bg-[#4F46E5] h-16 px-4 md:px-8 flex items-center justify-between text-white shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
            <div className="w-4 h-4 bg-[#4F46E5] rounded-md animate-pulse"></div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight block">
              LyKSpire <span className="font-light text-indigo-100">Lakshi</span>
            </span>
          </div>
        </div>
        {isLoggedIn && (
          <button onClick={() => { localStorage.removeItem('jwtToken'); window.location.reload(); }} className="text-[10px] bg-indigo-700 px-2 py-1 rounded ml-2 hover:bg-indigo-800">
            Logout
          </button>
        )}

        {/* Dynamic navigation & simulation badges */}
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden md:inline bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            WhatsApp Cloud API Online
          </span>
          <button
            onClick={runPresetFlow}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-tight shadow-md transition-all flex items-center gap-1"
            title="Simulates standard user sending messages on WhatsApp"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Auto-Flow
          </button>
        </div>
      </header>

      {/* Main Workspace split into Dashboard and right pane (Chat & Premium) */}
      <main id="app_workspace" className="flex-1 p-3 md:p-6 grid grid-cols-12 gap-6 max-w-[1600px] w-full mx-auto">
        
        {/* Left Interactive Column (Main analysis dashboard or Database state viewer) */}
        <section id="left_panel" className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs header inside the main frame to navigate functionality */}
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-[#4F46E5] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 inline-block mr-1"/> Financial Wellness Plan
              </button>
              
              <button
                onClick={() => setActiveTab("premium")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === "premium"
                    ? "bg-[#4F46E5] text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Star className="w-4 h-4 text-amber-500 inline-block mr-1"/> Monetization Tiers
              </button>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Live App State
            </div>
          </div>

          {/* ACTIVE TAB: DASHBOARD (Home CFO Report) */}
          {activeTab === "dashboard" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col gap-6 relative overflow-hidden transition-all duration-300">
              
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                      Lakshi
                    </span>
                    <span className="text-xs text-slate-400">• Dynamic Assessment</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                    Monthly Family Budget Plan
                  </h1>
                  <p className="text-slate-500 text-xs font-medium mt-1">
                    Custom financial wellness simulation mapping realistic household budgets.
                  </p>
                </div>

                {/* Score Dial Wrapper */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Ring background */}
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-slate-200"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-emerald-500 transition-all duration-500"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 * (1 - activeAnalysis.financialWellnessScore / 100)}
                      />
                    </svg>
                    <span className="text-sm font-black text-slate-800">
                      {activeAnalysis.financialWellnessScore}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wellness Score</p>
                    <p className="text-xs font-black text-emerald-600">
                      {activeAnalysis.financialWellnessScore >= 75 ? "Excellent Status" : "Healthy Status"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Key Figures Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Monthly Income</p>
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-3xl font-black text-[#4F46E5]">
                    ₹{(activeAnalysis.essentialNeedsBudget + activeAnalysis.commitmentsSummary + activeAnalysis.familyHappinessBudget + activeAnalysis.mentalWellbeingBudget + activeAnalysis.savingsBuffer).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Combined family pool</p>
                </div>

                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Fixed Commitments</p>
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-3xl font-black text-rose-500">
                    ₹{activeAnalysis.commitmentsSummary.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">EMIs, rent, utilities, fees</p>
                </div>

                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Savings Buffer</p>
                    <PiggyBank className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-3xl font-black text-emerald-500">
                    ₹{activeAnalysis.savingsBuffer.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Emergency & safe buffer</p>
                </div>
              </div>

              {/* Dashboard Sub-Tabs */}
              <div className="flex gap-2 border-b border-slate-200 pb-2 mb-2 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setDashboardSubTab("budget")}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                    dashboardSubTab === "budget"
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  📋 Budget Allocations & Leakages
                </button>
                <button
                  onClick={() => setDashboardSubTab("investments")}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                    dashboardSubTab === "investments"
                      ? "bg-slate-800 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  💰 TN Strategic Savings (SIP, PO, Gold)
                </button>
                <button
                  onClick={() => setDashboardSubTab("inaction")}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                    dashboardSubTab === "inaction"
                      ? "bg-rose-600 text-white shadow-md animate-pulse"
                      : "text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                  }`}
                >
                  ⚠️ Cost of Inaction (Drastic Warning)
                </button>
              </div>

              {/* Sub-tab 1: Budget Allocations & Leakages */}
              {dashboardSubTab === "budget" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#4F46E5] rounded-full"></span>
                      Suggested Category Allocations
                    </h3>
                    
                    {/* Visual allocation bars stack */}
                    <div className="space-y-3.5">
                      {/* Essential Needs */}
                      <div className="p-3 bg-indigo-50/70 hover:bg-indigo-50 rounded-xl transition-all border border-indigo-100/30">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Coffee className="w-4 h-4 inline-block mr-1 text-indigo-500"/> Essential Needs
                          </span>
                          <span className="font-extrabold text-[#4F46E5]">
                            ₹{activeAnalysis.essentialNeedsBudget.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (activeAnalysis.essentialNeedsBudget / (activeAnalysis.essentialNeedsBudget + activeAnalysis.commitmentsSummary + activeAnalysis.familyHappinessBudget + activeAnalysis.mentalWellbeingBudget + activeAnalysis.savingsBuffer)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Family Happiness */}
                      <div className="p-3 bg-pink-50/70 hover:bg-pink-50 rounded-xl transition-all border border-pink-100/30">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Smile className="w-4 h-4 inline-block mr-1 text-pink-500"/> Family Happiness Budget
                          </span>
                          <span className="font-extrabold text-pink-600">
                            ₹{activeAnalysis.familyHappinessBudget.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-pink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (activeAnalysis.familyHappinessBudget / (activeAnalysis.essentialNeedsBudget + activeAnalysis.commitmentsSummary + activeAnalysis.familyHappinessBudget + activeAnalysis.mentalWellbeingBudget + activeAnalysis.savingsBuffer)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Mental Wellbeing */}
                      <div className="p-3 bg-purple-50/70 hover:bg-purple-50 rounded-xl transition-all border border-purple-100/30">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Heart className="w-4 h-4 inline-block mr-1 text-purple-500"/> Mental Wellbeing Budget
                          </span>
                          <span className="font-extrabold text-purple-600">
                            ₹{activeAnalysis.mentalWellbeingBudget.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (activeAnalysis.mentalWellbeingBudget / (activeAnalysis.essentialNeedsBudget + activeAnalysis.commitmentsSummary + activeAnalysis.familyHappinessBudget + activeAnalysis.mentalWellbeingBudget + activeAnalysis.savingsBuffer)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Fixed Commitments */}
                      <div className="p-3 bg-rose-50/70 hover:bg-rose-50 rounded-xl transition-all border border-rose-100/30">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 inline-block mr-1 text-rose-500"/> Fixed Commitments
                          </span>
                          <span className="font-extrabold text-rose-600">
                            ₹{activeAnalysis.commitmentsSummary.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (activeAnalysis.commitmentsSummary / (activeAnalysis.essentialNeedsBudget + activeAnalysis.commitmentsSummary + activeAnalysis.familyHappinessBudget + activeAnalysis.mentalWellbeingBudget + activeAnalysis.savingsBuffer)) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leakages and Savings Opportunities Checklist */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      Revenue Leakage Detection (Interactive)
                    </h3>

                    <div className="space-y-3">
                      {activeAnalysis.potentialSavings.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all ${
                            checkedSavings[idx]
                              ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-slate-50 border-slate-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={checkedSavings[idx]}
                              onChange={() => toggleSavingIndex(idx)}
                              className="mt-1 accent-emerald-600 cursor-pointer w-4 h-4"
                              id={`saving_chk_${idx}`}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-baseline">
                                <span className="text-xs font-black text-slate-700">{item.category}</span>
                                <span className="text-xs font-bold text-emerald-600">
                                  Save ₹{item.potentialSaveAmount}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                                {item.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Box with Combined Monthly Opportunity */}
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                          Total Monthly Opportunity
                        </p>
                        <p className="text-xl font-black">
                          ₹{calculateOptimizedSavings().toLocaleString("en-IN")} saved / mo
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black">
                        <PartyPopper className="w-6 h-6 text-white"/>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Tamil Nadu and India Strategic Savings (SIP, Post Office, Gold) */}
              {dashboardSubTab === "investments" && (
                <div className="space-y-6 mt-2">
                  {/* Strategic Overview Header */}
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                    <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2 mb-1">
                      <Coins className="w-5 h-5 text-indigo-600" />
                      Triple Asset Savings Strategy: Wealth, Safety, & Tradition
                    </h3>
                    <p className="text-xs text-indigo-900/80 leading-relaxed">
                      We divide your monthly savings buffer of <strong>₹{activeAnalysis.savingsBuffer.toLocaleString("en-IN")}</strong> into three critical vectors aligned with the Indian and Tamil Nadu financial systems: Wealth Compounding (Mutual Fund SIP), Sovereign Absolute Safety (Post Office schemes), and Liquidity & Generational Safety (Gold).
                    </p>
                  </div>

                  {/* Interactive Split Simulator Slider */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div>
                        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                          Tactile Split Simulator
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Slide to adjust SIP exposure. Remaining balance auto-splits: Post Office (60%) & Gold (40%).
                        </p>
                      </div>
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-700">
                        SIP ratio: {sipPercent}% • PO: {Math.round((100 - sipPercent) * 0.6)}% • Gold: {100 - sipPercent - Math.round((100 - sipPercent) * 0.6)}%
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={sipPercent}
                      onChange={(e) => setSipPercent(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] h-1.5 bg-slate-200 rounded-lg cursor-pointer mb-4"
                    />

                    {/* Calculated Split Output Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">📈 SIP Amount</p>
                        <p className="text-base font-black text-[#4F46E5] mt-0.5">
                          ₹{Math.round(activeAnalysis.savingsBuffer * (sipPercent / 100)).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">📮 Post Office</p>
                        <p className="text-base font-black text-indigo-600 mt-0.5">
                          ₹{Math.round(activeAnalysis.savingsBuffer * (((100 - sipPercent) * 0.6) / 100)).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">🟡 Gold Savings</p>
                        <p className="text-base font-black text-amber-600 mt-0.5">
                          ₹{Math.max(0, activeAnalysis.savingsBuffer - Math.round(activeAnalysis.savingsBuffer * (sipPercent / 100)) - Math.round(activeAnalysis.savingsBuffer * (((100 - sipPercent) * 0.6) / 100))).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Asset Instrument Comparisons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SIP (Mutual Funds) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            📈 Mutual Fund SIP
                          </span>
                          <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-[10px] font-black px-2 py-0.5 rounded">
                            ₹{((activeAnalysis.investmentStrategy?.sip?.monthlyAllocation) || Math.round(activeAnalysis.savingsBuffer * 0.5)).toLocaleString("en-IN")}/mo
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">✓ Pros</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.sip?.pros || [
                                "Compounded returns beating inflation",
                                "Automated investment schedule",
                                "Liquidity within 2 days"
                              ]).map((p, idx) => <li key={idx}>{p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">✗ Cons</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.sip?.cons || [
                                "No government return guarantee",
                                "Highly subject to short-term market fluctuation"
                              ]).map((c, idx) => <li key={idx}>{c}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 text-[10px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg">
                        <strong>Advice: </strong> {activeAnalysis.investmentStrategy?.sip?.note || "Compounding at average 12-15% interest protects your long-term goal buy-power."}
                      </div>
                    </div>

                    {/* Post Office Savings */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            📮 Post Office Savings
                          </span>
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded">
                            ₹{((activeAnalysis.investmentStrategy?.postOffice?.monthlyAllocation) || Math.round(activeAnalysis.savingsBuffer * 0.3)).toLocaleString("en-IN")}/mo
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">✓ Pros</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.postOffice?.pros || [
                                "100% sovereign backing by Indian Govt",
                                "Stable interest revised quarterly",
                                "Tax exemptions under 80C"
                              ]).map((p, idx) => <li key={idx}>{p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">✗ Cons</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.postOffice?.cons || [
                                "Long-term lock-in (RD, PPF rules)",
                                "Relatively lower yields than high equity"
                              ]).map((c, idx) => <li key={idx}>{c}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 text-[10px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg">
                        <strong>Advice: </strong> {activeAnalysis.investmentStrategy?.postOffice?.note || "Pristine choice for risk-free buckets like Sukanya Samriddhi or PPF."}
                      </div>
                    </div>

                    {/* Gold Savings */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            🟡 Gold Savings
                          </span>
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded">
                            ₹{((activeAnalysis.investmentStrategy?.gold?.monthlyAllocation) || Math.round(activeAnalysis.savingsBuffer * 0.2)).toLocaleString("en-IN")}/mo
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">✓ Pros</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.gold?.pros || [
                                "Superb inflation protection",
                                "Highly tangible and culturally liquid asset",
                                "Immediate credit pledge support in TN"
                              ]).map((p, idx) => <li key={idx}>{p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">✗ Cons</p>
                            <ul className="text-[10px] text-slate-600 space-y-1 pl-2 list-disc">
                              {(activeAnalysis.investmentStrategy?.gold?.cons || [
                                "Storage and safety concerns physically",
                                "Making/wastage losses on jewelry conversions"
                              ]).map((c, idx) => <li key={idx}>{c}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-4 text-[10px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg">
                        <strong>Advice: </strong> {activeAnalysis.investmentStrategy?.gold?.note || "Sovereign Gold Bonds (SGB) earn an extra 2.5% yield while staying digital and secure."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Cost of Inaction vs Action Benefits */}
              {dashboardSubTab === "inaction" && (
                <div className="space-y-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* DRASTIC WARNING: Inaction */}
                    <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-rose-700 mb-4">
                          <ShieldAlert className="w-6 h-6 shrink-0" />
                          <h4 className="text-sm font-black uppercase tracking-wider">
                            If You Do NOT Save (The Cost of Inaction)
                          </h4>
                        </div>
                        <p className="text-xs text-rose-900 leading-relaxed font-medium">
                          {activeAnalysis.investmentStrategy?.drasticInactionConsequences || 
                            `⚠️ DANGER OF INACTION: If you do not start saving ₹${activeAnalysis.savingsBuffer.toLocaleString("en-IN")} now, inflation (currently ~5.5% in India) will reduce the purchasing power of your idle money by 50% in just 12 years. If an unexpected medical crisis or school fee hike hits, you run a high risk of falling into local private loan traps (interest rates ranging from 24% to 36% per annum), leading to a severe, stressful debt spiral that puts your family's daily peace and your children's higher education in jeopardy.`
                          }
                        </p>
                      </div>
                      <div className="mt-6 bg-rose-100 p-3 rounded-xl text-[10px] text-rose-800 font-extrabold border border-rose-200">
                        <TrendingDownIcon className="w-3 h-3 inline-block mr-1"/> Idle Money is Poisoned by Inflation • Private Debt is a Deep Spiral
                      </div>
                    </div>

                    {/* EMPOWERING OUTLOOK: Action Benefits */}
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-emerald-700 mb-4">
                          <CheckCircle2 className="w-6 h-6 shrink-0" />
                          <h4 className="text-sm font-black uppercase tracking-wider">
                            If You DO Save (The Power of Action)
                          </h4>
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                          {activeAnalysis.investmentStrategy?.actionBenefits || 
                            `✨ POWER OF ACTION: Securing this triple allocation immediately cushions your household against inflation. Your gold acts as an instant shield, the Post Office provides an ironclad safety net, and your Mutual Fund SIP compounds quietly in the background. In 15 years, you will have created a multi-lakh safety buffer that guarantees absolute mental tranquility, funds premier education, and gives your family unmatched social freedom.`
                          }
                        </p>
                      </div>
                      <div className="mt-6 bg-emerald-100 p-3 rounded-xl text-[10px] text-emerald-800 font-extrabold border border-emerald-200">
                        <Rocket className="w-3 h-3 inline-block mr-1"/> 15-Year Wealth Compounding Plan Active • Child Higher Education Secured
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CFO Advisory Note */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 items-start mt-2">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Lakshi Advisory
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed mt-1 italic font-medium">
                    "{activeAnalysis.summaryText}"
                  </p>
                </div>
              </div>

              {/* Interactive Sandbox Form to override/generate custom report on-the-fly */}
              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-500" />
                  Custom Sandbox Entry: Fast Plan Creator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Monthly Salary (₹)
                    </label>
                    <input
                      type="number"
                      value={familySalaryInput}
                      onChange={(e) => setFamilySalaryInput(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Family Members
                    </label>
                    <input
                      type="number"
                      value={familySizeInput}
                      onChange={(e) => setFamilySizeInput(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleApplyDirectly}
                      className="w-full bg-[#4F46E5] hover:bg-indigo-700 active:scale-95 text-white py-2 px-4 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate & Live Update
                    </button>
                  </div>
                </div>

                {/* Commitments list in sandbox */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Enter commitments (Rent, Loans, School Fees)
                  </p>
                  
                  {/* List of active temporary commitments */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tempCommitments.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">No custom commitments added. Default Kerala benchmark is active (Rent ₹12,000, EMI ₹2,500, School Fee ₹3,000).</span>
                    ) : (
                      tempCommitments.map((com, index) => (
                        <div
                          key={index}
                          className="bg-white border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                        >
                          <span>{com.name}: ₹{com.amount}</span>
                          <button
                            onClick={() => {
                              setTempCommitments(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Commitment e.g., Rent"
                      value={newCommitmentName}
                      onChange={(e) => setNewCommitmentName(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                    <input
                      type="number"
                      placeholder="Amount e.g., 12000"
                      value={newCommitmentAmount}
                      onChange={(e) => setNewCommitmentAmount(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                    <button
                      onClick={handleAddCommitmentDirectly}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE TAB: PREMIUM TIER CARDS DETAILED */}
          {activeTab === "premium" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-black text-slate-800">
                  Target Audience-First Monetization Strategy
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Priced deliberately at just ₹49/month because the main target audience is families striving to manage everyday costs. High volumes, high conversion rates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Tier */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Plan 1 – Free
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mt-3">Free Tier</h3>
                    <p className="text-slate-500 text-xs mt-1">Great hook to attract family users at Kochi / Kerala phase.</p>
                    
                    <p className="text-3xl font-black text-slate-800 my-4">₹0</p>
                    
                    <ul className="space-y-3.5 text-xs text-slate-600 border-t border-slate-200 pt-4 mt-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        5 WhatsApp analyses / month
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Basic budget plan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Basic savings suggestions
                      </li>
                    </ul>
                  </div>
                  <button className="w-full mt-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors">
                    Current Simulation Free
                  </button>
                </div>

                {/* Premium Monthly - Highlighted */}
                <div className="bg-gradient-to-b from-indigo-50 to-white border-2 border-[#4F46E5] rounded-3xl p-6 flex flex-col justify-between shadow-lg relative transform lg:-translate-y-2">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#4F46E5] text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider uppercase shadow-md">
                    Target Plan - Family Favorite
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold bg-indigo-100 text-[#4F46E5] px-2.5 py-1 rounded-full uppercase tracking-wider block w-max mt-2">
                      Plan 2 – Premium
                    </span>
                    <h3 className="text-xl font-black text-slate-800 mt-3">Monthly Premium</h3>
                    <p className="text-slate-500 text-xs mt-1">Perfect pricing friction for middle-class Indian households.</p>
                    
                    <p className="text-3xl font-black text-[#4F46E5] my-4">
                      ₹49<span className="text-xs font-normal text-slate-500"> / month</span>
                    </p>
                    
                    <ul className="space-y-3 text-xs text-slate-600 border-t border-indigo-100 pt-4 mt-4">
                      <li className="flex items-center gap-2 font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#4F46E5] shrink-0" />
                        Unlimited analyses
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Monthly financial wellness report
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Grocery store price comparisons
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Revenue leakage detection (Swiggy, OTT)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Family happiness planning budget
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        Savings planner
                      </li>
                    </ul>
                  </div>
                  <button className="w-full mt-6 bg-[#4F46E5] hover:bg-indigo-700 active:scale-95 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md">
                    Upgrade to Premium
                  </button>
                </div>

                {/* Premium Annual */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Plan 3 – Best Value
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mt-3">Annual Premium</h3>
                    <p className="text-slate-500 text-xs mt-1">High conversion helper with deep discount perception.</p>
                    
                    <p className="text-3xl font-black text-amber-600 my-4">
                      ₹499<span className="text-xs font-normal text-slate-500"> / year</span>
                    </p>
                    
                    <ul className="space-y-3.5 text-xs text-slate-600 border-t border-slate-200 pt-4 mt-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        All Premium Plan 2 features
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        Priority Whatsapp bot response
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        Saves ~15% compared to monthly
                      </li>
                    </ul>
                  </div>
                  <button className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm">
                    Choose Annual Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right WhatsApp Simulator & Fast Premium card */}
        <section id="right_panel" className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* WhatsApp Cloud API Sandbox Chat Interface */}
          
            {/* WhatsApp Cloud API Sandbox Chat Interface */}
            <div className="bg-[#075E54] rounded-3xl p-1 shadow-xl flex flex-col h-[520px] overflow-hidden relative">
              
      {/* Login Modal */}
      {showLoginModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <Trash2 className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-black text-[#4F46E5] mb-2 flex items-center gap-2">
              <Bot className="w-5 h-5" /> Lakshi AI Login
            </h2>
            <p className="text-xs text-slate-500 mb-4">One time login to get Unlimited plans and ideas for free.</p>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Name</label>
                <input required type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-[#4F46E5]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                <input required type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-[#4F46E5]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input required type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-[#4F46E5]" />
              </div>
              <button type="submit" className="w-full bg-[#4F46E5] text-white py-2 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700">Start Chatting</button>
            </form>
          </div>
        </div>
      )}

              
              {!isLoggedIn ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-[#E5DDD5] p-6 text-center m-1 rounded-2xl">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Bot className="w-10 h-10 text-[#4F46E5]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Create your budget for free!</h3>
                  <p className="text-xs text-slate-500 mb-6 max-w-[250px]">Here is Lakshi, your personal budget calculation agent!</p>
                  <button onClick={() => setShowLoginModal(true)} className="bg-[#4F46E5] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all w-full max-w-[200px]">Start</button>
                </div>
              ) : (
              <>

                {!language ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-[#E5DDD5] p-6 text-center m-1 rounded-2xl">
                    <h3 className="text-xl font-black text-[#075E54] mb-6">Choose Your Language / மொழியைத் தேர்ந்தெடுக்கவும்</h3>
                    <div className="flex gap-4">
                      <button onClick={() => { setLanguage('english'); setChatMessages([{id:'m-0', sender:'bot', text:'Saranam! Welcome to Lakshi. I am here to help you secure your family\'s financial future. Shall we start with your monthly income?', timestamp: 'Now'}]) }} className="bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#075E54]">English</button>
                      <button onClick={() => { setLanguage('tamil'); setChatMessages([{id:'m-0', sender:'bot', text:'சரணம்! லக்ஷிக்கு வரவேற்கிறோம். உங்கள் குடும்பத்தின் எதிர்காலத்தை பாதுகாக்க நான் உதவுகிறேன். உங்கள் மாத வருமானத்தில் இருந்து ஆரம்பிக்கலாமா?', timestamp: 'Now'}]) }} className="bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#075E54]">தமிழ்</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">


            
            {/* Chat header mimicking official business account */}
            <div className="p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-sm relative">
                  <Bot className="w-5 h-5 text-emerald-400"/>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#075E54] rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1">
                    Lakshi ❤️
                    <span className="bg-[#128C7E] text-[9px] font-bold px-1.5 py-0.5 rounded-md text-slate-100 uppercase">
                      Official
                    </span>
                  </h4>
                  <p className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    WhatsApp Business API
                  </p>
                </div>
              </div>

              {/* Reset button inside chat to test again */}
              <button
                onClick={() => {
                  setLanguage(null);
                  setBotStep("salary");
                  setTempSalary("");
                  setTempFamilySize("");
                  setTempCommitments([]);
                  setChatMessages([]);
                }}
                className="bg-[#128C7E] hover:bg-emerald-700 active:scale-95 text-slate-100 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                title="Restart conversational state machine"
              >
                Restart Chat
              </button>
            </div>

            {/* Conversation window scroll space */}
            <div className="flex-1 bg-[#E5DDD5] p-4 flex flex-col gap-3 overflow-y-auto">
              
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-sm flex flex-col relative ${
                    msg.sender === "bot"
                      ? "bg-white self-start text-slate-800 rounded-tl-none border-l-4 border-[#4F46E5]"
                      : "bg-[#DCF8C6] self-end text-slate-800 rounded-tr-none"
                  }`}
                >
                  {/* Message body with basic WhatsApp styling parser */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.loading && (
                    <div className="flex items-center gap-1.5 mt-2 text-[#4F46E5] font-semibold animate-pulse">
                      <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full animate-bounce delay-200"></span>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 self-end mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Simulated fast input hidden for AI flow */}
            {botStep !== "ready" && (
              <div className="p-2 bg-[#dfd5c6] flex gap-1.5 justify-center overflow-x-auto">
                {botStep === "salary" && (
                  <>
                    <button
                      onClick={() => { setInputMessage("40000"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs shrink-0"
                    >
                      ₹40,000
                    </button>
                    <button
                      onClick={() => { setInputMessage("50000"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs shrink-0"
                    >
                      ₹50,000
                    </button>
                    <button
                      onClick={() => { setInputMessage("75000"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs shrink-0"
                    >
                      ₹75,000
                    </button>
                  </>
                )}
                {botStep === "family" && (
                  <>
                    <button
                      onClick={() => { setInputMessage("3"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs"
                    >
                      3 Members
                    </button>
                    <button
                      onClick={() => { setInputMessage("4"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs"
                    >
                      4 Members
                    </button>
                    <button
                      onClick={() => { setInputMessage("5"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs"
                    >
                      5 Members
                    </button>
                  </>
                )}
                {botStep === "commitments" && (
                  <>
                    <button
                      onClick={() => { setInputMessage("Rent 12000, EMI 2500, School Fee 3000"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs truncate max-w-[200px]"
                    >
                      Rent 12k, EMI 2.5k, Fee 3k
                    </button>
                    <button
                      onClick={() => { setInputMessage("Rent 18000, Car Loan 6000"); }}
                      className="bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs truncate max-w-[200px]"
                    >
                      Rent 18k, Car Loan 6k
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Chat bottom message entry form */}
            {language && (<form onSubmit={handleSendMessage} className="p-3 bg-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  botStep === "salary"
                    ? "Enter monthly salary..."
                    : botStep === "family"
                    ? "Enter family size..."
                    : botStep === "commitments"
                    ? "Enter commitments (e.g. Rent 12000)..."
                    : "Type a message..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-full h-9 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#128C7E] text-white flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Premium Plan 2 callout card (Priced at ₹49/month for target audience) */}
          <div className="bg-[#F59E0B] rounded-3xl p-6 shadow-lg flex flex-col justify-between text-white relative overflow-hidden shrink-0">
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full"></div>
            
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-white text-[#F59E0B] px-3 py-1 rounded-full font-black tracking-wider uppercase">
                  Target Pricing
                </span>
                <span className="text-[10px] bg-amber-600/30 text-amber-100 px-2.5 py-1 rounded-full font-bold">
                  Kochi Launch MVP
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight leading-none mb-1">
                PREMIUM FAMILY ACCESS
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Saves average Kochi families over ₹1,800 monthly through leakages!
              </p>

              <div className="my-5">
                <p className="text-4xl font-black tracking-tight">
                  ₹49<span className="text-sm font-medium opacity-80">/month</span>
                </p>
                
                <ul className="text-xs mt-3.5 space-y-2 opacity-90 font-semibold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    Unlimited Chat Analyses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    Kochi Grocery Comparison
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    Revenue Leakage Alerts (Swiggy, Netflix)
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("premium")}
              className="w-full bg-white text-[#F59E0B] hover:bg-slate-50 active:scale-95 py-3 rounded-2xl font-black text-xs transition-all shadow-md relative z-10"
            >
              See Monetization Tiers
            </button>
          </div>

          {/* Fast Pitch Virality Strategy Helper */}
          <div className="bg-slate-800 text-slate-300 p-5 rounded-3xl border border-slate-700 flex flex-col gap-3 shrink-0">
            <h4 className="text-xs font-black text-[#4F46E5] uppercase tracking-widest flex items-center gap-1.5">
              <Rocket className="w-3 h-3 inline-block mr-1"/> How It Goes Viral
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              Don’t market it as a <span className="text-rose-400 font-semibold">"Budget App"</span> or <span className="text-rose-400 font-semibold">"Expense Tracker"</span>.
            </p>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 italic text-[11px] text-slate-200">
              "Send your salary and commitments on WhatsApp. Get a personalized family financial plan in 30 seconds."
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              People understand that hook immediately. Kochi Phase 1 validated with Kochi specific supermarket and Milma booth savings!
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}
