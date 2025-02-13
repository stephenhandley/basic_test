"use client"

import { useState } from 'react'
import { useBasicQuery, useBasicMutation } from '../hooks/api'

interface Comment {
  id: string
  body: string
  postId: string
  createdAt: string
}

interface PostCommentsProps {
  postId: string
  isSignedIn: boolean
}

export function PostComments({ postId, isSignedIn }: PostCommentsProps) {
  const [newComment, setNewComment] = useState('')
  const { data: allComments, loading, error, refresh } = useBasicQuery({ 
    path: 'comment'
  })
  
  const { mutate: createComment, loading: isSubmitting } = useBasicMutation({
    path: 'comment',
    method: 'POST'
  })

  // Filter comments for this post
  const comments = allComments?.filter((comment: Comment) => comment.postId === postId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createComment({ 
        body: newComment,
        postId: postId
      })
      setNewComment('')
      refresh()
    } catch (error) {
      console.error('Failed to post comment:', error)
    }
  }

  if (loading) return <div>Loading comments...</div>
  if (error) return <div className="text-red-600">Error loading comments</div>

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <div className="space-y-4">
        {comments?.length > 0 ? (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded">
              <p className="text-gray-700">{comment.body}</p>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>

      {isSignedIn && (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            className="w-full p-2 border border-gray-200 rounded min-h-[80px] mb-2"
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            Post Comment
          </button>
        </form>
      )}
    </div>
  )
} 