"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface ResumeButtonProps extends ButtonProps {
  resumeUrl?: string
}

export function ResumeButton({
  resumeUrl = "/resume.pdf",
  children = "Download Resume",
  variant = "default",
  ...props
}: ResumeButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Create a link element
      const link = document.createElement("a")
      link.href = resumeUrl
      link.setAttribute("download", "Harshil_P_Resume.pdf")
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} variant={variant} {...props}>
      {isDownloading ? "Downloading..." : children}
      <Download className="ml-2 h-4 w-4" />
    </Button>
  )
}
