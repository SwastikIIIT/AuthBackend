import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export const Hero = React.forwardRef((props, ref) => {
  const {
    className,
    gradient = true,
    blur = true,
    title,
    subtitle,
    actions,
    titleClassName,
    subtitleClassName,
    actionsClassName,
    ...rest
  } = props;

  return (
    <section
      ref={ref}
      className={cn(
        "relative z-0 flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-black",
        className
      )}
      {...rest}
    >
      {gradient && (
        <div className="absolute top-0 isolate z-0 flex w-screen flex-1 items-start justify-center">
          {blur && (
            <div className="absolute top-0 z-50 h-48 w-screen bg-transparent opacity-10 backdrop-blur-md" />
          )}

          {/* Main glow */}
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-purple-600/60 opacity-80 blur-3xl" />

          {/* Lamp effect */}
          <motion.div
            initial={{ width: "10rem" }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
            whileInView={{ width: "16rem" }}
            className="absolute top-0 z-30 h-36 -translate-y-[20%] rounded-full bg-purple-600/60 blur-2xl"
          />

          {/* Top line */}
          <motion.div
            initial={{ width: "20rem" }}
            viewport={{ once: true }}
            transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
            whileInView={{ width: "30rem" }}
            className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-purple-600/60"
          />

          {/* Left gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: "20rem" }}
            whileInView={{ opacity: 1, width: "40rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-purple-600/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 h-[100%] left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>

          {/* Right gradient cone */}
          <motion.div
            initial={{ opacity: 0.5, width: "20rem" }}
            whileInView={{ opacity: 1, width: "40rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-purple-600/60 [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-40 h-[100%] right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ y: 100, opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="relative z-50 container flex justify-center flex-1 flex-col px-5 md:px-10 gap-4 -translate-y-20"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <h1
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white",
              titleClassName
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={cn("text-xl text-gray-300", subtitleClassName)}>
              {subtitle}
            </p>
          )}
          {actions && actions.length > 0 && (
            <div className={cn("flex gap-4", actionsClassName)}>
              {actions.map((action, index) => (
                <Link key={index} href={action.href}>
                <Button  variant={"default"} className="bg-purple-600 hover:bg-purple-700">
                {action.label}
                  <span  className="ml-3  text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                  transition-all duration-300">→</span>
                </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
});

Hero.displayName = "Hero";