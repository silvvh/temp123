import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface AppointmentEmailData {
  patientName: string
  doctorName: string
  specialty: string
  scheduledAt: Date
  duration: number
  appointmentId: string
}

export function getConfirmationEmailTemplate(data: AppointmentEmailData): string {
  const { patientName, doctorName, specialty, scheduledAt, duration, appointmentId } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0066CC 0%, #00A86B 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #E5E7EB;
            border-top: none;
          }
          .info-box {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E5E7EB;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .button {
            display: inline-block;
            background: #00A86B;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6B7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Consulta Confirmada!</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${patientName}</strong>!</p>
          
          <p>Sua consulta foi confirmada com sucesso. Veja os detalhes abaixo:</p>
          
          <div class="info-box">
            <div class="info-row">
              <span>👨‍⚕️ Médico:</span>
              <strong>${doctorName}</strong>
            </div>
            <div class="info-row">
              <span>🏥 Especialidade:</span>
              <strong>${specialty}</strong>
            </div>
            <div class="info-row">
              <span>📅 Data:</span>
              <strong>${format(scheduledAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong>
            </div>
            <div class="info-row">
              <span>🕐 Horário:</span>
              <strong>${format(scheduledAt, 'HH:mm', { locale: ptBR })}</strong>
            </div>
            <div class="info-row">
              <span>⏱️ Duração:</span>
              <strong>${duration} minutos</strong>
            </div>
          </div>

          <p><strong>Importante:</strong></p>
          <ul>
            <li>Você receberá lembretes 24h e 1h antes da consulta</li>
            <li>Certifique-se de estar em um local tranquilo</li>
            <li>Teste sua câmera e microfone antes</li>
            <li>Tenha seus exames e documentos à mão</li>
          </ul>

          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/appointments/${appointmentId}" class="button">
              Ver Detalhes da Consulta
            </a>
          </center>

          <p>Em caso de dúvidas, entre em contato conosco.</p>
          
          <p>Atenciosamente,<br>
          <strong>Equipe MediConnect</strong></p>
        </div>
        <div class="footer">
          <p>© 2024 MediConnect - Telemedicina Moderna e Segura</p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </body>
    </html>
  `
}

export function getReminderEmailTemplate(data: AppointmentEmailData, hoursAhead: number): string {
  const { patientName, doctorName, scheduledAt, appointmentId } = data

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #E5E7EB;
          }
          .alert-box {
            background: #FFF3CD;
            border-left: 4px solid #FFC107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            background: #0066CC;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⏰ Lembrete de Consulta</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${patientName}</strong>!</p>
          
          <div class="alert-box">
            <p style="margin: 0; font-size: 18px;">
              <strong>Sua consulta com ${doctorName} será em ${hoursAhead === 24 ? '24 horas' : '1 hora'}!</strong>
            </p>
          </div>
          
          <p><strong>Detalhes da consulta:</strong></p>
          <ul>
            <li>📅 Data: ${format(scheduledAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</li>
            <li>👨‍⚕️ Médico: ${doctorName}</li>
          </ul>
          
          <p><strong>Preparação:</strong></p>
          <ul>
            <li>✅ Teste sua câmera e microfone</li>
            <li>✅ Escolha um local tranquilo e iluminado</li>
            <li>✅ Tenha seus exames e documentos prontos</li>
            <li>✅ Verifique sua conexão de internet</li>
          </ul>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/appointments/${appointmentId}/waiting-room" class="button">
              Entrar na Sala de Espera
            </a>
          </center>
          
          <p>Até logo!<br><strong>Equipe MediConnect</strong></p>
        </div>
      </body>
    </html>
  `
}

export function getCancellationEmailTemplate(data: AppointmentEmailData): string {
  const { patientName, doctorName, scheduledAt } = data
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 30px;
            border: 1px solid #E5E7EB;
          }
          .button {
            display: inline-block;
            background: #0066CC;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❌ Consulta Cancelada</h1>
        </div>
        <div class="content">
          <p>Olá, <strong>${patientName}</strong>,</p>
          
          <p>Informamos que sua consulta foi cancelada:</p>
          
          <ul>
            <li>👨‍⚕️ Médico: ${doctorName}</li>
            <li>📅 Data: ${format(scheduledAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</li>
          </ul>
          
          <p>Se você não solicitou o cancelamento, entre em contato conosco imediatamente.</p>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/search" class="button">
              Agendar Nova Consulta
            </a>
          </center>
          
          <p>Atenciosamente,<br><strong>Equipe MediConnect</strong></p>
        </div>
      </body>
    </html>
  `
}

