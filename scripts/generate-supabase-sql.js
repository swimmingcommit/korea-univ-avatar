const fs = require('fs');
const path = require('path');

const clubsPath = path.join(__dirname, '../data/clubs.json');
const clubs = JSON.parse(fs.readFileSync(clubsPath, 'utf-8'));

let sql = `-- ==============================================================================
-- 🐯 고려대학교 동아리 Supabase 테이블 생성 및 초기 데이터 삽입 SQL
-- ==============================================================================

-- 1. 기존 테이블이 있다면 초기화 (필요시)
-- DROP TABLE IF EXISTS public.clubs CASCADE;

-- 2. clubs 테이블 생성
CREATE TABLE IF NOT EXISTS public.clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category JSONB NOT NULL DEFAULT '[]'::jsonb,
  college TEXT DEFAULT '전체',
  type TEXT,
  traits JSONB NOT NULL DEFAULT '{"sociability": 3, "activity": 3, "creativity": 3, "leadership": 3, "expertise": 3}'::jsonb,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  description_short TEXT,
  external_link TEXT,
  recruit_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) 활성화 및 누구나 조회 가능한 읽기 권한 부여
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access on clubs"
  ON public.clubs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. 109개 고려대학교 동아리 초기 데이터 일괄 삽입 (UPSERT)
INSERT INTO public.clubs (
  id,
  name,
  category,
  college,
  type,
  traits,
  keywords,
  description_short,
  external_link,
  recruit_period
) VALUES
`;

const rows = clubs.map(club => {
  const id = `'${club.id.replace(/'/g, "''")}'`;
  const name = `'${club.name.replace(/'/g, "''")}'`;
  const category = `'${JSON.stringify(club.category || []).replace(/'/g, "''")}'::jsonb`;
  const college = `'${(club.college || '전체').replace(/'/g, "''")}'`;
  const type = club.type ? `'${club.type.replace(/'/g, "''")}'` : 'NULL';
  const traits = `'${JSON.stringify(club.traits || {}).replace(/'/g, "''")}'::jsonb`;
  const keywords = `'${JSON.stringify(club.keywords || []).replace(/'/g, "''")}'::jsonb`;
  const desc = club.description_short ? `'${club.description_short.replace(/'/g, "''")}'` : 'NULL';
  const link = club.external_link ? `'${club.external_link.replace(/'/g, "''")}'` : 'NULL';
  const recruit = club.recruit_period ? `'${club.recruit_period.replace(/'/g, "''")}'` : 'NULL';

  return `  (${id}, ${name}, ${category}, ${college}, ${type}, ${traits}, ${keywords}, ${desc}, ${link}, ${recruit})`;
});

sql += rows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  category = EXCLUDED.category,\n  college = EXCLUDED.college,\n  type = EXCLUDED.type,\n  traits = EXCLUDED.traits,\n  keywords = EXCLUDED.keywords,\n  description_short = EXCLUDED.description_short,\n  external_link = EXCLUDED.external_link,\n  recruit_period = EXCLUDED.recruit_period,\n  updated_at = timezone('utc'::text, now());\n`;

const outDir = path.join(__dirname, '../supabase');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'schema.sql'), sql, 'utf-8');
console.log(`Successfully generated supabase/schema.sql with ${clubs.length} clubs!`);
