import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";

export async function POST(request: Request) {
	await dbConnect();
	const { username, content } = await request.json();
	try{
		const user = await UserModel.findOne({username});

		if(!user){
			return Response.json(
				{
					success: false,
					message: "User does not exist."
				}
				, {status: 400}
			);
		}

		if (!user.isAcceptingMessages) {
			return Response.json(
			{ 
					message: 'User is not accepting messages', 
					success: false 
				},
				{ status: 403 } // 403 Forbidden status
			);
		}

		const newMessage = { content, createdAt: new Date()};

		user.messages.push(newMessage as Message);
		await user.save();

		return Response.json(
			{
				messasge: "Message sent successfully",
				success: true,
			},
			{ status: 201}
		);
	} catch(error){
		console.error("Error adding message: ", error);
		return Response.json(
			{
				messasge: "Internal server error",
				success: false,
			},
			{ status: 500}
		);
	}	
}