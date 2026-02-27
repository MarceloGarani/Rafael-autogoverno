-- Enums for Diário de Autogoverno
CREATE TYPE user_role AS ENUM ('mentee', 'mentor');
CREATE TYPE entry_category AS ENUM ('audiencia', 'negociacao', 'cliente', 'cobranca', 'equipe', 'decisao', 'outro');
CREATE TYPE entry_emotion AS ENUM ('ansiedade', 'raiva', 'medo', 'frustracao', 'inseguranca', 'culpa', 'outro');
CREATE TYPE self_perception_type AS ENUM ('reactive', 'strategic', 'unsure');
CREATE TYPE badge_type AS ENUM ('7_days', '30_days', '90_days', 'perfect_week');
