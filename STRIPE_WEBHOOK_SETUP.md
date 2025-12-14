# 🔔 Configuração de Webhooks do Stripe

## Eventos Necessários para Configurar no Stripe Dashboard

Ao configurar o webhook no Stripe Dashboard, você deve adicionar os seguintes eventos:

### ✅ Eventos Essenciais (Obrigatórios)

1. **`checkout.session.completed`**
   - Quando o pagamento é concluído com sucesso
   - Confirma o agendamento e atualiza o status do pedido

2. **`checkout.session.expired`**
   - Quando a sessão de checkout expira sem pagamento
   - Cancela o pedido automaticamente

3. **`payment_intent.payment_failed`**
   - Quando o pagamento falha (cartão recusado, saldo insuficiente, etc.)
   - Atualiza o status do pedido para "cancelled"

4. **`payment_intent.succeeded`**
   - Quando o pagamento é processado com sucesso
   - Confirma o agendamento (backup do checkout.session.completed)

### 🔄 Eventos de Pagamento Assíncrono (Recomendados)

5. **`checkout.session.async_payment_succeeded`**
   - Para pagamentos que requerem confirmação (ex: boleto, PIX)
   - Confirma o agendamento quando o pagamento é confirmado

6. **`checkout.session.async_payment_failed`**
   - Quando um pagamento assíncrono falha
   - Cancela o pedido

### 💰 Eventos de Reembolso (Importante)

7. **`charge.refunded`**
   - Quando um reembolso é processado
   - Cancela o agendamento e atualiza o status do pedido

### ⚠️ Eventos de Disputa (Opcional mas Recomendado)

8. **`charge.dispute.created`**
   - Quando uma disputa/chargeback é criada
   - Permite notificar administradores e tomar ações

---

## 📋 Passo a Passo para Configurar no Stripe Dashboard

### 1. Acessar Webhooks no Stripe

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/)
2. Vá em **Developers** → **Webhooks**
3. Clique em **Add endpoint**

### 2. Configurar o Endpoint

- **Endpoint URL**: 
  ```
  https://seudominio.com/api/payments/webhook
  ```
  Ou para desenvolvimento local usando Stripe CLI:
  ```
  https://seu-ngrok-url.ngrok.io/api/payments/webhook
  ```

- **Description**: "MediConnect - Webhook de Pagamentos"

### 3. Selecionar Eventos

Selecione os seguintes eventos:

```
✓ checkout.session.completed
✓ checkout.session.async_payment_succeeded
✓ checkout.session.async_payment_failed
✓ checkout.session.expired
✓ payment_intent.succeeded
✓ payment_intent.payment_failed
✓ charge.refunded
✓ charge.dispute.created
```

**OU** selecione a opção:
- **"Select events to listen to"** → Escolha os eventos acima

### 4. Obter o Webhook Secret

Após criar o endpoint:

1. Clique no endpoint criado
2. Na seção **Signing secret**, clique em **Reveal**
3. Copie o secret (começa com `whsec_...`)
4. Adicione ao `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 🧪 Testando o Webhook Localmente

### Usando Stripe CLI

1. **Instalar Stripe CLI**:
   ```bash
   # Windows (via Scoop)
   scoop install stripe

   # macOS
   brew install stripe/stripe-cli/stripe

   # Linux
   # Baixe de https://github.com/stripe/stripe-cli/releases
   ```

2. **Login no Stripe CLI**:
   ```bash
   stripe login
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Encaminhar eventos do Stripe para localhost**:
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

5. **Obter o webhook secret para desenvolvimento**:
   O Stripe CLI mostrará um secret que começa com `whsec_...`
   Use este secret no `.env.local` para desenvolvimento local.

6. **Testar eventos**:
   ```bash
   # Testar checkout completo
   stripe trigger checkout.session.completed

   # Testar pagamento falhado
   stripe trigger payment_intent.payment_failed

   # Testar reembolso
   stripe trigger charge.refunded
   ```

---

## 🔍 Verificando se o Webhook Está Funcionando

### No Stripe Dashboard

1. Vá em **Developers** → **Webhooks**
2. Clique no seu endpoint
3. Veja a aba **Events** para ver os eventos recebidos
4. Verifique se há erros (códigos 4xx ou 5xx)

### Logs da Aplicação

O webhook loga todas as ações:
- ✅ `Payment successful: sess_...`
- ✅ `Payment intent succeeded: pi_...`
- ⚠️ `Payment failed: pi_...`
- ⚠️ `Charge refunded: ch_...`

---

## 🛡️ Segurança

### Validação de Assinatura

O webhook já valida a assinatura do Stripe automaticamente:

```typescript
event = stripe.webhooks.constructEvent(
  body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

**Importante**: Sempre use HTTPS em produção e nunca exponha o `STRIPE_WEBHOOK_SECRET`.

---

## 📊 Fluxo Completo de Eventos

### Pagamento Bem-Sucedido

1. Cliente completa checkout → `checkout.session.completed`
2. Stripe processa pagamento → `payment_intent.succeeded`
3. Sistema atualiza:
   - `orders.status` → `paid`
   - `appointments.status` → `confirmed`

### Pagamento Falhado

1. Cliente tenta pagar → `payment_intent.payment_failed`
2. Sistema atualiza:
   - `orders.status` → `cancelled`

### Reembolso

1. Admin processa reembolso → `charge.refunded`
2. Sistema atualiza:
   - `orders.status` → `refunded`
   - `appointments.status` → `cancelled`

---

## 🚨 Troubleshooting

### Webhook não está sendo chamado

- Verifique se a URL está correta e acessível
- Verifique se o endpoint está rodando
- Verifique os logs do Stripe Dashboard

### Erro "Invalid signature"

- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Certifique-se de usar o secret correto (diferente para dev e prod)

### Eventos não estão sendo processados

- Verifique os logs da aplicação
- Verifique se os eventos estão selecionados no Stripe Dashboard
- Verifique se há erros no banco de dados

---

## 📝 Checklist de Configuração

- [ ] Criar endpoint no Stripe Dashboard
- [ ] Adicionar URL do webhook
- [ ] Selecionar todos os eventos necessários
- [ ] Copiar o Webhook Secret
- [ ] Adicionar `STRIPE_WEBHOOK_SECRET` ao `.env.local`
- [ ] Testar com Stripe CLI (desenvolvimento)
- [ ] Verificar logs no Stripe Dashboard
- [ ] Testar pagamento real em modo teste
- [ ] Configurar webhook de produção quando deployar

---

## 🔗 Links Úteis

- [Documentação de Webhooks do Stripe](https://stripe.com/docs/webhooks)
- [Lista Completa de Eventos](https://stripe.com/docs/api/events/types)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testando Webhooks Localmente](https://stripe.com/docs/stripe-cli/webhooks)


