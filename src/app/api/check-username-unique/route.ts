import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema"
import { z } from "zod"

const UsernameQuerySchema = z.object({
	username: usernameValidation
});

export async function GET(request: Request){
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const  queryParms  = {
			username: searchParams.get("username"),
		};
		const result = UsernameQuerySchema.safeParse(queryParms);

		if(!result.success){
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success : false,
					message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
				},
				{ status: 400}
			);
		}
		
		const username = result.data.username;

		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if(existingVerifiedUser){
			return Response.json(
				{
				  success: false,
				  message: 'Username is already taken',
				},
				{ status: 200 }
			);
		}

		return Response.json(
			{
			  success: true,
			  message: 'Username is unique',
			},
			{ status: 200 }
		);

	} catch (error) {
		console.log("Error checking Username", error);
		return Response.json({
			success: false,
			message: "Error checking Username",
		},
		{ status: 500 }
		);
	}
}