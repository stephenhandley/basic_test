"use client"

import { Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { PostContent } from './PostContent'

function ErrorFallback({ error }: { error: Error }) {
  return <div className="text-red-600">Error: {error.message}</div>
}

export function PostList() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="space-y-8">        
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostContent />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
} 