'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-red-500 rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Application Error</h2>
            <p className="text-gray-300 mb-4">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

