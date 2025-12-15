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
    const in12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000)

    // Buscar consultas que precisam de lembrete de 24h (entre 23h e 25h no futuro)
    const { data: appointments24h } = await supabase
      .from('appointments')
      .select('id, scheduled_at')
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date(in24Hours.getTime() - 30 * 60 * 1000).toISOString())
      .lte('scheduled_at', new Date(in24Hours.getTime() + 30 * 60 * 1000).toISOString())
      .not('scheduled_at', 'is', null)

    // Buscar consultas que precisam de lembrete de 1h (entre 50min e 70min no futuro)
    const { data: appointments1h } = await supabase
      .from('appointments')
      .select('id, scheduled_at')
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date(in1Hour.getTime() - 10 * 60 * 1000).toISOString())
      .lte('scheduled_at', new Date(in1Hour.getTime() + 10 * 60 * 1000).toISOString())
      .not('scheduled_at', 'is', null)

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

