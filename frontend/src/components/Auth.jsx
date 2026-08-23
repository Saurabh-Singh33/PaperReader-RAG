import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Auth({ compact = false }) {
  const { isSignedIn, user } = useUser()

  if (!isSignedIn) {
    return (
      <div className="auth-actions">
        <SignInButton mode="modal"><button className="button button-quiet">Sign in</button></SignInButton>
        <SignUpButton mode="modal"><button className="button button-dark">Get started <ArrowRight size={16} /></button></SignUpButton>
      </div>
    )
  }

  return (
    <div className={`user-area ${compact ? 'user-area-compact' : ''}`}>
      {!compact && <span>Hi, {user.firstName || 'reader'} <Sparkles size={14} /></span>}
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
