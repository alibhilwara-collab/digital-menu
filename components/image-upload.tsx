"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { ImageIcon, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  aspectRatio?: "square" | "video"
}

export function ImageUpload({
  value,
  onChange,
  folder = "items",
  className = "",
  aspectRatio = "square",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not logged in")

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName)

      onChange(publicUrl)
      toast.success("Image uploaded!")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed"
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleRemove() {
    onChange("")
  }

  const aspectClass = aspectRatio === "video" ? "aspect-video" : "aspect-square"

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image"
      />

      {value ? (
        <div className={`relative ${aspectClass} overflow-hidden rounded-lg border border-border`}>
          <img
            src={value}
            alt="Uploaded"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 opacity-0 transition-opacity hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-background"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground transition-colors hover:bg-destructive"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex ${aspectClass} w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Click to upload</span>
            </div>
          )}
        </button>
      )}
    </div>
  )
}
