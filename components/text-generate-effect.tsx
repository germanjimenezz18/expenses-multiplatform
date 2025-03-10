"use client"; // @NOTE: add in case you are using Next.js

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


export function TextGenerateEffectExample() {
  const text = `Open Source Expense Tracker, manage your budget and gain insights.`;

  return <TextGenerateEffect text={text} duration={0.3} />;
}

type TextGenerateEffectProps = {
  text: string;
  duration?: number;
} & React.ComponentProps<"span">;

function TextGenerateEffect({
  text,
  duration = 0.3,
  className,
}: TextGenerateEffectProps) {
  return (
    <motion.div className="inline-block whitespace-pre">
      {text.split("").map((char, index) => (
        <motion.span
          key={char + index}
          className={cn(
            "inline-block whitespace-pre text-neutral-200",
            className,
          )}
          initial={{ opacity: 0, filter: "blur(4px)", rotateX: 90, y: 5 }}
          whileInView={{
            opacity: 1,
            filter: "blur(0px)",
            rotateX: 0,
            y: 0,
          }}
          transition={{
            ease: "easeOut",
            duration: duration,
            delay: index * 0.015,
          }}
          viewport={{ once: true }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}
