'use client'

import { Message } from "@/models/User"
import { useState } from "react"

const page = () => {
	const [messages, setMessages] = useState<Message[]>([])

  return (
	 <div>page</div>
  )
}

export default page