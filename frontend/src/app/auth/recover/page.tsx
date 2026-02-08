"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function RecoverPage() {
  const { locale } = useLanguage();
  const [tab, setTab] = useState<'email' | 'password'>('email');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [foundEmail, setFoundEmail] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const handleFindEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setFoundEmail('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/find-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recovery_code: recoveryCode })
      });

      if (res.ok) {
        const data = await res.json();
        setFoundEmail(data.full_email);
        setResult({ type: 'success', message: locale === 'ko' ? '이메일을 찾았습니다!' : 'Email found!' });
      } else {
        const error = await res.json();
        setResult({ type: 'error', message: error.detail || (locale === 'ko' ? '이메일을 찾을 수 없습니다.' : 'Email not found.') });
      }
    } catch {
      setResult({ type: 'error', message: locale === 'ko' ? '서버 연결 실패' : 'Server connection failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResult({ type: 'error', message: locale === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setResult({ type: 'error', message: locale === 'ko' ? '비밀번호는 6자 이상이어야 합니다.' : 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recovery_code: recoveryCode,
          new_password: newPassword
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          type: 'success',
          message: locale === 'ko'
            ? `비밀번호가 재설정되었습니다! (${data.email})`
            : `Password reset successfully! (${data.email})`
        });
        setRecoveryCode('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const error = await res.json();
        setResult({ type: 'error', message: error.detail || (locale === 'ko' ? '비밀번호 재설정 실패' : 'Password reset failed') });
      }
    } catch {
      setResult({ type: 'error', message: locale === 'ko' ? '서버 연결 실패' : 'Server connection failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 py-24 text-white font-sans">
      <div className="glass p-10 rounded-[2.5rem] w-full max-w-md border border-blue-500/10 shadow-2xl">
        <h1 className="text-2xl font-black italic text-center mb-8 text-blue-500 uppercase">
          {locale === 'ko' ? '계정 복구' : 'Account Recovery'}
        </h1>

        {/* Tab 선택 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab('email'); setResult(null); setFoundEmail(''); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              tab === 'email' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {locale === 'ko' ? '이메일 찾기' : 'Find Email'}
          </button>
          <button
            onClick={() => { setTab('password'); setResult(null); setFoundEmail(''); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              tab === 'password' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {locale === 'ko' ? '비밀번호 재설정' : 'Reset Password'}
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span className="text-lg">🔑</span>
            {locale === 'ko'
              ? '회원가입 시 발급된 복구 코드를 입력하세요. 복구 코드는 마이페이지에서 확인할 수 있습니다.'
              : 'Enter the recovery code issued during signup. You can find it in My Page.'}
          </p>
        </div>

        {tab === 'email' ? (
          <form onSubmit={handleFindEmail} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                {locale === 'ko' ? '복구 코드' : 'Recovery Code'}
              </label>
              <input
                type="text"
                placeholder="RCV..."
                required
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {result && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${
                result.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {result.message}
              </div>
            )}

            {foundEmail && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{locale === 'ko' ? '찾은 이메일:' : 'Found email:'}</p>
                <p className="text-lg font-bold text-blue-400">{foundEmail}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-2xl font-black transition-all"
            >
              {loading ? (locale === 'ko' ? '조회 중...' : 'Searching...') : (locale === 'ko' ? '이메일 찾기' : 'Find Email')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                {locale === 'ko' ? '복구 코드' : 'Recovery Code'}
              </label>
              <input
                type="text"
                placeholder="RCV..."
                required
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                {locale === 'ko' ? '새 비밀번호 (6자 이상)' : 'New Password (6+ chars)'}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                {locale === 'ko' ? '비밀번호 확인' : 'Confirm Password'}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500"
              />
            </div>

            {result && (
              <div className={`p-4 rounded-xl text-sm font-bold text-center ${
                result.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {result.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-2xl font-black transition-all"
            >
              {loading ? (locale === 'ko' ? '처리 중...' : 'Processing...') : (locale === 'ko' ? '비밀번호 재설정' : 'Reset Password')}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-slate-400 hover:text-blue-400 text-sm">
            {locale === 'ko' ? '← 로그인으로 돌아가기' : '← Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}
