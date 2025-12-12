import DailyIframe from "@daily-co/daily-js";

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN;

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  config: {
    exp: number;
    enable_chat: boolean;
    enable_screenshare: boolean;
    enable_recording: "local" | "cloud" | "none";
  };
}

export async function createDailyRoom(
  appointmentId: string,
  participants: string[]
): Promise<DailyRoom> {
  if (!DAILY_API_KEY) {
    throw new Error("DAILY_API_KEY não está configurada");
  }

  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `appointment-${appointmentId}`,
        privacy: "private",
        properties: {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: "local",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar sala: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar sala Daily.co:", error);
    throw error;
  }
}

export async function getDailyToken(
  roomName: string,
  userId: string,
  isOwner: boolean = false
): Promise<string> {
  if (!DAILY_API_KEY) {
    throw new Error("DAILY_API_KEY não está configurada");
  }

  try {
    const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_id: userId,
          is_owner: isOwner,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Erro ao gerar token Daily.co:", error);
    throw error;
  }
}

