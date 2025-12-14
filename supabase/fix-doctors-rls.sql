-- Script para corrigir políticas RLS da tabela doctors
-- Permite que qualquer usuário autenticado veja médicos aprovados
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remover política antiga que pode estar causando problemas
DROP POLICY IF EXISTS "Patients can view doctor records" ON doctors;

-- Criar política que permite que qualquer usuário autenticado veja médicos aprovados
-- Esta política permite:
-- 1. Ver médicos aprovados (is_approved = TRUE)
-- 2. Médicos podem ver seu próprio registro (id = auth.uid())
CREATE POLICY "Anyone can view approved doctors"
  ON doctors FOR SELECT
  USING (
    is_approved = TRUE
    OR id = auth.uid()  -- Médicos podem ver seu próprio registro
  );

-- Também garantir que a política antiga "Users can view their own doctor record" não conflite
-- (ela já permite que médicos vejam seu próprio registro, então está OK)

-- Verificar se a política foi criada corretamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'doctors';

