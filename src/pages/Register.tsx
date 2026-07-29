import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema'
import { useRegister } from '@/hooks/useAuth'
import { getErrorMessage } from '@/api/client'

export default function Register() {
    const navigate = useNavigate()
    const registerMutation = useRegister()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = (values: RegisterFormValues) => {
        registerMutation.mutate(values, {
            onSuccess: () => {
                toast.success('Account created!')
                navigate('/')
            },
            onError: (err) => {
                toast.error(getErrorMessage(err))
            },
        })
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-3xl font-bold">Create your account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-blue-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                    </div>

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
                        disabled={registerMutation.isPending}
                        className="w-full rounded bg-blue-600 py-2 font-medium disabled:opacity-50"
                    >
                        {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}