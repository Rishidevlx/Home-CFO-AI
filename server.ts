import express from "express";
import fs from "fs";
import path from "path";


import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "lykspire_super_secret_key_123";


app.use(express.json());

// TiDB Database Setup
let pool: mysql.Pool;

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: Number(process.env.TIDB_PORT),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.TIDB_DATABASE}\``);
    await connection.end();

    pool = mysql.createPool({
      host: process.env.TIDB_HOST,
      port: Number(process.env.TIDB_PORT),
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255),
        phone VARCHAR(50),
        sender_type ENUM('user', 'bot'),
        message_text TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registered_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("TiDB Connected & Ready!");

  } catch (error) {
    console.error("Error initializing TiDB:", error);
  }
}
initDB();

// In-memory Database Simulator to showcase Day 1 Supabase Schema
interface DBUser {
  id: string;
  phone: string;
  family_size: number;
  salary: number;
  created_at: string;
}

interface DBCommitment {
  id: string;
  user_id: string;
  name: string;
  amount: number;
}

interface DBSession {
  id: string;
  user_id: string;
  analysis: string; // JSON string
  created_at: string;
}

// Seed data with Kerala / Kochi mock users to make the DB look alive!
let dbUsers: DBUser[] = [
  { id: "u-1", phone: "+91 98460 12345", family_size: 4, salary: 50000, created_at: "2026-07-01T10:30:00Z" },
  { id: "u-2", phone: "+91 94470 54321", family_size: 3, salary: 75000, created_at: "2026-07-02T14:15:00Z" },
  { id: "u-3", phone: "+91 98950 98765", family_size: 5, salary: 35000, created_at: "2026-07-03T09:45:00Z" },
];

let dbCommitments: DBCommitment[] = [
  { id: "c-1", user_id: "u-1", name: "Rent", amount: 12000 },
  { id: "c-2", user_id: "u-1", name: "EMI", amount: 2500 },
  { id: "c-3", user_id: "u-1", name: "School Fee", amount: 3000 },
  { id: "c-4", user_id: "u-2", name: "Home Loan EMI", amount: 22000 },
  { id: "c-5", user_id: "u-2", name: "Car Insurance", amount: 1500 },
  { id: "c-6", user_id: "u-3", name: "Rent", amount: 8000 },
  { id: "c-7", user_id: "u-3", name: "Electricity & Water", amount: 1200 },
];

let dbSessions: DBSession[] = [
  {
    id: "s-1",
    user_id: "u-1",
    analysis: JSON.stringify({
      essentialNeedsBudget: 18000,
      commitmentsSummary: 17500,
      familyHappinessBudget: 2500,
      mentalWellbeingBudget: 1500,
      savingsBuffer: 5000,
      financialWellnessScore: 68,
      potentialSavings: [
        { category: "Groceries", currentEstimate: 4500, suggestion: "Switch to local Milma booths and local markets instead of supermarkets", potentialSaveAmount: 700 },
        { category: "Subscriptions", currentEstimate: 999, suggestion: "Cancel unused OTT bundle packs, share single subscriptions", potentialSaveAmount: 300 },
        { category: "Food Delivery", currentEstimate: 3000, suggestion: "Limit Swiggy/Zomato orders to twice a month, prefer homemade snacks", potentialSaveAmount: 800 }
      ],
      summaryText: "CFO Recommendation: High commitments (35% of income) leave minimal buffer. Reduce dining out to save an extra ₹1,800/month. Prioritize your mental wellbeing budget on local family outings."
    }),
    created_at: "2026-07-01T10:35:00Z"
  }
];

// Endpoint to fetch simulated DB tables
app.get("/api/db-state", (req, res) => {
  res.json({
    users: dbUsers,
    commitments: dbCommitments,
    sessions: dbSessions
  });
});

