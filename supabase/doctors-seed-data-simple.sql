-- Script SIMPLIFICADO para popular banco de dados com médicos de teste
-- Este script cria apenas os dados de doctors e profiles sem criar usuários em auth.users
-- Para uso em desenvolvimento/teste apenas
-- 
-- IMPORTANTE: Este script requer que você tenha pelo menos alguns usuários já criados
-- ou que você desabilite temporariamente a foreign key constraint

-- Primeiro, adicionar campos extras se não existirem
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS total_consultations INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS accepts_insurance BOOLEAN DEFAULT false;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS home_visit BOOLEAN DEFAULT false;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS emergency_service BOOLEAN DEFAULT false;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS languages TEXT[];
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS education TEXT[];
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS certifications TEXT[];

-- Adicionar constraint para rating
ALTER TABLE doctors DROP CONSTRAINT IF EXISTS check_rating;
ALTER TABLE doctors ADD CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_doctors_price ON doctors(consultation_price) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(featured) WHERE is_approved = true;

-- OPÇÃO 1: Se você já tem alguns usuários criados, use seus IDs
-- Substitua os UUIDs abaixo pelos IDs reais dos usuários que você quer transformar em médicos

-- OPÇÃO 2: Criar médicos usando uma abordagem que não requer auth.users
-- Esta versão cria apenas os dados de doctors para usuários existentes

