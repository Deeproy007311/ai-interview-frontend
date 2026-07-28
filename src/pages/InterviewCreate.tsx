import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import {
    createInterviewSchema,
    interviewModeValues,
    difficultyValues,
    experienceLevelValues,
    type CreateInterviewFormValues,
} from '@/schemas/interview.schema'
import { useCreateInterview } from '@/hooks/useInterview'
import { useInterviews } from '@/hooks/useInterview'
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
                toast.success('Interview created!')
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
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-white">
                <h1 className="text-2xl font-bold">You have an active interview</h1>
                <p className="text-slate-400">
                    Mode: {activeInterview.mode} — Status: {activeInterview.status}
                </p>
                <Link
                    to={`/interviews/${activeInterview._id}`}
                    className="rounded bg-blue-600 px-4 py-2 font-medium"
                >
                    Resume interview
                </Link>
                <Link to="/dashboard" className="text-sm text-slate-400 underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-900 p-6 text-white">
            <h1 className="text-3xl font-bold">Create Interview</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
                {/* Mode selection */}
                <div>
                    <label className="mb-2 block text-sm text-slate-300">Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        {interviewModeValues.map((m) => (
                            <label
                                key={m}
                                className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800 px-3 py-2"
                            >
                                <input type="radio" value={m} {...register('mode')} />
                                <span className="capitalize">{m}</span>
                            </label>
                        ))}
                    </div>
                    {errors.mode && <p className="mt-1 text-sm text-red-400">{errors.mode.message}</p>}
                </div>

                {/* Resume confirmation (resume / mixed modes) */}
                {(mode === 'resume' || mode === 'mixed') && (
                    <div className="rounded border border-slate-700 bg-slate-800 p-3">
                        {resumeLoading ? (
                            <p className="text-sm text-slate-400">Checking resume...</p>
                        ) : resume ? (
                            <p className="text-sm text-slate-300">Using resume: {resume.fileName}</p>
                        ) : (
                            <p className="text-sm text-yellow-400">
                                No resume on file.{' '}
                                <Link to="/resume/upload" className="underline">
                                    Upload one first
                                </Link>
                                .
                            </p>
                        )}
                        {errors.resume && <p className="mt-1 text-sm text-red-400">{errors.resume.message}</p>}
                    </div>
                )}

                {/* Skills picker (skills / mixed modes) */}
                {(mode === 'skills' || mode === 'mixed') && (
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">Skills</label>
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
                                placeholder="e.g. React"
                                className="flex-1 rounded border border-slate-700 bg-slate-800 px-3 py-2"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="rounded bg-slate-700 px-4 py-2"
                            >
                                Add
                            </button>
                        </div>
                        {skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {skills.map((s) => (
                                    <span
                                        key={s}
                                        className="flex items-center gap-1 rounded-full bg-slate-700 px-3 py-1 text-sm"
                                    >
                                        {s}
                                        <button type="button" onClick={() => removeSkill(s)} className="text-slate-400">
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        {errors.skills && <p className="mt-1 text-sm text-red-400">{errors.skills.message}</p>}
                    </div>
                )}

                {/* Experience level (hr mode) */}
                {mode === 'hr' && (
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">Experience level</label>
                        <div className="flex gap-2">
                            {experienceLevelValues.map((level) => (
                                <label
                                    key={level}
                                    className="flex items-center gap-2 rounded border border-slate-700 bg-slate-800 px-3 py-2"
                                >
                                    <input type="radio" value={level} {...register('experienceLevel')} />
                                    <span className="capitalize">{level}</span>
                                </label>
                            ))}
                        </div>
                        {errors.experienceLevel && (
                            <p className="mt-1 text-sm text-red-400">{errors.experienceLevel.message}</p>
                        )}
                    </div>
                )}

                {/* Difficulty */}
                <div>
                    <label className="mb-2 block text-sm text-slate-300">Difficulty</label>
                    <select
                        {...register('difficulty')}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
                    >
                        {difficultyValues.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Duration */}
                <div>
                    <label className="mb-2 block text-sm text-slate-300">Duration (minutes)</label>
                    <input
                        type="number"
                        {...register('duration', { valueAsNumber: true })}
                        min={5}
                        max={120}
                        className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2"
                    />
                    {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full rounded bg-blue-600 py-2 font-medium disabled:opacity-50"
                >
                    {createMutation.isPending ? 'Creating...' : 'Create interview'}
                </button>
            </form>

            <Link to="/dashboard" className="text-sm text-slate-400 underline">
                Back to Dashboard
            </Link>
        </div>
    )
}