// Endpoint to reset DB tables to initial seed
app.post("/api/db-reset", (req, res) => {
  dbUsers = [
    { id: "u-1", phone: "+91 98460 12345", family_size: 4, salary: 50000, created_at: "2026-07-01T10:30:00Z" },
    { id: "u-2", phone: "+91 94470 54321", family_size: 3, salary: 75000, created_at: "2026-07-02T14:15:00Z" },
    { id: "u-3", phone: "+91 98950 98765", family_size: 5, salary: 35000, created_at: "2026-07-03T09:45:00Z" },
  ];
  dbCommitments = [
    { id: "c-1", user_id: "u-1", name: "Rent", amount: 12000 },
    { id: "c-2", user_id: "u-1", name: "EMI", amount: 2500 },
    { id: "c-3", user_id: "u-1", name: "School Fee", amount: 3000 },
    { id: "c-4", user_id: "u-2", name: "Home Loan EMI", amount: 22000 },
    { id: "c-5", user_id: "u-2", name: "Car Insurance", amount: 1500 },
    { id: "c-6", user_id: "u-3", name: "Rent", amount: 8000 },
    { id: "c-7", user_id: "u-3", name: "Electricity & Water", amount: 1200 },
  ];
  dbSessions = [
    {
      id: "s-1",
      user_id: "u-1",
      analysis: JSON.stringify({
        essentialNeedsBudget: 18000,
        commitmentsSummary: 17500,
        familyHappinessBudget: 2500,
        mentalWellbeingBudget: 1500,
        savingsBuffer: 5000,
        financialWellnessScore: 68,
        potentialSavings: [
          { category: "Groceries", currentEstimate: 4500, suggestion: "Switch to local Milma booths and local markets instead of supermarkets", potentialSaveAmount: 700 },
          { category: "Subscriptions", currentEstimate: 999, suggestion: "Cancel unused OTT bundle packs, share single subscriptions", potentialSaveAmount: 300 },
          { category: "Food Delivery", currentEstimate: 3000, suggestion: "Limit Swiggy/Zomato orders to twice a month, prefer homemade snacks", potentialSaveAmount: 800 }
        ],
        summaryText: "CFO Recommendation: High commitments (35% of income) leave minimal buffer. Reduce dining out to save an extra ₹1,800/month. Prioritize your mental wellbeing budget on local family outings."
      }),
      created_at: "2026-07-01T10:35:00Z"
    }
  ];
  res.json({ message: "Database reset successful", users: dbUsers, commitments: dbCommitments, sessions: dbSessions });
});

