import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/verificationemail';
import { ApiResponse } from '@/types/ApiResponse';
import { promises } from 'dns';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
  
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification Code',
            react: VerificationEmail({username: username, otp: verifyCode}),
          });
        
        return {
            success: true,
            message: 'verification email sent successfully',
            data: null
        }
    }catch(err){
        console.log('Error sending verification email', err);
        return {
            success: false,
            message: 'Error sending verification email',
            data: null
        }
    }
}






