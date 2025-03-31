"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleItemClick = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={openItem || ""}
      onValueChange={setOpenItem}
      className="w-full"
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AccordionItem value={`item-${index}`} className="mb-4 border rounded-lg overflow-hidden">
            <AccordionTrigger 
              onClick={() => handleItemClick(`item-${index}`)}
              className="px-6 py-4 hover:bg-muted/50 transition-colors font-semibold"
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-2 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}
