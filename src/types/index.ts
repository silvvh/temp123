export type UserRole = "patient" | "doctor" | "admin" | "attendant";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type RecordType =
  | "consultation"
  | "prescription"
  | "exam"
  | "report";

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  crm: string;
  crm_state: string;
  specialty: string;
  bio?: string | null;
  consultation_price?: number | null;
  is_approved: boolean;
  approved_at?: string | null;
  approved_by?: string | null;
}

export interface Patient {
  id: string;
  cpf?: string | null;
  birth_date?: string | null;
  address?: Record<string, unknown> | null;
  medical_history?: string | null;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  video_room_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  appointment_id?: string | null;
  patient_id: string;
  doctor_id: string;
  record_type?: RecordType | null;
  content: Record<string, unknown>;
  ai_generated: boolean;
  signed: boolean;
  signed_at?: string | null;
  signature_id?: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  patient_id?: string | null;
  uploaded_by: string;
  category: string;
  tags?: string[] | null;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  mime_type?: string | null;
  ai_summary?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  patient_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_provider?: string | null;
  payment_id?: string | null;
  items: Record<string, unknown>;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  priority?: TicketPriority | null;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

