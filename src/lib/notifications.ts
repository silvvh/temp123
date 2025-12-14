import { createClient } from '@supabase/supabase-js'
import { 
  getConfirmationEmailTemplate, 
  getReminderEmailTemplate,
  getCancellationEmailTemplate 
} from './email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SendNotificationParams {
  appointmentId: string
  type: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'cancellation'
}

export async function sendAppointmentNotification({ 
  appointmentId, 
  type 
}: SendNotificationParams) {
  try {
    // Buscar dados do agendamento
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        id,
        scheduled_at,
        duration_minutes,
        doctor:doctors!inner (
          specialty,
          profiles!inner (
            full_name
          )
        ),
        patient:patients!inner (
          profiles!inner (
            full_name
          )
        )
      `)
      .eq('id', appointmentId)
      .single()

    if (error || !appointment) {
      console.error('Appointment not found:', error)
      return { success: false, error: 'Appointment not found' }
    }

    // Buscar email do paciente
    const { data: patientUser } = await supabase.auth.admin.getUserById(appointment.patient.id)
    const patientEmail = patientUser?.user?.email

    if (!patientEmail) {
      console.error('Patient email not found')
      return { success: false, error: 'Patient email not found' }
    }

    const emailData = {
      patientName: appointment.patient.profiles.full_name,
      doctorName: appointment.doctor.profiles.full_name,
      specialty: appointment.doctor.specialty,
      scheduledAt: new Date(appointment.scheduled_at),
      duration: appointment.duration_minutes,
      appointmentId
    }

    let subject = ''
    let html = ''

    switch (type) {
      case 'confirmation':
        subject = '✅ Consulta Confirmada - MediConnect'
        html = getConfirmationEmailTemplate(emailData)
        break
      
      case 'reminder_24h':
        subject = '⏰ Lembrete: Consulta em 24 horas - MediConnect'
        html = getReminderEmailTemplate(emailData, 24)
        break
      
      case 'reminder_1h':
        subject = '⏰ Lembrete: Consulta em 1 hora - MediConnect'
        html = getReminderEmailTemplate(emailData, 1)
        break
      
      case 'cancellation':
        subject = '❌ Consulta Cancelada - MediConnect'
        html = getCancellationEmailTemplate(emailData)
        break
    }

    // Enviar email
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: patientEmail,
        subject,
        html,
        type
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}

