const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN;

export interface CreateRoomParams {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  scheduledAt: Date;
}

export interface DailyRoom {
  url: string;
  roomName: string;
}

class DailyClient {
  private apiKey: string;
  private domain: string;

  constructor() {
    if (!DAILY_API_KEY) {
      throw new Error("DAILY_API_KEY não está configurada");
    }
    if (!DAILY_DOMAIN) {
      throw new Error("NEXT_PUBLIC_DAILY_DOMAIN não está configurada");
    }
    this.apiKey = DAILY_API_KEY;
    this.domain = DAILY_DOMAIN;
  }

  async createRoom(params: CreateRoomParams): Promise<DailyRoom> {
    const roomName = `appointment-${params.appointmentId}`;

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          exp: Math.floor(params.scheduledAt.getTime() / 1000) + 60 * 60 * 24, // 24 horas
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: "local",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao criar sala: ${error}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      roomName: data.name,
    };
  }

  async getMeetingToken(
    roomName: string,
    userId: string,
    userName: string,
    role: string
  ): Promise<string> {
    const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_id: userId,
          user_name: userName,
          is_owner: role === "doctor", // Médico é owner
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao gerar token: ${error}`);
    }

    const data = await response.json();
    return data.token;
  }

  async deleteRoom(roomName: string): Promise<void> {
    const response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const error = await response.text();
      throw new Error(`Erro ao deletar sala: ${error}`);
    }
  }
}

export const dailyClient = new DailyClient();

