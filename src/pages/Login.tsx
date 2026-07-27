import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
                navigate('/dashboard')
            },
            onError: (err) => {
                toast.error(getErrorMessage(err))
            },
        })
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-3xl font-bold">Welcome back</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-blue-500"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-blue-500"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full rounded bg-blue-600 py-2 font-medium disabled:opacity-50"
                    >
                        {loginMutation.isPending ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}