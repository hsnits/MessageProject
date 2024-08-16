import { sendVerificationEmail } from "@/Helpers/sendVerficationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(req: any) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({ username, isVerified: true })
        const verifyCode = Math.random().toString(36).substring(7);
        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: 'Username already exists',
            }, { status: 500 })
        }
        const ExistingUserByEmail = await UserModel.findOne({ email })
        if (ExistingUserByEmail) {
            if (ExistingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'Email already exists',
                }, { status: 500 })
            } else {
                const hasedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                ExistingUserByEmail.password = hasedPassword;
                ExistingUserByEmail.verifyCode = verifyCode;
                ExistingUserByEmail.verifiedExpiry = expiryDate;
                await ExistingUserByEmail.save();

            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifiedExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
            });
            await newUser.save();
        }

        //Send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, {
                status: 500
            })
        }

        return Response.json({
            success: false,
            message: "User Registered Successfully && Verification Email Sent",
        }, {
            status: 201
        })


    } catch (error) {
        console.error('Error in POST /api/sign-up resgistring user', error);
        return Response.json({
            success: false,
            message: 'Error registering user',

        }, {
            status: 500
        })
    }

}