// Real AI layer analyzing salary, family size, and commitments
app.post("/api/analyze", async (req, res) => {
  const { phone, salary, family_size, commitments } = req.body;

  const numericSalary = Number(salary) || 0;
  const numericFamilySize = Number(family_size) || 2;
  const commitmentsList = Array.isArray(commitments) ? commitments : [];

  const totalCommitments = commitmentsList.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

  // Lazy initialize Gemini AI to avoid startup crashes if key is missing
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (apiKey) {
    try {
      const commitmentsStr = commitmentsList.map((c: any) => `${c.name}: ₹${c.amount}`).join(", ") || "None";

      const prompt = `
Analyze the following household financials for a realistic family budget and draft a highly tailored strategic savings and investment plan:
- Monthly Salary/Income: ₹${numericSalary}
- Family Size: ${numericFamilySize} members
- Fixed Commitments (Rent, EMI, Fees, etc.): ₹${totalCommitments} (${commitmentsStr})

Strict Rules:
1. Return ONLY the requested JSON format matching the schema structure.
2. Formulate a three-way strategic asset allocation using the computed savingsBuffer:
   - Mutual Fund SIP (Equity/Balanced mutual fund)
   - Public Post Office Savings (PPF, National Savings Certificate, Sukanya Samriddhi Yojana, etc.)
   - Gold Savings (Sovereign Gold Bonds, digital gold, physical gold)
3. Suggest 2-3 realistic grocery/lifestyle potential savings opportunities. Keep them culturally relevant to Tamil Nadu middle-class households (e.g., local markets, Swiggy/Zomato, bulk provisions).
4. Integrate deep context of the Tamil Nadu financial economic system (e.g. state education schemes like Pudhumai Penn, Chennai/Coimbatore living costs, local gold purchase cultural imperatives, Post Office trust networks).
5. Outline a complete overview of the picture:
   - PROS and CONS for each of the 3 saving instruments.
   - A DRASTIC analysis of Inaction Consequences: detailing exactly what severe financial downward spirals occur if they do NOT make these savings (e.g., inflation eroding buying power, massive interest rate loan traps in Tamil Nadu, default on school fees/medical emergencies).
   - An inspiring analysis of Action Benefits: detailing compounding future, children's high education, and emergency shield.
6. The sum of essentialNeedsBudget, commitmentsSummary, familyHappinessBudget, mentalWellbeingBudget, and savingsBuffer MUST equal the total monthly salary: ₹${numericSalary}.
7. The sum of the monthly allocations in the investment strategy (sip allocation + postOffice allocation + gold allocation) should exactly equal or be very close to the savingsBuffer.
8. Generate a 'botMessage' conversational string (in the user's requested language) using these Golden Rules:
   - FORMAT THE MESSAGE BEAUTIFULLY: Use markdown bullet points, numbered lists, line breaks, and bold text so it is highly readable and not a wall of text.
   - Scenario 1: If Fixed Commitments >= Monthly Salary, gently explain the situation, suggest ways to reduce expenses, give 5 business ideas (as a numbered list) to increase income, and end exactly with: "For business growth and ideas contact:\nSite: lykspire.com\nNumber: +91 87546 59759".
   - Scenario 2: If Fixed Commitments < Monthly Salary, praise their situation, suggest ways to optimize remaining savings via Gold, SIP, Stocks, and new business ideas (as a numbered list), and end exactly with: "For business growth and ideas contact:\nSite: lykspire.com\nNumber: +91 87546 59759".
   - Emojis are allowed and encouraged.
`;

      const systemInstruction = `You are LyKSpire Home CFO AI, a warm, wise, and practical household financial advisor specifically expert in Tamil Nadu and Indian household financial economic systems.
Your tone is empathetic, direct, highly expert, and realistic.
You help families balance essential needs, fixed commitments, and long-term future security.
You believe in robust budgeting paired with strategic allocation of emergency/savings buffers into Mutual Fund SIPs, Post Office schemes, and Gold.
You give honest, sometimes dramatic, but actionable advice regarding the danger of not saving vs the freedom of compounding returns.`;

      const schemaStr = `{
  "botMessage": "string",
  "essentialNeedsBudget": "number",
  "commitmentsSummary": "number",
  "familyHappinessBudget": "number",
  "mentalWellbeingBudget": "number",
  "savingsBuffer": "number",
  "financialWellnessScore": "number",
  "potentialSavings": [
    {
      "category": "string",
      "currentEstimate": "number",
      "suggestion": "string",
      "potentialSaveAmount": "number"
    }
  ],
  "summaryText": "string",
  "investmentStrategy": {
    "sip": { "monthlyAllocation": "number", "pros": ["string"], "cons": ["string"], "note": "string" },
    "postOffice": { "monthlyAllocation": "number", "pros": ["string"], "cons": ["string"], "note": "string" },
    "gold": { "monthlyAllocation": "number", "pros": ["string"], "cons": ["string"], "note": "string" },
    "drasticInactionConsequences": "string",
    "actionBenefits": "string"
  }
}`;

      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LyKSpire CFO"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemInstruction + "\n\nYou MUST return ONLY valid JSON matching this exact structure:\n" + schemaStr },
            { role: "user", content: prompt }
          ]
        })
      });

      const responseData = await openRouterResponse.json();
      const aiText = responseData.choices?.[0]?.message?.content;

      if (aiText) {
        let cleanText = aiText.trim();
        if (cleanText.startsWith('\`\`\`json')) {
          cleanText = cleanText.replace(/^\`\`\`json\s*/, '').replace(/\s*\`\`\`$/, '');
        } else if (cleanText.startsWith('\`\`\`')) {
          cleanText = cleanText.replace(/^\`\`\`\s*/, '').replace(/\s*\`\`\`$/, '');
        }
        const resultJson = JSON.parse(cleanText);

        // Insert into our simulated DB state so that the db viewer updates in real time!
        const userId = `u-${Date.now()}`;
        const cleanPhone = phone || `+91 99999 ${Math.floor(10000 + Math.random() * 90000)}`;

        const newUser: DBUser = {
          id: userId,
          phone: cleanPhone,
          family_size: numericFamilySize,
          salary: numericSalary,
          created_at: new Date().toISOString()
        };

        dbUsers.push(newUser);

        commitmentsList.forEach((c: any, index: number) => {
          dbCommitments.push({
            id: `c-${userId}-${index}`,
            user_id: userId,
            name: c.name || "Commitment",
            amount: Number(c.amount) || 0
          });
        });

        const newSession: DBSession = {
          id: `s-${Date.now()}`,
          user_id: userId,
          analysis: JSON.stringify(resultJson),
          created_at: new Date().toISOString()
        };

        dbSessions.push(newSession);

        return res.json({
          success: true,
          source: "gemini",
          data: resultJson
        });
      }
    } catch (error) {
      console.error("Gemini API error, falling back to rule-based parser:", error);
    }
  }

  // Fallback Rule-Based Budget Engine if Gemini fails or key is missing
  // Calculations match standard household budgets
  const commitmentsSum = totalCommitments;
  const remaining = Math.max(0, numericSalary - commitmentsSum);

  const essentialNeeds = Math.round(Math.min(remaining * 0.5, numericSalary * 0.4));
  const familyHappiness = Math.round(Math.min(remaining * 0.15, numericSalary * 0.08));
  const mentalWellbeing = Math.round(Math.min(remaining * 0.08, numericSalary * 0.04));
  const savingsBuffer = Math.max(0, remaining - (essentialNeeds + familyHappiness + mentalWellbeing));

  // Score calculation: higher fixed commitments = lower score, higher savings = higher score
  const commitmentRatio = numericSalary > 0 ? commitmentsSum / numericSalary : 0;
  const savingsRatio = numericSalary > 0 ? savingsBuffer / numericSalary : 0;
  let score = 80 - Math.round(commitmentRatio * 100) + Math.round(savingsRatio * 150);
  score = Math.max(10, Math.min(100, score));

  const sipAlloc = Math.round(savingsBuffer * 0.50);
  const poAlloc = Math.round(savingsBuffer * 0.30);
  const goldAlloc = Math.max(0, savingsBuffer - (sipAlloc + poAlloc));

  const isDeficit = commitmentsSum >= numericSalary;
  const fallbackBotMessage = isDeficit 
    ? "Your commitments exceed or equal your salary. We suggest exploring these business ideas to increase your income: 1. Catering, 2. Tailoring, 3. Tuitions, 4. Provisions, 5. Digital services. \n\nFor business growth and ideas contact:\nSite: lykspire.com\nNumber: +91 87546 59759" 
    : "Great job keeping commitments below your salary! We suggest investing the remainder in Gold, SIPs, and Stocks. \n\nFor business growth and ideas contact:\nSite: lykspire.com\nNumber: +91 87546 59759";

  const mockAnalysis = {
    botMessage: fallbackBotMessage,
    essentialNeedsBudget: essentialNeeds || Math.round(numericSalary * 0.35),
    commitmentsSummary: commitmentsSum,
    familyHappinessBudget: familyHappiness || Math.round(numericSalary * 0.05),
    mentalWellbeingBudget: mentalWellbeing || Math.round(numericSalary * 0.03),
    savingsBuffer: savingsBuffer || Math.round(numericSalary * 0.1),
    financialWellnessScore: score,
    potentialSavings: [
      {
        category: "Groceries & Provisioning",
        currentEstimate: Math.round(numericFamilySize * 1500),
        suggestion: "Buy staples and rice in bulk from Uzhavar Sandhai (Tamil Nadu farmer markets) or local wholesalers instead of ordering through quick-commerce apps.",
        potentialSaveAmount: 700
      },
      {
        category: "Subscription Packages",
        currentEstimate: 1200,
        suggestion: "Consolidate active streaming channels, rotate memberships month-on-month, and cancel unutilized services.",
        potentialSaveAmount: 300
      },
      {
        category: "Food Delivery & Dining",
        currentEstimate: Math.round(numericFamilySize * 600),
        suggestion: "Switch weekend restaurant deliveries with classic local Tamil Nadu homemade delicacies or quick tiffin options.",
        potentialSaveAmount: 800
      }
    ],
    summaryText: `Your fixed commitments consume ${Math.round(commitmentRatio * 100)}% of your earnings. By optimizing grocery leaks, you can redirect ₹1,800/month to build a strategic Tamil Nadu asset pool. Focus on trimming OTT and Swiggy bills.`,
    investmentStrategy: {
      sip: {
        monthlyAllocation: sipAlloc,
        pros: [
          "Compound growth targeting average 12-15% annual long-term returns",
          "Automated rupee-cost averaging shields you from market-timing errors",
          "Extremely liquid - access funds within 2-3 working days in emergencies"
        ],
        cons: [
          "Subject to market volatility - short term values will fluctuate",
          "No guaranteed returns unlike fixed deposits or post office schemes"
        ],
        note: `A monthly SIP of ₹${sipAlloc.toLocaleString("en-IN")} compounding at 12% is projected to grow to approximately ₹${Math.round(sipAlloc * 100).toLocaleString("en-IN")} in 10 years, and ₹${Math.round(sipAlloc * 250).toLocaleString("en-IN")} in 15 years, securing your child's higher education at premier state institutes.`
      },
      postOffice: {
        monthlyAllocation: poAlloc,
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
        monthlyAllocation: goldAlloc,
        pros: [
          "Generational safety net with a massive cultural demand in Tamil Nadu",
          "Perfect hedge against inflation and currency depreciation",
          "Can be pledged instantly for quick agricultural or personal emergency loans"
        ],
        cons: [
          "Physical gold incurs making/wastage charges and storage security risks",
          "Sovereign Gold Bonds (SGB) are highly optimal but have lock-in periods"
        ],
        note: `Aligns with Chennai/Tamil Nadu's rich gold savings discipline. Accumulates solid tangible security that shields your household during general economic downturns.`
      },
      drasticInactionConsequences: `⚠️ DANGER OF INACTION: If you do not start saving ₹${savingsBuffer.toLocaleString("en-IN")} now, inflation (currently ~5.5% in India) will reduce the purchasing power of your idle money by 50% in just 12 years. If an unexpected medical crisis or school fee hike hits, you run a high risk of falling into local private loan traps (interest rates ranging from 24% to 36% per annum), leading to a severe, stressful debt spiral that puts your family's daily peace and your children's higher education in jeopardy.`,
      actionBenefits: `✨ POWER OF ACTION: Securing this triple allocation immediately cushions your household against inflation. Your gold acts as an instant shield, the Post Office provides an ironclad safety net, and your Mutual Fund SIP compounds quietly in the background. In 15 years, you will have created a multi-lakh safety buffer that guarantees absolute mental tranquility, funds premier education, and gives your family unmatched social freedom.`
    }
  };

  // Log in mock DB
  const userId = `u-${Date.now()}`;
  const cleanPhone = phone || `+91 99999 ${Math.floor(10000 + Math.random() * 90000)}`;

  dbUsers.push({
    id: userId,
    phone: cleanPhone,
    family_size: numericFamilySize,
    salary: numericSalary,
    created_at: new Date().toISOString()
  });

  commitmentsList.forEach((c: any, index: number) => {
    dbCommitments.push({
      id: `c-${userId}-${index}`,
      user_id: userId,
      name: c.name || "Commitment",
      amount: Number(c.amount) || 0
    });
  });

  dbSessions.push({
    id: `s-${Date.now()}`,
    user_id: userId,
    analysis: JSON.stringify(mockAnalysis),
    created_at: new Date().toISOString()
  });

  return res.json({
    success: true,
    source: "rule-based",
    data: mockAnalysis
  });
});


