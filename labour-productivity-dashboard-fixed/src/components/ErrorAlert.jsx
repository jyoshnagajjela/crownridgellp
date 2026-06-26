function ErrorAlert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-lg flex-shrink-0">&#9888;</span>
        <p className="text-red-700 text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 flex-shrink-0 font-bold text-lg leading-none"
          aria-label="Dismiss error"
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default ErrorAlert
