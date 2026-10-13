import * as React from "react"
import { siApple, siGithub, siGoogle, siX } from "simple-icons"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const socialButtonIcons = {
  google: siGoogle,
  github: siGithub,
  apple: siApple,
  x: siX,
}

const socialButtonLabels = {
  google: "Google",
  github: "GitHub",
  apple: "Apple",
  x: "X",
}

type SocialButtonProvider = keyof typeof socialButtonIcons

interface SocialButtonProps extends React.ComponentProps<typeof Button> {
  provider: SocialButtonProvider
}

function SocialButton({
  provider,
  children,
  className,
  variant = "outline",
  size = "default",
  ...props
}: SocialButtonProps) {
  const icon = socialButtonIcons[provider]
  const label = socialButtonLabels[provider]

  return (
    <Button
      data-slot="social-button"
      variant={variant}
      size={size}
      className={cn("px-5 relative w-full", className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="left-2.5 size-4 absolute fill-current"
        viewBox="0 0 24 24"
      >
        <path d={icon.path} />
      </svg>
      <span>{children ?? `Login with ${label}`}</span>
    </Button>
  )
}

export { SocialButton, type SocialButtonProvider }
