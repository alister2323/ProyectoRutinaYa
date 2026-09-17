import React, { useState } from 'react';
import {
  CheckSquare,
  BarChart3,
  PlusCircle,
  User as UserIcon,
  Flame,
  Trash2,
  Lock,
  Mail,
  Smartphone,
  Globe,
  Award,
  BookOpen,
  Calendar,
  Check,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { translations } from '../utils/translations/translations';

type Language = 'es' | 'en';
type ActiveTab = 'hoy' | 'resumen' | 'nuevo' | 'perfil';
type AppScreen = 'login' | 'register' | 'main';

interface HabitItem {
  id: string;
  name: string;
  color: string;
  targetAmount?: string;
  frequency: string;
  currentStreak: number;
  completedToday: boolean;
}

export default function AppWeb() {
  const [language, setLanguage] = useState<Language>('es');
  const [screen, setScreen] = useState<AppScreen>('login');
  const [activeTab, setActiveTab] = useState<ActiveTab>('hoy');
  const [userEmail, setUserEmail] = useState('alister23@unitec.edu');
  const [loginEmail, setLoginEmail] = useState('alister23@unitec.edu');
  const [loginPassword, setLoginPassword] = useState('alister23');
  const [loginError, setLoginError] = useState('');

  // Registro form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Nuevo hábito form state
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('');
  const [newHabitColor, setNewHabitColor] = useState('#10b981');
  const [newHabitFreq, setNewHabitFreq] = useState('Diario');

  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: '1',
      name: 'Tomar 2L de Agua',
      color: '#0ea5e9',
      targetAmount: '8 vasos al día',
      frequency: 'daily',
      currentStreak: 5,
      completedToday: true,
    },
    {
      id: '2',
      name: 'Hacer Ejercicio 30 min',
      color: '#10b981',
      targetAmount: 'Cardio / Pesas',
      frequency: 'daily',
      currentStreak: 3,
      completedToday: true,
    },
    {
      id: '3',
      name: 'Leer 15 Páginas',
      color: '#8b5cf6',
      targetAmount: 'Libro de hábitos',
      frequency: 'daily',
      currentStreak: 0,
      completedToday: false,
    },
    {
      id: '4',
      name: 'Dormir antes de las 11 PM',
      color: '#6366f1',
      targetAmount: 'Descanso 8 horas',
      frequency: 'daily',
      currentStreak: 2,
      completedToday: false,
    },
  ]);

  const t = (key: string): string => {
    const dict = (translations as any)[language] || (translations as any)['es'];
    return dict?.[key] || key;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError(language === 'es' ? 'Por favor completa todos los campos' : 'Please fill all fields');
      return;
    }
    if (!loginEmail.includes('@')) {
      setLoginError(language === 'es' ? 'Ingresa un correo electrónico válido' : 'Please enter a valid email');
      return;
    }
    if (loginPassword.length < 4) {
      setLoginError(language === 'es' ? 'La contraseña es muy corta' : 'Password is too short');
      return;
    }
    setUserEmail(loginEmail);
    setLoginError('');
    setScreen('main');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError(language === 'es' ? 'Completa los campos requeridos' : 'Please fill required fields');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError(language === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match');
      return;
    }
    setUserEmail(regEmail);
    setRegError('');
    setScreen('main');
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          return {
            ...h,
            completedToday: nextCompleted,
            currentStreak: nextCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
          };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: HabitItem = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: newHabitColor,
      targetAmount: newHabitTarget.trim() || undefined,
      frequency: newHabitFreq,
      currentStreak: 0,
      completedToday: false,
    };
    setHabits((prev) => [newHabit, ...prev]);
    setNewHabitName('');
    setNewHabitTarget('');
    setActiveTab('hoy');
  };

  const completedCount = habits.filter((h) => h.completedToday).length;
  const percentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const weekDays = [
    { day: 'Lun', pct: 80 },
    { day: 'Mar', pct: 100 },
    { day: 'Mié', pct: 75 },
    { day: 'Jue', pct: 90 },
    { day: 'Vie', pct: 85 },
    { day: 'Sáb', pct: 60 },
    { day: 'Dom', pct: 80 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      {/* Banner de compatibilidad VS Code / Expo */}
      <div className="w-full max-w-md mb-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-700">Expo / React Native</span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
            Listo para VS Code
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              language === 'es' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Simulador Móvil */}
      <div className="w-full max-w-md bg-white border-2 border-slate-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[740px]">
        {/* Notch / Barra de estado */}
        <div className="bg-slate-950 text-white px-6 py-2 flex items-center justify-between text-xs font-semibold select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-white rounded-xs p-0.5">
              <div className="w-full h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
          {screen === 'login' && (
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-2xl mb-3 shadow-md">
                  RY
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
                <p className="text-xs text-slate-500 mt-1">{t('subtitle')}</p>
                <div className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  {t('tag')}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-800 mb-4">{t('welcomeLogin')}</h2>

                {loginError && (
                  <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'es' ? 'Correo Electrónico' : 'Email Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder={t('typeEmail')}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'es' ? 'Contraseña' : 'Password'} *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={t('typePwd')}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors shadow-md mt-2 cursor-pointer"
                  >
                    {t('signIn')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setScreen('register')}
                    className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    {t('createAccount')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {screen === 'register' && (
            <div className="p-6 flex-1 flex flex-col justify-center">
              <div className="mb-4">
                <h1 className="text-xl font-black text-slate-900">
                  {language === 'es' ? 'Crear Cuenta' : 'Create Account'}
                </h1>
                <p className="text-xs text-slate-500">
                  {language === 'es' ? 'Regístrate en RutinaYa' : 'Sign up to RutinaYa'}
                </p>
              </div>

              {regError && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-2.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'es' ? 'Nombre Completo' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'es' ? 'Correo Electrónico' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ejemplo@ceutec.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'es' ? 'Teléfono Celular' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+504 9999-8888"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'es' ? 'Contraseña' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'es' ? 'Confirmar Contraseña' : 'Confirm Password'} *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-950 text-white rounded-xl font-bold text-xs hover:bg-slate-800 cursor-pointer"
                  >
                    {language === 'es' ? 'Registrarse' : 'Sign Up'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="w-full py-2 bg-slate-200 text-slate-800 rounded-xl font-bold text-xs hover:bg-slate-300 cursor-pointer"
                  >
                    {language === 'es' ? 'Volver al Login' : 'Back to Login'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {screen === 'main' && (
            <div className="flex-1 flex flex-col p-4">
              {activeTab === 'hoy' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-600 font-medium">
                        {language === 'es' ? '¡Hola, ' : 'Hello, '}
                        {userEmail.split('@')[0]}!
                      </div>
                      <h2 className="text-xl font-black text-slate-900">
                        {language === 'es' ? 'Tus Hábitos Diarios' : 'Your Daily Habits'}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('nuevo')}
                      className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tarjeta de Progreso */}
                  <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200">
                        {language === 'es' ? 'Progreso de Hoy' : 'Today\'s Progress'}
                      </span>
                      <span className="text-base font-black text-white">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {completedCount} {language === 'es' ? 'de' : 'of'} {habits.length}{' '}
                      {language === 'es' ? 'hábitos cumplidos' : 'habits completed'}
                    </div>
                  </div>

                  {/* Lista de Hábitos */}
                  <div className="space-y-2.5">
                    {habits.map((h) => (
                      <div
                        key={h.id}
                        style={{ borderLeftColor: h.color }}
                        className={`p-3 rounded-xl border border-slate-200 border-l-4 bg-white shadow-xs flex items-center justify-between transition-all ${
                          h.completedToday ? 'bg-slate-50/80 opacity-90' : ''
                        }`}
                      >
                        <div
                          onClick={() => toggleHabit(h.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          <div
                            style={{
                              borderColor: h.completedToday ? h.color : '#cbd5e1',
                              backgroundColor: h.completedToday ? h.color : 'transparent',
                            }}
                            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors"
                          >
                            {h.completedToday && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>
                          <div>
                            <div
                              className={`text-xs font-bold text-slate-900 ${
                                h.completedToday ? 'line-through text-slate-500' : ''
                              }`}
                            >
                              {h.name}
                            </div>
                            {h.targetAmount && (
                              <div className="text-[10px] text-slate-500">{h.targetAmount}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              h.currentStreak > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Flame className="w-3 h-3 text-amber-600" />
                            <span>{h.currentStreak}d</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteHabit(h.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resumen' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{t('summary')}</h2>
                    <p className="text-xs text-slate-500">
                      {language === 'es' ? 'Cumplimiento en los últimos 7 días' : 'Performance over the last 7 days'}
                    </p>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        {language === 'es' ? 'Cumplimiento General' : 'Overall Completion'}
                      </span>
                      <span className="text-2xl font-black">81%</span>
                    </div>
                    <p className="text-[11px] text-emerald-300 mt-1">
                      {language === 'es'
                        ? '¡Excelente semana! Mantienes una gran constancia.'
                        : 'Great week! You are maintaining solid consistency.'}
                    </p>
                  </div>

                  {/* Gráfica de Barras */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-800 mb-3">
                      {language === 'es' ? 'Día por Día' : 'Day by Day'}
                    </h3>
                    <div className="flex items-end justify-between h-28 pt-2">
                      {weekDays.map((w, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1">
                          <span className="text-[9px] text-slate-500 font-semibold mb-1">{w.pct}%</span>
                          <div className="w-4 bg-slate-100 h-20 rounded-md flex items-end overflow-hidden">
                            <div
                              className="w-full bg-slate-900 rounded-md transition-all"
                              style={{ height: `${w.pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mt-1.5">{w.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cumplimiento por hábito */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-800">
                      {language === 'es' ? 'Cumplimiento por Hábito' : 'Completion by Habit'}
                    </h3>
                    {habits.map((h) => (
                      <div key={h.id}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                            <span>{h.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{h.currentStreak > 0 ? '85%' : '50%'}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: h.currentStreak > 0 ? '85%' : '50%',
                              backgroundColor: h.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'nuevo' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{t('newHabit')}</h2>
                    <p className="text-xs text-slate-500">
                      {language === 'es' ? 'Crea y personaliza un nuevo hábito' : 'Create and customize a new habit'}
                    </p>
                  </div>

                  <form onSubmit={handleCreateHabit} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'es' ? 'Nombre del Hábito' : 'Habit Name'} *
                      </label>
                      <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Ej: Meditar 10 minutos"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'es' ? 'Meta Diaria (Opcional)' : 'Daily Target (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={newHabitTarget}
                        onChange={(e) => setNewHabitTarget(e.target.value)}
                        placeholder="Ej: 1 sesión, 10 min"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'es' ? 'Frecuencia' : 'Frequency'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Diario', 'Lun a Vie', 'Fin de Semana'].map((f) => (
                          <button
                            type="button"
                            key={f}
                            onClick={() => setNewHabitFreq(f)}
                            className={`py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                              newHabitFreq === f
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'es' ? 'Color' : 'Color'}
                      </label>
                      <div className="flex items-center gap-3">
                        {['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'].map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setNewHabitColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                              newHabitColor === c ? 'scale-125 ring-2 ring-slate-900' : 'hover:scale-110'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-950 text-white rounded-xl font-bold text-xs hover:bg-slate-800 shadow-md cursor-pointer mt-2"
                    >
                      {language === 'es' ? 'Guardar Hábito' : 'Save Habit'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'perfil' && (
                <div className="space-y-4">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-slate-200 border-2 border-slate-300 rounded-full mx-auto flex items-center justify-center font-bold text-xl text-slate-600 shadow-xs">
                      AG
                    </div>
                    <h2 className="text-lg font-black text-slate-900 mt-2">Alister Gonzales</h2>
                    <p className="text-xs text-slate-500">{userEmail}</p>
                  </div>

                  {/* Detalles Académicos */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                      {t('academicDetails')}
                    </h3>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t('university')}:</span>
                      <span className="font-bold text-slate-800">CEUTEC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t('class')}:</span>
                      <span className="font-bold text-slate-800">Programación Móvil</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t('teacher')}:</span>
                      <span className="font-bold text-slate-800">Ing. María José Salinas</span>
                    </div>
                  </div>

                  {/* Idioma selector */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{t('language')}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('es')}
                        className={`px-3 py-1 text-xs rounded-lg font-bold cursor-pointer ${
                          language === 'es' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Español
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 text-xs rounded-lg font-bold cursor-pointer ${
                          language === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barra de Navegación Inferior (Tabs) */}
        {screen === 'main' && (
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around">
            <button
              type="button"
              onClick={() => setActiveTab('hoy')}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${
                activeTab === 'hoy' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-[10px]">{t('today')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resumen')}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${
                activeTab === 'resumen' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px]">{t('summary')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('nuevo')}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${
                activeTab === 'nuevo' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px]">{t('newHabit')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${
                activeTab === 'perfil' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[10px]">{t('profile')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
