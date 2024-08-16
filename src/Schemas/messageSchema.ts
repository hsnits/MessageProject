import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string().min(10,"Content must contain atleast 10 character").max(300,"Content must not exceed 300 characters"),
})