-- RLS Policies for patients
CREATE POLICY "Users can insert their own patient record"
  ON patients FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view their own patient record"
  ON patients FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own patient record"
  ON patients FOR UPDATE
  USING (id = auth.uid());

-- Usar profiles para evitar recursão infinita
CREATE POLICY "Doctors can view patient records"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- RLS Policies for doctors
CREATE POLICY "Users can insert their own doctor record"
  ON doctors FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view their own doctor record"
  ON doctors FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own doctor record"
  ON doctors FOR UPDATE
  USING (id = auth.uid());

-- Usar profiles para evitar recursão infinita
CREATE POLICY "Patients can view doctor records"
  ON doctors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'patient'
    ) OR is_approved = TRUE
  );

-- RLS Policies for appointments (INSERT)
CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (patient_id = auth.uid());

-- RLS Policies for appointments (SELECT)
CREATE POLICY "Patients can view their own appointments"
  ON appointments FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their own appointments"
  ON appointments FOR SELECT
  USING (doctor_id = auth.uid());

-- RLS Policies for appointments (UPDATE)
CREATE POLICY "Patients can update their own appointments"
  ON appointments FOR UPDATE
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can update their appointments"
  ON appointments FOR UPDATE
  USING (doctor_id = auth.uid());

-- RLS Policies for medical_records (corrigidas para evitar recursão)
CREATE POLICY "Doctors can view records of their patients"
  ON medical_records FOR SELECT
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create medical records"
  ON medical_records FOR INSERT
  WITH CHECK (doctor_id = auth.uid());

