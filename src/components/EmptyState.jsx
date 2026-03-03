export default function EmptyState({ icon: Icon, title, description, action, actionLabel, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-900/50 border border-gray-800/50 py-16 animate-fade-in">
      {Icon && (
        <div className="mb-4 rounded-2xl bg-gray-800/50 p-4">
          <Icon size={40} className="text-gray-600" />
        </div>
      )}
      <p className="text-lg font-medium text-gray-400">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-center text-sm text-gray-600">{description}</p>
      )}
      {action && (
        <button
          onClick={action}
          className="mt-4 flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
      {children}
    </div>
  )
}
