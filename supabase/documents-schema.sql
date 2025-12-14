-- Criar bucket para documentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Política: Usuários podem fazer upload de seus próprios documentos
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuários podem ver seus próprios documentos
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Médicos podem ver documentos de seus pacientes em consultas
CREATE POLICY "Doctors can view patient documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'medical-documents' AND
  EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id::text = (storage.foldername(name))[1]
  )
);

-- Política: Usuários podem deletar seus próprios documentos
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'medical-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS medical_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT CHECK (category IN ('exam', 'prescription', 'report', 'other')),
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_medical_documents_user ON medical_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_documents_appointment ON medical_documents(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medical_documents_category ON medical_documents(category);

-- RLS
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
ON medical_documents FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Doctors can view patient documents in appointments"
ON medical_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.id = medical_documents.appointment_id
    AND a.doctor_id = auth.uid()
  )
);

CREATE POLICY "Users can upload own documents"
ON medical_documents FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
ON medical_documents FOR DELETE
TO authenticated
USING (user_id = auth.uid());

