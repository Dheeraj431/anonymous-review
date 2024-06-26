import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, code } = await request.json();
		const decodedUsername = decodeURIComponent(username);

		const user = await UserModel.findOne({ username: decodedUsername });

		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not Found",
				},
				{ status: 404 }
			);
		}

		//check code and expiry
		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return Response.json(
				{
					success: true,
					message: "User verfied successfully",
				},
				{ status: 200 }
			);
		} else if (!isCodeNotExpired) {
			// Code has expired
			return Response.json(
				{
					success: false,
					message: 'Verification code has expired. Please sign up again to get a new code.',
				},
				{ status: 400 }
			);
		} else {
			// Code is incorrect
			return Response.json(
				{ 
					success: false, 
					message: 'Incorrect verification code' 
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Error verifying user: ', error);
		return Response.json( 
			{ 
				success: false, 
				message: 'Error verifying user' 
			},
			{ status: 500 }
		);
	}
}