// Register Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!pool) return res.status(500).json({ error: "DB not connected" });
    try {
      await pool.query("INSERT INTO registered_users (name, phone, email) VALUES (?, ?, ?)", [name, phone, email]);
    } catch(e) {
      // Ignore if duplicate
    }
    const token = jwt.sign({ name, phone, email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register" });
  }
});

// Verify Token Endpoint
app.post("/api/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Conversational Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language } = req.body; 
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.json({ response: "AI is not configured. Please set OPENROUTER_API_KEY." });
    }

    const promptFile = language === 'tamil' ? 'Personality prompt.md' : 'Personality prompt2.md';
    const systemPromptBase = fs.readFileSync(path.join(process.cwd(), promptFile), 'utf-8');
    
    const systemInstruction = systemPromptBase + 
       "\n\nCRITICAL RULE: If the user has provided enough information about their monthly income, family size, and fixed commitments (rent, EMI, etc.), you MUST generate a JSON report by responding ONLY with a JSON object containing { \"trigger_report\": true, \"salary\": <number>, \"family_size\": <number>, \"commitments\": [ { \"name\": \"...\", \"amount\": <number> } ] }. Do not include any other text if you output this JSON. If you don't have enough information, continue the conversation warmly.";

    const formattedHistory = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LyKSpire CFO"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemInstruction },
          ...formattedHistory
        ]
      })
    });

    const responseData = await openRouterResponse.json();
    const aiText = responseData.choices?.[0]?.message?.content || "";

    try {
      if (aiText.includes("trigger_report")) {
         const match = aiText.match(/\{[\s\S]*"trigger_report"[\s\S]*\}/);
         if (match) {
            const reportData = JSON.parse(match[0]);
            return res.json({
               response: language === 'tamil' ? "நன்றி! உங்கள் குடும்பத்திற்கான பட்ஜெட் அறிக்கையை தயார் செய்துவிட்டேன். இடது பக்கம் உள்ள Dashboard-ஐ பார்க்கவும்." : "Thank you! I have prepared your family budget report. Please check the Dashboard on the left.",
               trigger_report: true,
               reportData
            });
         }
      }
    } catch (e) {
      console.error("Failed to parse AI report trigger", e);
    }

    res.json({ response: aiText });

  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Failed to generate chat" });
  }
});

// TiDB Chat History Endpoint

app.post("/api/save-chat", async (req, res) => {
  try {
    const { user_name, phone, sender_type, message_text } = req.body;
    if (!pool) {
      return res.status(500).json({ error: "Database not connected" });
    }
    
    await pool.query(
      "INSERT INTO chat_history (user_name, phone, sender_type, message_text) VALUES (?, ?, ?, ?)",
      [user_name || "Guest", phone || "", sender_type, message_text]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving chat history:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

async function startServer() {
  if (process.env.VERCEL) {
    // Vercel serverless environment does not need to start its own HTTP server
    // or serve static files, as Vercel handles static routing natively.
    return;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vitePkg = "vi" + "te";
    const viteModule = await import(vitePkg);
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
