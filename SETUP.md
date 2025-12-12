# Guia de Configuração - TeleMed

## Passos Iniciais

### 1. Configurar Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. No SQL Editor, execute o conteúdo de `supabase/schema.sql`
4. Vá em Settings > API e copie:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configurar Storage no Supabase

1. Vá em Storage no dashboard do Supabase
2. Crie os seguintes buckets:
   - `avatars` (público)
   - `documents` (privado)
   - `medical_records` (privado)
3. Configure as políticas RLS para cada bucket conforme necessário

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# OpenAI
OPENAI_API_KEY=sua_chave_openai_aqui

# Daily.co
DAILY_API_KEY=e1c421c50da3119855acbbaff629573a9fca4425f7e3c9dbcb695c69620ca093
NEXT_PUBLIC_DAILY_DOMAIN=reinvdev.daily.co

# Resend (opcional)
RESEND_API_KEY=sua_chave_resend_aqui

# Stripe (opcional)
STRIPE_SECRET_KEY=sua_chave_stripe_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_stripe_aqui
```

### 4. Executar o Projeto

```bash
npm install
npm run dev
```

## Próximos Passos de Desenvolvimento

### Funcionalidades Implementadas ✅

- ✅ Estrutura base do projeto Next.js 14+
- ✅ Design system completo (Tailwind + shadcn/ui)
- ✅ Sistema de autenticação (login, registro, recuperação)
- ✅ Onboarding para médicos e pacientes
- ✅ Dashboards personalizados por role
- ✅ Integração com OpenAI (resumo de documentos, prontuários, laudos)
- ✅ Integração com Daily.co (videochamadas)
- ✅ Sistema de documentos básico
- ✅ Schema completo do banco de dados com RLS

### Funcionalidades Pendentes 🚧

#### Sistema de Agendamento

- Implementar calendário completo (react-big-calendar ou FullCalendar)
- Sistema de slots de horário
- Lembretes automáticos via email
- Integração com Google Calendar

#### Videochamadas Daily.co

- Componente de videochamada completo
- Controles de áudio/vídeo
- Sala de espera
- Gravação de consultas

#### Upload de Documentos

- Drag & drop para upload
- Processamento de PDFs
- OCR para imagens
- Integração com Supabase Storage

#### Assinatura Digital

- Integração com DocuSign ou ClickSign
- Fluxo de assinatura
- Validação de documentos assinados

#### Sistema de Vendas

- Catálogo de serviços
- Carrinho de compras
- Checkout com Stripe/Asaas
- Histórico de compras

#### Chat de Atendimento

- Chat em tempo real com Supabase Realtime
- Sistema de tickets
- Base de conhecimento

#### Área Administrativa

- CRUD de usuários
- Aprovação de médicos
- Relatórios financeiros
- Logs de auditoria

## Estrutura de Arquivos Importantes

```
src/
├── app/
│   ├── (auth)/              # Rotas públicas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/         # Rotas protegidas
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── schedule/        # Agendamento
│   │   ├── consultations/   # Consultas
│   │   ├── documents/       # Documentos
│   │   └── settings/        # Configurações
│   └── api/                 # API Routes
│       ├── ai/              # Endpoints de IA
│       └── video/           # Endpoints de vídeo
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   └── providers.tsx        # Providers globais
├── lib/
│   ├── supabase/            # Clientes Supabase
│   ├── ai/                  # Integração OpenAI
│   ├── video/               # Integração Daily.co
│   └── utils.ts             # Utilitários
└── types/
    └── index.ts             # TypeScript types
```

## Segurança e Compliance

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado. Revise e ajuste as políticas conforme necessário no Supabase Dashboard.

### LGPD Compliance

- ✅ Logs de auditoria implementados
- ✅ Consentimento no onboarding
- ⚠️ Política de privacidade precisa ser adicionada
- ⚠️ Termos de uso precisam ser adicionados

## Troubleshooting

### Erro ao conectar com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o schema SQL foi executado
- Verifique as políticas RLS

### Erro ao gerar resumos com IA

- Verifique se a `OPENAI_API_KEY` está configurada
- Confirme que tem créditos na conta OpenAI
- Verifique os logs do servidor

### Erro ao criar sala de vídeo

- Verifique se `DAILY_API_KEY` está configurada
- Confirme que o domínio está correto
- Verifique a documentação da API do Daily.co

## Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Daily.co](https://docs.daily.co)
- [Documentação OpenAI](https://platform.openai.com/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
