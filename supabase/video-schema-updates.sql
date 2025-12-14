-- Adicionar campo video_room_url na tabela appointments (se não existir)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS video_room_url TEXT;

-- Criar tabela para gravações (opcional)
CREATE TABLE IF NOT EXISTS consultation_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  status TEXT CHECK (status IN ('processing', 'ready', 'failed')) DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela para avaliações
CREATE TABLE IF NOT EXISTS consultation_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id, reviewer_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consultation_recordings_appointment ON consultation_recordings(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_reviews_appointment ON consultation_reviews(appointment_id);
CREATE INDEX IF NOT EXISTS idx_consultation_reviews_reviewer ON consultation_reviews(reviewer_id);

-- RLS Policies para consultation_recordings
ALTER TABLE consultation_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recordings of their appointments"
  ON consultation_recordings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = consultation_recordings.appointment_id
      AND (
        appointments.patient_id = auth.uid()
        OR appointments.doctor_id = auth.uid()
      )
    )
  );

-- RLS Policies para consultation_reviews
ALTER TABLE consultation_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reviews of their appointments"
  ON consultation_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = consultation_reviews.appointment_id
      AND (
        appointments.patient_id = auth.uid()
        OR appointments.doctor_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create reviews for their appointments"
  ON consultation_reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = consultation_reviews.appointment_id
      AND (
        appointments.patient_id = auth.uid()
        OR appointments.doctor_id = auth.uid()
      )
      AND appointments.status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON consultation_reviews FOR UPDATE
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

