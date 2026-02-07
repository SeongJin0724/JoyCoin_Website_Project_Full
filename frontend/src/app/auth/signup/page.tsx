"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function SignupPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [sectors, setSectors] = useState<{id: number; name: string}[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm: '',
    nickname: '',
    sector_id: '',
    ref: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    fetch(`${API_BASE_URL}/sectors`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSectors(data);
        }
      })
      .catch(() => setError(locale === 'ko' ? "섹터 정보를 가져오지 못했습니다." : "Failed to load sectors."));
  }, [locale]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return setError(t("passwordMismatch"));
    if (formData.password.length < 12) return setError(t("passwordMinLength"));

    setLoading(true);
    setError("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.nickname,
          sector_id: formData.sector_id ? Number(formData.sector_id) : null,
          referral_code: formData.ref || null
        }),
      });

      if (response.ok) {
        router.push('/auth/login?registered=1');
      } else {
        const data = await response.json();
        setError(data.detail || (locale === 'ko' ? "가입에 실패했습니다." : "Registration failed."));
      }
    } catch (err) {
      setError(locale === 'ko' ? "서버 연결에 실패했습니다." : "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 text-white font-sans">
      <div className="glass p-10 rounded-[2.5rem] w-full max-w-md border border-blue-500/10 shadow-2xl">
        <h1 className="text-3xl font-black italic text-center mb-10 text-blue-500 uppercase">{t("signup")}</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder={t("username")} required
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
            value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />

          <input type="email" placeholder={t("email")} required
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />

          <input type="password" placeholder={locale === 'ko' ? "비밀번호 (12자 이상)" : "Password (12+ chars)"} required
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

          <input type="password" placeholder={t("confirmPassword")} required
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
            value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})} />

          <select
            required
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500 text-white"
            value={formData.sector_id}
            onChange={e => setFormData({...formData, sector_id: e.target.value})}
          >
            <option value="">{locale === 'ko' ? "소속 섹터를 선택하세요" : "Select your sector"}</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id} className="text-black">
                {locale === 'ko' ? `섹터 ${s.name}` : `Sector ${s.name}`}
              </option>
            ))}
          </select>

          <input type="text" placeholder={`${t("referralCode")} (${t("optional")})`}
            className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
            value={formData.ref} onChange={e => setFormData({...formData, ref: e.target.value})} />

          {error && <p className="text-red-400 text-xs text-center font-bold animate-pulse">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all active:scale-95">
            {loading ? t("loading") : t("signup").toUpperCase()}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          {t("alreadyHaveAccount")}{' '}
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-semibold">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
