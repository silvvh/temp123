-- Script para criar uma consulta de teste para videochamada
-- Data: 13/12/2025 12:25
-- Este script busca um paciente e um médico existentes e cria um agendamento

DO $$
DECLARE
  test_patient_id UUID;
  test_doctor_id UUID;
  appointment_id UUID;
  scheduled_time TIMESTAMPTZ := '2025-12-13 12:25:00'::TIMESTAMPTZ;
BEGIN
  -- Buscar um paciente existente
  SELECT id INTO test_patient_id
  FROM patients
  LIMIT 1;

  -- Se não houver paciente, tentar buscar um profile com role 'patient'
  IF test_patient_id IS NULL THEN
    SELECT id INTO test_patient_id
    FROM profiles
    WHERE role = 'patient'
    LIMIT 1;
    
    -- Se ainda não houver, criar um registro de paciente para o primeiro profile de patient
    IF test_patient_id IS NOT NULL THEN
      INSERT INTO patients (id, cpf, birth_date)
      VALUES (test_patient_id, '00000000000', '1990-01-01')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;

  -- Buscar um médico aprovado
  SELECT id INTO test_doctor_id
  FROM doctors
  WHERE is_approved = true
  LIMIT 1;

  -- Verificar se encontramos paciente e médico
  IF test_patient_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum paciente encontrado. Por favor, crie pelo menos um paciente primeiro.';
  END IF;

  IF test_doctor_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum médico aprovado encontrado. Por favor, crie e aprove pelo menos um médico primeiro.';
  END IF;

  -- Criar o agendamento
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    scheduled_at,
    duration_minutes,
    status,
    notes
  )
  VALUES (
    test_patient_id,
    test_doctor_id,
    scheduled_time,
    60,
    'scheduled',
    'Consulta de teste para videochamada'
  )
  RETURNING id INTO appointment_id;

  RAISE NOTICE 'Consulta de teste criada com sucesso!';
  RAISE NOTICE 'ID da consulta: %', appointment_id;
  RAISE NOTICE 'Paciente ID: %', test_patient_id;
  RAISE NOTICE 'Médico ID: %', test_doctor_id;
  RAISE NOTICE 'Data/Hora: %', scheduled_time;
  
END $$;

-- Verificar a consulta criada
SELECT 
  a.id,
  a.scheduled_at,
  a.status,
  a.duration_minutes,
  p.full_name as patient_name,
  d.specialty as doctor_specialty,
  pr.full_name as doctor_name
FROM appointments a
JOIN patients pt ON a.patient_id = pt.id
JOIN profiles p ON pt.id = p.id
JOIN doctors d ON a.doctor_id = d.id
JOIN profiles pr ON d.id = pr.id
WHERE a.scheduled_at = '2025-12-13 12:25:00'::TIMESTAMPTZ
ORDER BY a.created_at DESC
LIMIT 1;

