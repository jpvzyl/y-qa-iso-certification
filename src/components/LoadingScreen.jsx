import { Shield } from 'lucide-react'

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield size={16} className="text-emerald-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  )
}
