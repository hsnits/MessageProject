import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    data: any;
    isAccesptionMessage?: boolean;
    messages?: Array<Message>;
}

