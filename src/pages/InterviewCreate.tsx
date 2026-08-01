import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Spinner from '@/components/ui/Spinner'
import {
    createInterviewSchema,
    interviewModeValues,
    difficultyValues,
    experienceLevelValues,
    type CreateInterviewFormValues,
} from '@/schemas/interview.schema'
import { useCreateInterview, useInterviews } from '@/hooks/useInterview'
import { useMyResume } from '@/hooks/useResume'
import { getErrorMessage } from '@/api/client'

export default function InterviewCreate() {
    const navigate = useNavigate()
    const createMutation = useCreateInterview()
    const { data: resume, isLoading: resumeLoading } = useMyResume()
    const { data: interviews, refetch: refetchInterviews } = useInterviews()

    const [skillInput, setSkillInput] = useState('')
    const [hasConflict, setHasConflict] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateInterviewFormValues>({
        resolver: zodResolver(createInterviewSchema),
        defaultValues: {
            mode: 'skills',
            skills: [],
            difficulty: 'intermediate',
            duration: 30,
        },
    })

    const mode = watch('mode')
    const skills = watch('skills')

    useEffect(() => {
        if (mode === 'resume' || mode === 'mixed') {
            if (resume) setValue('resume', resume._id)
        } else {
            setValue('resume', undefined)
        }

        if (mode !== 'skills' && mode !== 'mixed') {
            setValue('skills', [])
        }

        if (mode !== 'hr') {
            setValue('experienceLevel', undefined)
        }
    }, [resume, mode, setValue])

    const addSkill = () => {
        const trimmed = skillInput.trim()
        if (!trimmed || skills.includes(trimmed)) {
            setSkillInput('')
            return
        }
        setValue('skills', [...skills, trimmed], { shouldValidate: true })
        setSkillInput('')
    }

    const removeSkill = (skill: string) => {
        setValue(
            'skills',
            skills.filter((s) => s !== skill),
            { shouldValidate: true },
        )
    }

    const activeInterview = interviews?.find(
        (i) => i.status === 'pending' || i.status === 'in_progress',
    )

    const onSubmit = (values: CreateInterviewFormValues) => {
        const payload: CreateInterviewFormValues = {
            mode: values.mode,
            difficulty: values.difficulty,
            duration: values.duration,
            skills: values.mode === 'skills' || values.mode === 'mixed' ? values.skills : [],
            resume: values.mode === 'resume' || values.mode === 'mixed' ? values.resume : undefined,
            experienceLevel: values.mode === 'hr' ? values.experienceLevel : undefined,
        }

        createMutation.mutate(payload, {
            onSuccess: (res) => {
                toast.success('Interview session created!')
                navigate(`/interviews/${res.data._id}`)
            },
            onError: async (err) => {
                if (axios.isAxiosError(err) && err.response?.status === 409) {
                    await refetchInterviews()
                    setHasConflict(true)
                    toast.error('You already have an active interview.')
                    return
                }
                toast.error(getErrorMessage(err))
            },
        })
    }

    if (hasConflict && activeInterview) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
                <Navbar />
                <main className="flex-1 mx-auto max-w-md w-full px-4 py-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-3xl">
                        ⚠️
                    </div>
                    <h1 className="text-2xl font-bold">Active Interview Pending</h1>
                    <p className="text-slate-600 text-sm">
                        You currently have an unfinished session (Mode: <strong className="capitalize">{activeInterview.mode}</strong>). Complete or cancel it before starting a new one.
                    </p>
                    <Link
                        to={`/interviews/${activeInterview._id}`}
                        className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Resume Active Session →
                    </Link>
                    <Link to="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
                        Back to Dashboard
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none -z-10 h-full w-full" />

            <Navbar />

            <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 py-10">
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
                    <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                            SESSION CREATOR
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Configure Mock Interview
                        </h1>
                        <p className="text-sm text-slate-500">
                            Customize your technical interview format, difficulty level, and target topics.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Mode Picker */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Select Interview Mode
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {interviewModeValues.map((m) => (
                                    <label
                                        key={m}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                            mode === m
                                                ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-xs'
                                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 text-slate-700'
                                        }`}
                                    >
                                        <input type="radio" value={m} {...register('mode')} className="accent-indigo-600" />
                                        <span className="capitalize text-sm font-medium">{m}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.mode && <p className="text-xs text-red-500 font-semibold">{errors.mode.message}</p>}
                        </div>

                        {/* Resume mode context info */}
                        {(mode === 'resume' || mode === 'mixed') && (
                            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-1">
                                {resumeLoading ? (
                                    <p className="text-xs text-slate-500">Checking resume on file...</p>
                                ) : resume ? (
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-indigo-950">
                                            ✓ Using resume: <strong>{resume.fileName}</strong>
                                        </p>
                                        <Link to="/resume/upload" className="text-xs font-bold text-indigo-600 underline">
                                            Change
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-xs font-semibold text-amber-700">
                                        ⚠️ No resume uploaded yet.{' '}
                                        <Link to="/resume/upload" className="underline font-bold text-indigo-600">
                                            Upload your resume PDF first
                                        </Link>
                                    </p>
                                )}
                                {errors.resume && <p className="text-xs text-red-500">{errors.resume.message}</p>}
                            </div>
                        )}

                        {/* Skills picker */}
                        {(mode === 'skills' || mode === 'mixed') && (
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Target Technologies & Skills
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addSkill()
                                            }
                                        }}
                                        placeholder="e.g. React, Node.js, System Design"
                                        className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all"
                                    >
                                        Add
                                    </button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {skills.map((s) => (
                                            <span
                                                key={s}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700"
                                            >
                                                {s}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(s)}
                                                    className="text-indigo-400 hover:text-indigo-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {errors.skills && <p className="text-xs text-red-500 font-semibold">{errors.skills.message}</p>}
                            </div>
                        )}

                        {/* Experience Level */}
                        {mode === 'hr' && (
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Target Seniority / Experience
                                </label>
                                <div className="flex gap-2">
                                    {experienceLevelValues.map((level) => (
                                        <label
                                            key={level}
                                            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold capitalize cursor-pointer hover:bg-indigo-50"
                                        >
                                            <input type="radio" value={level} {...register('experienceLevel')} className="accent-indigo-600" />
                                            <span>{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Difficulty & Duration row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Difficulty Level
                                </label>
                                <select
                                    {...register('difficulty')}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium capitalize outline-none focus:border-indigo-600"
                                >
                                    {difficultyValues.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Duration (Minutes)
                                    </label>
                                    <span className="text-[11px] font-medium text-slate-400">Max 30 mins</span>
                                </div>
                                <input
                                    type="number"
                                    {...register('duration', { valueAsNumber: true })}
                                    min={5}
                                    max={30}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-indigo-600"
                                />
                                <div className="flex gap-2 pt-0.5">
                                    {[10, 20, 30].map((mins) => (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => setValue('duration', mins, { shouldValidate: true })}
                                            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            {mins} mins
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-60 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Spinner size="sm" color="white" />
                                    <span>Generating Interview...</span>
                                </>
                            ) : (
                                'Create & Start Interview →'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <Link to="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                            ← Cancel and Return to Dashboard
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}