import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateStatsDigest(statsData: {
  totalVisitors: number;
  topSource: string;
  sourceBreakdown: { source: string; count: number }[];
  conversions: number;
  revenue: number;
  currency: string;
}) {
  if (!apiKey) {
    return "💡 Configurez votre clé GEMINI_API_KEY gratuite dans .env.local pour activer l'analyse IA de votre trafic.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tu es un expert d'élite en croissance SaaS et optimisation de conversion (façon Leo Grindarss & Amadou Fall).
Voici les statistiques du jour d'un fondateur de micro-SaaS :
- Visiteurs uniques aujourd'hui : ${statsData.totalVisitors}
- Canal n°1 d'acquisition : ${statsData.topSource}
- Répartition des sources : ${JSON.stringify(statsData.sourceBreakdown)}
- Nombre de clics paiement / conversions : ${statsData.conversions}
- Revenus estimés : ${statsData.revenue} ${statsData.currency}

Fournis un débrief ultra-court, percutant et actionnable en 3 puces maximum :
1. Ce qui cartonne aujourd'hui (le signal fort).
2. Le point de fuite ou l'anomalie dans le funnel.
3. L'action n°1 à faire aujourd'hui pour faire plus de ventes (ex: quel type de vidéo poster, quel hook utiliser, comment optimiser le paywall).
Sois direct, motivant et précis. Pas de salutations ni de politesses.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erreur Gemini AI Digest:", error);
    return "💡 Analyse temporairement indisponible. Vérifiez votre clé API Gemini.";
  }
}
