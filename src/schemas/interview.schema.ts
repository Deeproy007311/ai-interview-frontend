import { z } from 'zod'

export const interviewModeValues = ['resume', 'skills', 'mixed', 'hr'] as const
export const difficultyValues = ['beginner', 'intermediate', 'advanced'] as const
export const experienceLevelValues = ['fresher', 'experienced'] as const

export const createInterviewSchema = z
    .object({
        mode: z.enum(interviewModeValues, { message: 'Please select an interview mode' }),
        skills: z.array(z.string()),
        difficulty: z.enum(difficultyValues),
        duration: z
            .number({ message: 'Duration is required' })
            .min(5, 'Minimum duration is 5 minutes')
            .max(120, 'Maximum duration is 120 minutes'),
        resume: z.string().optional(),
        experienceLevel: z.enum(experienceLevelValues).optional(),
    })
    .superRefine((data, ctx) => {
        if ((data.mode === 'resume' || data.mode === 'mixed') && !data.resume) {
            ctx.addIssue({
                code: 'custom',
                message: 'Upload a resume before selecting this mode.',
                path: ['resume'],
            })
        }
        if ((data.mode === 'skills' || data.mode === 'mixed') && data.skills.length === 0) {
            ctx.addIssue({
                code: 'custom',
                message: 'Add at least one skill.',
                path: ['skills'],
            })
        }
        if (data.mode === 'hr' && !data.experienceLevel) {
            ctx.addIssue({
                code: 'custom',
                message: 'Select your experience level.',
                path: ['experienceLevel'],
            })
        }
    })

export type CreateInterviewFormValues = z.infer<typeof createInterviewSchema>

export const answerSchema = z.object({
    transcript: z
        .string()
        .min(1, 'Answer cannot be empty')
        .max(5000, 'Answer must be under 5000 characters'),
})

export type AnswerFormValues = z.infer<typeof answerSchema>