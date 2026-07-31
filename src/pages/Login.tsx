import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { useLogin } from '@/hooks/useAuth'
import Spinner from '@/components/ui/Spinner'

export default function Login() {
    const navigate = useNavigate()
    const loginMutation = useLogin()
    const [loginStageText, setLoginStageText] = useState('Signing in...')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    // Dynamic micro-feedback during login wait time to inform user of backend progress
    useEffect(() => {
        if (!loginMutation.isPending) {
            return
        }

        const timer0 = setTimeout(() => setLoginStageText('Authenticating profile...'), 0)
        const timer1 = setTimeout(() => setLoginStageText('Verifying credentials...'), 700)
        const timer2 = setTimeout(() => setLoginStageText('Preparing workspace...'), 1500)

        return () => {
            clearTimeout(timer0)
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [loginMutation.isPending])

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: () => {
                navigate('/dashboard')
            },
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative">
            {/* Top progress bar indicator during submission */}
            {loginMutation.isPending && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 animate-pulse z-50 shadow-sm" />
            )}

            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <main className="flex-1 mx-auto max-w-md w-full px-4 sm:px-6 py-12 flex flex-col justify-center">
                {/* Brand Logo Header */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2.5 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3a7 7 0 0 0-7 7c0 3.866 3.134 7 7 7s7-3.134 7-7a7 7 0 0 0-7-7zm-1 3.5a1 1 0 0 1 2 0v3.25l2.25 1.3a1 1 0 0 1-1 1.732l-2.75-1.588A1 1 0 0 1 11 11.5V8.5z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            Interview<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>
                </div>

                <div className={`bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6 transition-all duration-300 ${loginMutation.isPending ? 'ring-2 ring-indigo-500/30' : ''}`}>
                    <div className="text-center space-y-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 text-2xl mx-auto border border-indigo-100 mb-2">
                            🔑
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome Back</h1>
                        <p className="text-sm text-slate-500">Sign in to continue your AI mock interviews</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                disabled={loginMutation.isPending}
                                placeholder="developer@example.com"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-100 transition-all"
                            />
                            {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                disabled={loginMutation.isPending}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-100 transition-all"
                            />
                            {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-75 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Spinner size="sm" className="text-white" />
                                    <span className="animate-pulse">{loginStageText}</span>
                                </>
                            ) : (
                                'Sign In →'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs font-medium text-slate-500 border-t border-slate-100 pt-4">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="font-bold text-indigo-600 hover:underline">
                            Create Free Account
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}