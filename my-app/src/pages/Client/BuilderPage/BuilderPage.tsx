import { useState } from "react"
import WebBuilder from "@/components/WebBuilder/WebBuilder"
import { useToast } from "@/components/ui/use-toast"

const BuilderPage = () => {
  const { toast } = useToast()
  const [savedContent, setSavedContent] = useState<{ html: string; css: string } | null>(null)

  const handleSave = (html: string, css: string) => {
    setSavedContent({ html, css })

    // Here you would typically save to a backend
    // For now, we'll just show a toast notification
    toast({
      title: "Page saved",
      description: "Your page has been saved successfully.",
    })
  }

  return (
    <div className="builder-page">
      <WebBuilder onSave={handleSave} />
    </div>
  )
}

export default BuilderPage

