import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API key");
    return;
  }
  const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

  const prompt = `
Analyze the following household financials for a realistic family budget and draft a highly tailored strategic savings and investment plan:
- Monthly Salary/Income: ₹40000
- Family Size: 3 members
- Fixed Commitments (Rent, EMI, Fees, etc.): ₹17500 (Rent: ₹17500)

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
6. The sum of essentialNeedsBudget, commitmentsSummary, familyHappinessBudget, mentalWellbeingBudget, and savingsBuffer MUST equal the total monthly salary: ₹40000.
8. Generate a 'botMessage' conversational string (in the user's requested language) using these Golden Rules:
   - Scenario 1: If Fixed Commitments >= Monthly Salary, gently explain the situation, suggest ways to reduce expenses, give 5 business ideas to increase income, and end exactly with: "For business growth and ideas contact:\\nSite: lykspire.com\\nNumber: +91 87546 59759".
   - Scenario 2: If Fixed Commitments < Monthly Salary, praise their situation, suggest ways to optimize remaining savings via Gold, SIP, Stocks, and new business ideas, and end exactly with: "For business growth and ideas contact:\\nSite: lykspire.com\\nNumber: +91 87546 59759".
   - Emojis are allowed and encouraged.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are LyKSpire Home CFO AI...",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            botMessage: {
              type: Type.STRING,
              description: "A conversational message from Lakshi containing Business Ideas or Investment Advice based on the Golden Rules and comparing Salary vs Expenses."
            },
            essentialNeedsBudget: { type: Type.NUMBER },
            commitmentsSummary: { type: Type.NUMBER },
            familyHappinessBudget: { type: Type.NUMBER },
            mentalWellbeingBudget: { type: Type.NUMBER },
            savingsBuffer: { type: Type.NUMBER },
            financialWellnessScore: { type: Type.NUMBER },
            potentialSavings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  currentEstimate: { type: Type.NUMBER },
                  suggestion: { type: Type.STRING },
                  potentialSaveAmount: { type: Type.NUMBER }
                },
                required: ["category", "currentEstimate", "suggestion", "potentialSaveAmount"]
              }
            },
            summaryText: { type: Type.STRING },
            investmentStrategy: {
              type: Type.OBJECT,
              properties: {
                sip: {
                  type: Type.OBJECT,
                  properties: {
                    monthlyAllocation: { type: Type.NUMBER },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                    note: { type: Type.STRING }
                  },
                  required: ["monthlyAllocation", "pros", "cons", "note"]
                },
                postOffice: {
                  type: Type.OBJECT,
                  properties: {
                    monthlyAllocation: { type: Type.NUMBER },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                    note: { type: Type.STRING }
                  },
                  required: ["monthlyAllocation", "pros", "cons", "note"]
                },
                gold: {
                  type: Type.OBJECT,
                  properties: {
                    monthlyAllocation: { type: Type.NUMBER },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                    note: { type: Type.STRING }
                  },
                  required: ["monthlyAllocation", "pros", "cons", "note"]
                },
                drasticInactionConsequences: { type: Type.STRING },
                actionBenefits: { type: Type.STRING }
              },
              required: ["sip", "postOffice", "gold", "drasticInactionConsequences", "actionBenefits"]
            }
          },
          required: [
            "botMessage",
            "essentialNeedsBudget",
            "commitmentsSummary",
            "familyHappinessBudget",
            "mentalWellbeingBudget",
            "savingsBuffer",
            "financialWellnessScore",
            "potentialSavings",
            "summaryText",
            "investmentStrategy"
          ]
        }
      }
    });

    console.log("SUCCESS");
    console.log(response.text);
  } catch (error) {
    console.error("GEMINI ERROR:", error);
  }
}

testGemini();
