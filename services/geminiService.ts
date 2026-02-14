
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const improveTicketDescription = async (description: string, targetDept: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Melhore a descrição deste ticket de suporte técnico ou administrativo para torná-lo mais profissional e claro. 
      O destinatário é o departamento de ${targetDept}.
      
      Texto original: "${description}"
      
      Retorne APENAS a versão melhorada, mantendo o tom corporativo.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text?.trim() || description;
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    return description;
  }
};

export const categorizePriority = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o seguinte ticket e determine a prioridade ideal: Baixa, Média, Alta ou Urgente.
      Título: ${title}
      Descrição: ${description}
      
      Retorne o resultado em JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              description: "A prioridade sugerida: Baixa, Média, Alta ou Urgente"
            },
            reasoning: {
              type: Type.STRING,
              description: "Breve explicação do porquê desta prioridade"
            }
          },
          required: ["priority", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro ao categorizar com Gemini:", error);
    return { priority: "Média", reasoning: "Falha na análise automática" };
  }
};
