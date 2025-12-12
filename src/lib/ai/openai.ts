import OpenAI from "openai";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export const DOCUMENT_SUMMARY_PROMPT = `
Você é um assistente médico especializado. Analise o documento fornecido e gere um resumo estruturado.

FORMATO DE SAÍDA (JSON):
{
  "tipo_documento": "laudo|exame|prontuario|receita|outro",
  "data": "data extraída ou null",
  "resumo_executivo": "2-3 frases principais",
  "diagnostico": "diagnóstico identificado ou null",
  "medicacoes": ["lista de medicações mencionadas"],
  "exames_mencionados": ["lista de exames"],
  "recomendacoes": ["lista de recomendações"],
  "alertas": ["informações críticas ou urgentes"]
}

DOCUMENTO:
{document_text}
`;

export const MEDICAL_RECORD_PROMPT = `
Você é um médico assistente. Baseado nas anotações da consulta, gere um prontuário eletrônico estruturado no formato SOAP.

ANOTAÇÕES DA CONSULTA:
{consultation_notes}

DADOS DO PACIENTE:
Nome: {patient_name}
Idade: {patient_age}
Queixa principal: {chief_complaint}

FORMATO DE SAÍDA (JSON):
{
  "subjetivo": {
    "queixa_principal": "",
    "historia_doenca_atual": "",
    "revisao_sistemas": ""
  },
  "objetivo": {
    "sinais_vitais": {},
    "exame_fisico": ""
  },
  "avaliacao": {
    "hipotese_diagnostica": "",
    "diagnosticos_diferenciais": []
  },
  "plano": {
    "conduta": "",
    "prescricoes": [],
    "exames_solicitados": [],
    "retorno": ""
  }
}
`;

export const MEDICAL_REPORT_PROMPT = `
Você é um médico radiologista/patologista. Gere um laudo médico formal baseado nos dados fornecidos.

TIPO DE EXAME: {exam_type}
DADOS DO EXAME: {exam_data}
ACHADOS PRELIMINARES: {preliminary_findings}

FORMATO DE SAÍDA (JSON):
{
  "tecnica": "Descrição da técnica utilizada",
  "achados": "Descrição detalhada dos achados",
  "comparacao": "Comparação com exames anteriores (se aplicável)",
  "conclusao": "Conclusão diagnóstica",
  "recomendacoes": "Recomendações de seguimento ou exames adicionais"
}

Mantenha linguagem técnica médica apropriada e profissional.
`;

export async function generateDocumentSummary(documentText: string) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY não está configurada");
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: DOCUMENT_SUMMARY_PROMPT.replace("{document_text}", documentText),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    throw error;
  }
}

export async function generateMedicalRecord(data: {
  consultationNotes: string;
  patientName: string;
  patientAge: string;
  chiefComplaint: string;
}) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY não está configurada");
  }
  try {
    const prompt = MEDICAL_RECORD_PROMPT.replace("{consultation_notes}", data.consultationNotes)
      .replace("{patient_name}", data.patientName)
      .replace("{patient_age}", data.patientAge)
      .replace("{chief_complaint}", data.chiefComplaint);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao gerar prontuário:", error);
    throw error;
  }
}

export async function generateMedicalReport(data: {
  examType: string;
  examData: string;
  preliminaryFindings: string;
}) {
  if (!openai) {
    throw new Error("OPENAI_API_KEY não está configurada");
  }
  try {
    const prompt = MEDICAL_REPORT_PROMPT.replace("{exam_type}", data.examType)
      .replace("{exam_data}", data.examData)
      .replace("{preliminary_findings}", data.preliminaryFindings);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao gerar laudo:", error);
    throw error;
  }
}

