"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster=({...props})=>{
  const {theme="system"}=useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "!text-gray-700 dark:!text-gray-300 !font-normal",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
          success: "!border-l-4 !border-l-green-500 !bg-green-50 dark:!bg-green-950/20 !text-green-800 dark:!text-green-300",
          error: "!border-l-4 !border-l-red-500 !bg-red-50 dark:!bg-red-950/20 !text-red-800 dark:!text-red-300",
          loading: "!border-l-4 !border-l-blue-500 !bg-blue-50 dark:!bg-blue-950/20 !text-blue-800 dark:!text-blue-300",
          default: "!border-l-4 !border-l-gray-300 !bg-gray-50 dark:!bg-gray-800/30 !text-gray-800 dark:!text-gray-200"
        },
      }}
      {...props} />)
  );
}

export { Toaster }
