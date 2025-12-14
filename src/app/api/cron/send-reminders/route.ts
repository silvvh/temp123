import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAppointmentNotification } from '@/lib/notifications'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Esta rota deve ser chamada por um cron job (ex: Vercel Cron)
export async function GET(request: Request) {
  try {
    // Verificar auth header (segurança)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000)

    // Buscar consultas nas próximas 24 horas (com margem de 5 minutos)
    const { data: appointments24h } = await supabase
      .from('appointments')
      .select('id, scheduled_at')
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date(in24Hours.getTime() - 5 * 60 * 1000).toISOString())
      .lte('scheduled_at', new Date(in24Hours.getTime() + 5 * 60 * 1000).toISOString())

    // Buscar consultas na próxima 1 hora
    const { data: appointments1h } = await supabase
      .from('appointments')
      .select('id, scheduled_at')
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date(in1Hour.getTime() - 5 * 60 * 1000).toISOString())
      .lte('scheduled_at', new Date(in1Hour.getTime() + 5 * 60 * 1000).toISOString())

    const results = {
      sent24h: 0,
      sent1h: 0,
      errors: [] as any[]
    }

    // Enviar lembretes de 24h
    if (appointments24h) {
      for (const appointment of appointments24h) {
        try {
          await sendAppointmentNotification({
            appointmentId: appointment.id,
            type: 'reminder_24h'
          })
          results.sent24h++
        } catch (error) {
          console.error(`Error sending 24h reminder for ${appointment.id}:`, error)
          results.errors.push({ appointmentId: appointment.id, type: '24h', error })
        }
      }
    }

    // Enviar lembretes de 1h
    if (appointments1h) {
      for (const appointment of appointments1h) {
        try {
          await sendAppointmentNotification({
            appointmentId: appointment.id,
            type: 'reminder_1h'
          })
          results.sent1h++
        } catch (error) {
          console.error(`Error sending 1h reminder for ${appointment.id}:`, error)
          results.errors.push({ appointmentId: appointment.id, type: '1h', error })
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

