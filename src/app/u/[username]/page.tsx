"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"



export function TextareaForm() {
	const [isSendingMessage, setIsSendingMessage] = useState(false);


	const params = useParams<{ username: string }>();
	const username = params.username;

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
	})

	async function onSubmit(data: z.infer<typeof messageSchema>) {
		setIsSendingMessage(true);
		try {
			const response = await axios.post<ApiResponse>("/api/send-message", {
				...data,
				username
			});

			toast({
				title: response.data.message,
				variant: 'default',
			});

		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message ?? 'Failed to sent message';

			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setIsSendingMessage(false);
		}
	}

	return (
		<div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
			<h1 className="text-4xl font-bold mb-6 text-center">
				Public Profile Link
      	</h1>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Send a anonymous message to @{username}</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Start typing..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-center">
					{!isSendingMessage ? <Button type="submit">Submit</Button> : <Button disabled>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>}
				</div>
			</form>
		</Form>
		</div>
	)
}

export default TextareaForm;
