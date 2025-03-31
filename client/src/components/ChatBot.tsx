import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your health assistant. Ask me anything about nutrition, calories, diet plans, or workout recommendations.",
      timestamp: new Date(),
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever chat history updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Send chat message to API
  // Default responses when API fails
  const defaultResponses = {
    "calories": "To estimate calories in food, consider the major macronutrients: proteins (4 calories/gram), carbohydrates (4 calories/gram), and fats (9 calories/gram). For an average meal, this could range from 300-800 calories depending on portion size and ingredients.",
    "meal plan": "A balanced meal plan should include proteins (lean meats, beans, tofu), complex carbohydrates (whole grains, vegetables), healthy fats (avocados, nuts, olive oil), and plenty of fruits and vegetables. Try to distribute calories as approximately 30% protein, 40% carbs, and 30% healthy fats.",
    "workout": "For an effective workout routine, combine cardio (running, cycling, swimming) with strength training (weights, resistance bands, bodyweight exercises). Aim for 150 minutes of moderate activity per week with 2-3 strength sessions. Always include warm-up and cool-down periods.",
    "weight loss": "Sustainable weight loss combines a moderate calorie deficit (300-500 calories/day), regular physical activity, adequate protein intake, and sufficient sleep. Focus on whole foods, increase vegetable intake, and stay well-hydrated.",
    "nutrition": "Good nutrition requires a balanced intake of macronutrients (proteins, carbs, fats) and micronutrients (vitamins and minerals). Prioritize whole foods like vegetables, fruits, lean proteins, whole grains, and healthy fats while limiting processed foods, added sugars, and excessive sodium.",
    "protein": "Good protein sources include lean meats (chicken, turkey), fish (salmon, tuna), dairy (Greek yogurt, cottage cheese), eggs, legumes (beans, lentils), tofu, tempeh, and protein supplements like whey or plant-based protein powders.",
  };

  // Function to get a default response based on keywords in the message
  const getDefaultResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(defaultResponses)) {
      if (lowercaseMessage.includes(keyword)) {
        return response;
      }
    }
    
    return "I can help you with questions about calories, meal planning, workouts, weight loss, nutrition, and protein sources. What would you like to know about today?";
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        const res = await apiRequest("POST", "/api/chat", { content });
        return await res.json();
      } catch (error) {
        // If API fails, use our default response system
        return { 
          response: getDefaultResponse(content),
          isDefault: true 
        };
      }
    },
    onSuccess: (data: { response: string, isDefault?: boolean }) => {
      // Add assistant's response to chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
      
      // If using default response, show a toast message
      if (data.isDefault) {
        toast({
          title: "Using Demo Mode",
          description: "Showing sample responses as the AI connection is unavailable",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      
      // Add error message to chat
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
        timestamp: new Date(),
      },
    ]);
    
    // Send to API
    sendMessageMutation.mutate(message);
    
    // Clear input
    setMessage("");
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[90px] right-6 w-[350px] sm:w-[400px] z-50"
          >
            <Card className="overflow-hidden shadow-xl border-2">
              <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <h3 className="font-semibold">Health Assistant</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          msg.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div
                            className={`p-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground px-1">
                            {format(new Date(msg.timestamp), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p className="text-sm">Thinking...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <Textarea
                    placeholder="Ask about nutrition, calories, meal planning..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="mb-1 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  <p>Powered by AI • Nutrition information is general advice only</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}