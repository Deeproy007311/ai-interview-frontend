import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import { useLogin } from '@/hooks/useAuth'
import { getErrorMessage } from '@/api/client'

export default function Login() {
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: () => {
                toast.success('Welcome back!')
                navigate('/')
            },
            onError: (err) => {
                toast.error(getErrorMessage(err))
            },
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-md w-full px-4 sm:px-6 py-16 flex flex-col justify-center">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
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
                                placeholder="developer@example.com"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
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
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            />
                            {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-[0.98] mt-2"
                        >
                            {loginMutation.isPending ? 'Logging in...' : 'Sign In →'}
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

            <Footer />
        </div>
    )
}