-- Script para corrigir recursão infinita nas políticas RLS
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remover políticas antigas que causam recursão (se existirem)
DROP POLICY IF EXISTS "Doctors can view patient records" ON patients;
DROP POLICY IF EXISTS "Patients can view doctor records" ON doctors;
DROP POLICY IF EXISTS "Patients can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can view records of their patients" ON medical_records;
DROP POLICY IF EXISTS "Doctors can create medical records" ON medical_records;

-- Recriar políticas usando profiles para evitar recursão
CREATE POLICY "Doctors can view patient records"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

CREATE POLICY "Patients can view doctor records"
  ON doctors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'patient'
    ) OR is_approved = TRUE
  );

-- Recriar políticas de appointments sem subconsultas desnecessárias
CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their own appointments"
  ON appointments FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can update their appointments"
  ON appointments FOR UPDATE
  USING (doctor_id = auth.uid());

-- Recriar políticas de medical_records sem subconsultas desnecessárias
CREATE POLICY "Doctors can view records of their patients"
  ON medical_records FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create medical records"
  ON medical_records FOR INSERT
  WITH CHECK (doctor_id = auth.uid());



