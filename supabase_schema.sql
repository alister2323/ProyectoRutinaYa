-- Este archivo se ejecuta en Supabase SQL Editor.
-- Crea las tablas que necesita RutinaYa y protege los datos por usuario.

-- Limpia una prueba antigua de perfiles que ya no usa la aplicación.
-- El trigger anterior podía bloquear el registro de nuevas cuentas.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.profiles;

-- Tabla principal: una fila representa un hábito creado por una persona.
create table if not exists public.habits (
  -- Identificador automático del hábito.
  id uuid primary key default gen_random_uuid(),
  -- Relaciona el hábito con la cuenta que lo creó.
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Nombre que se muestra en la aplicación.
  name text not null,
  -- Texto opcional como "8 vasos" o "30 minutos".
  target_amount text,
  -- Color elegido para identificar el hábito.
  color text not null,
  -- Frecuencia: diario, días laborales o fin de semana.
  frequency text not null default 'daily',
  -- Categoría del hábito.
  category text not null default 'productivity',
  -- Número de la cantidad medible.
  quantity numeric,
  -- Unidad de la cantidad: vasos, minutos, páginas, etc.
  unit text,
  -- 1 es baja, 2 media y 3 alta.
  priority integer not null default 2,
  -- Lista de subtareas guardada como JSON.
  subtasks jsonb not null default '[]'::jsonb,
  -- true pausa el hábito sin borrarlo.
  is_paused boolean not null default false,
  -- Fecha automática de creación.
  created_at timestamptz not null default now()
);

-- Estas migraciones agregan columnas a instalaciones que ya tenían la tabla habits.
alter table public.habits add column if not exists is_paused boolean not null default false;
alter table public.habits add column if not exists category text not null default 'productivity';
alter table public.habits add column if not exists quantity numeric;
alter table public.habits add column if not exists unit text;
alter table public.habits add column if not exists priority integer not null default 2;
alter table public.habits add column if not exists subtasks jsonb not null default '[]'::jsonb;

-- Guarda cada fecha en que un hábito fue completado.
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default now(),
  -- Impide guardar dos veces el mismo hábito en el mismo día.
  unique (habit_id, completed_on)
);

-- Guarda una meta como "cumplir 20 días" para cada usuario y mes.
create table if not exists public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  -- Cantidad de días que la persona quiere cumplir.
  target_days integer not null check (target_days > 0),
  created_at timestamptz not null default now(),
  -- Solo puede existir una meta por usuario y mes.
  unique (user_id, month_start)
);

-- Activa seguridad por fila: Supabase revisará cada operación con políticas.
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.monthly_goals enable row level security;

-- Borra políticas anteriores para poder ejecutar este archivo varias veces.
drop policy if exists "Users can manage their habits" on public.habits;
drop policy if exists "Users can manage their habit completions" on public.habit_completions;
drop policy if exists "Users can manage their monthly goals" on public.monthly_goals;

-- Cada usuario solo puede ver y modificar sus propios hábitos.
create policy "Users can manage their habits"
  on public.habits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Cada usuario solo puede ver y modificar sus propias fechas cumplidas.
create policy "Users can manage their habit completions"
  on public.habit_completions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Cada usuario solo puede ver y modificar sus propias metas mensuales.
create policy "Users can manage their monthly goals"
  on public.monthly_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