-- Primeiro, vamos verificar se há usuários existentes que podemos usar
DO $$
DECLARE
  specialty_list TEXT[] := ARRAY['Cardiologia', 'Neurologia', 'Oftalmologia', 'Ortopedia', 'Pediatria', 'Dermatologia', 'Psiquiatria', 'Ginecologia', 'Urologia', 'Endocrinologia'];
  first_names TEXT[] := ARRAY['Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Ricardo', 'Juliana', 'Pedro', 'Beatriz', 'Lucas', 'Camila', 'Rafael', 'Patricia', 'Bruno', 'Mariana', 'Gabriel', 'Amanda', 'Diego', 'Laura', 'Rodrigo'];
  last_names TEXT[] := ARRAY['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Lima', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento', 'Carvalho', 'Pereira', 'Ribeiro', 'Martins', 'Araújo', 'Melo', 'Barbosa', 'Rocha', 'Dias', 'Castro'];
  crm_states TEXT[] := ARRAY['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO'];
  existing_user_id UUID;
  profile_id UUID;
  random_first TEXT;
  random_last TEXT;
  random_specialty TEXT;
  random_state TEXT;
  random_crm TEXT;
  random_price DECIMAL;
  random_rating DECIMAL;
  full_name TEXT;
  avatar_url TEXT;
  phone TEXT;
  i INTEGER;
  user_count INTEGER;
BEGIN
  -- Contar usuários existentes
  SELECT COUNT(*) INTO user_count FROM auth.users;
  
  IF user_count = 0 THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado em auth.users. Por favor, crie pelo menos um usuário primeiro através da interface do Supabase ou use a API de autenticação.';
  END IF;

  -- Loop para criar médicos (máximo 50 ou número de usuários disponíveis)
  FOR i IN 1..LEAST(50, user_count) LOOP
    -- Buscar um usuário que ainda não seja médico
    SELECT u.id INTO existing_user_id
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM doctors d WHERE d.id = u.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = u.id AND p.role = 'doctor'
    )
    LIMIT 1;

    -- Se não houver mais usuários disponíveis, sair do loop
    EXIT WHEN existing_user_id IS NULL;

    -- Gerar dados aleatórios
    random_first := first_names[1 + floor(random() * array_length(first_names, 1))::INTEGER];
    random_last := last_names[1 + floor(random() * array_length(last_names, 1))::INTEGER];
    full_name := random_first || ' ' || random_last;
    random_specialty := specialty_list[1 + floor(random() * array_length(specialty_list, 1))::INTEGER];
    random_state := crm_states[1 + floor(random() * array_length(crm_states, 1))::INTEGER];
    random_crm := lpad((floor(random() * 999999 + 100000))::TEXT, 6, '0');
    random_price := round((random() * 300 + 100)::numeric, 2);
    random_rating := round((random() * 1 + 4)::numeric, 1);
    avatar_url := 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || random_first || random_last || i::TEXT;
    phone := '(' || lpad((floor(random() * 90 + 10))::TEXT, 2, '0') || ') ' || 
             lpad((floor(random() * 90000 + 10000))::TEXT, 5, '0') || '-' || 
             lpad((floor(random() * 9000 + 1000))::TEXT, 4, '0');

    -- Atualizar ou criar profile
    INSERT INTO profiles (id, role, full_name, avatar_url, phone, created_at, updated_at)
    VALUES (
      existing_user_id,
      'doctor',
      full_name,
      avatar_url,
      phone,
      NOW() - (random() * interval '365 days'),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'doctor',
      full_name = full_name,
      avatar_url = avatar_url,
      phone = phone,
      updated_at = NOW();

    -- Inserir doctor
    INSERT INTO doctors (
      id,
      crm,
      crm_state,
      specialty,
      bio,
      consultation_price,
      is_approved,
      rating,
      total_reviews,
      total_consultations,
      featured,
      accepts_insurance,
      home_visit,
      emergency_service,
      languages,
      education,
      certifications,
      approved_at
    )
    VALUES (
      existing_user_id,
      random_crm,
      random_state,
      random_specialty,
      CASE 
        WHEN random() > 0.5 THEN 'Especialista com mais de ' || floor(random() * 15 + 5)::TEXT || ' anos de experiência em ' || random_specialty || '. Atendimento humanizado e focado no bem-estar do paciente.'
        ELSE 'Médico dedicado à ' || random_specialty || ' com formação em instituições renomadas. Comprometido com a excelência no atendimento e atualização constante.'
      END,
      random_price,
      true,
      random_rating,
      floor(random() * 200 + 50),
      floor(random() * 1000 + 100),
      random() > 0.7,
      random() > 0.4,
      random() > 0.8,
      random() > 0.9,
      ARRAY['Português', CASE WHEN random() > 0.5 THEN 'Inglês' ELSE 'Espanhol' END],
      ARRAY[
        'Graduação em Medicina - USP',
        'Residência em ' || random_specialty || ' - Hospital das Clínicas',
        CASE WHEN random() > 0.6 THEN 'Mestrado em ' || random_specialty ELSE 'Especialização em ' || random_specialty END
      ],
      ARRAY[
        'CRM ' || random_crm || '-' || random_state,
        'Título de Especialista em ' || random_specialty || ' - AMB',
        CASE WHEN random() > 0.7 THEN 'Certificação Internacional' ELSE NULL END
      ],
      NOW() - (random() * interval '180 days')
    )
    ON CONFLICT (id) DO UPDATE SET
      crm = random_crm,
      crm_state = random_state,
      specialty = random_specialty,
      bio = CASE 
        WHEN random() > 0.5 THEN 'Especialista com mais de ' || floor(random() * 15 + 5)::TEXT || ' anos de experiência em ' || random_specialty || '. Atendimento humanizado e focado no bem-estar do paciente.'
        ELSE 'Médico dedicado à ' || random_specialty || ' com formação em instituições renomadas. Comprometido com a excelência no atendimento e atualização constante.'
      END,
      consultation_price = random_price,
      is_approved = true,
      rating = random_rating,
      total_reviews = floor(random() * 200 + 50),
      total_consultations = floor(random() * 1000 + 100),
      featured = random() > 0.7,
      accepts_insurance = random() > 0.4,
      home_visit = random() > 0.8,
      emergency_service = random() > 0.9,
      languages = ARRAY['Português', CASE WHEN random() > 0.5 THEN 'Inglês' ELSE 'Espanhol' END],
      education = ARRAY[
        'Graduação em Medicina - USP',
        'Residência em ' || random_specialty || ' - Hospital das Clínicas',
        CASE WHEN random() > 0.6 THEN 'Mestrado em ' || random_specialty ELSE 'Especialização em ' || random_specialty END
      ],
      certifications = ARRAY[
        'CRM ' || random_crm || '-' || random_state,
        'Título de Especialista em ' || random_specialty || ' - AMB',
        CASE WHEN random() > 0.7 THEN 'Certificação Internacional' ELSE NULL END
      ],
      approved_at = NOW() - (random() * interval '180 days');
  END LOOP;
  
  RAISE NOTICE 'Médicos criados com sucesso!';
END $$;

-- Verificar quantidade de médicos criados
SELECT
  COUNT(*) as total_doctors,
  COUNT(*) FILTER (WHERE featured = true) as featured_doctors,
  COUNT(*) FILTER (WHERE accepts_insurance = true) as accepts_insurance,
  ROUND(AVG(consultation_price), 2) as avg_price,
  ROUND(AVG(rating), 2) as avg_rating
FROM doctors
WHERE is_approved = true;

-- Verificar médicos por especialidade
SELECT
  specialty,
  COUNT(*) as total,
  ROUND(AVG(consultation_price), 2) as avg_price,
  ROUND(AVG(rating), 2) as avg_rating
FROM doctors
WHERE is_approved = true
GROUP BY specialty
ORDER BY total DESC;

