"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import axios from "axios";

type Message = {
  id: number;
  text: string;
  isBot: boolean;
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", isBot: true },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        isBot: false,
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      //  bot response

      try {
        const response = await axios.post("http://127.0.0.1:8000/query", {
          question: inputMessage,
        });
        const botResponse: Message = {
          id: messages.length + 2,
          text: response.data.answer,
          isBot: true,
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error querrying the backend", error);
        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Oops! Something went wrong. Please try again later.",
          isBot: true,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto my-7 h-[600px] flex flex-col">
      <CardContent className="flex-grow p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 transition-all duration-300 ease-in-out animate-fadeIn ${
                  message.isBot ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                <Avatar
                  className={message.isBot ? "bg-primary" : "bg-secondary"}
                >
                  <AvatarFallback>
                    {message.isBot ? <Bot /> : <User />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.isBot
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
