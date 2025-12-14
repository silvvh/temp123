export interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  crm: string;
  crm_state: string;
  avatar_url?: string;
  rating?: number;
  reviews?: number;
  consultations?: number;
  consultation_price?: string;
  bio?: string;
  featured?: boolean;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Availability {
  date: Date;
  slots_available: number;
  is_available: boolean;
}

export interface AppointmentData {
  doctorId: string;
  patientId: string;
  scheduledAt: Date;
  durationMinutes: number;
  specialty: string;
}
