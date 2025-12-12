# TeleMed - Plataforma de Telemedicina

Plataforma completa de telemedicina moderna e segura para o mercado brasileiro, construída com Next.js 14+, Supabase, e integração com IA.

## 🚀 Funcionalidades

### Autenticação e Perfis
- ✅ Login/Registro com email e senha
- ✅ Recuperação de senha
- ✅ Onboarding diferenciado para médicos e pacientes
- ✅ Sistema de roles (patient, doctor, admin, attendant)

### Dashboards
- ✅ Dashboard personalizado por role
- ✅ Estatísticas e métricas
- ✅ Quick actions

### Agendamento
- Sistema de agendamento de consultas
- Calendário mensal/semanal/diário
- Seleção de médico por especialidade
- Confirmação e lembretes via email

### Videochamadas
- Integração com Daily.co
- Sala de espera virtual
- Controles de áudio/vídeo
- Gravação de consultas

### Inteligência Artificial
- ✅ Resumo automático de documentos médicos
- ✅ Geração de prontuário eletrônico (formato SOAP)
- ✅ Elaboração de laudos médicos

### Documentos
- Upload e gestão de documentos
- Categorização e tags
- Busca full-text
- Compartilhamento seguro

### Assinatura Digital
- Integração com DocuSign/ClickSign
- Fluxo de assinatura digital
- Validação ICP-Brasil

### Sistema de Vendas
- Catálogo de serviços
- Checkout integrado
- Histórico de compras

### Atendimento
- Chat em tempo real
- Sistema de tickets
- Base de conhecimento

### Área Administrativa
- Gestão de usuários e médicos
- Relatórios financeiros
- Logs de auditoria (LGPD)

## 🛠️ Stack Tecnológica

- **Frontend/Backend**: Next.js 14+ (App Router, TypeScript)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **IA**: OpenAI GPT-4
- **Videochamadas**: Daily.co
- **Pagamentos**: Stripe / Asaas
- **Email**: Resend

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd telemed
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Preencha as variáveis de ambiente com suas credenciais:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `DAILY_API_KEY`
- E outras conforme necessário

4. Execute o schema SQL no Supabase:
```bash
# Copie o conteúdo de supabase/schema.sql e execute no SQL Editor do Supabase
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   ├── (dashboard)/       # Rotas do dashboard
│   ├── api/               # API Routes
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── ...
├── lib/                  # Utilitários e helpers
│   ├── supabase/         # Cliente Supabase
│   ├── ai/               # Integração OpenAI
│   ├── video/            # Integração Daily.co
│   └── ...
├── types/                # TypeScript types
└── hooks/                # Custom hooks
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) configurado em todas as tabelas
- ✅ Validação de entrada com Zod
- ✅ HTTPS obrigatório
- ✅ Logs de auditoria (LGPD compliance)
- ✅ Rate limiting nas APIs

## 📝 Licença

Este projeto é privado e proprietário.

## 🤝 Contribuindo

Este é um projeto interno. Para sugestões e melhorias, entre em contato com a equipe de desenvolvimento.
