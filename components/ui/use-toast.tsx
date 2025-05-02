import { useState } from "react"

interface ToastProps {
  title: string
  description?: string
}

export function toast(props: ToastProps) {
  // Basic implementation - you might want to replace this with a proper toast library
  alert(`${props.title}\n${props.description || ''}`)
}