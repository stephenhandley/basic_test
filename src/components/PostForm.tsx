"use client"

import { useMutation } from '../hooks/useMutation'

interface PostFormProps {
  post?: {
    id: string
    title: string
    body: string
  }
  isEdit?: boolean
  onSuccess?: () => void
}

export function PostForm({ post, isEdit, onSuccess }: PostFormProps) {
  const { mutate: createPost, loading: createLoading } = useMutation({ 
    collection: "post",
    action: "create"
  })
  
  const { mutate: updatePost, loading: updateLoading } = useMutation({ 
    collection: "post",
    action: 'update',
    id: post?.id
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const body = formData.get('body') as string

    try {
      if (isEdit && post) {
        await updatePost({ title, body })
      } else {
        await createPost({ title, body })
      }
      await onSuccess?.()
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input 
          name="title" 
          placeholder="Title" 
          defaultValue={post?.title}
          required 
          className="p-2 border border-gray-200 rounded"
        />
        <textarea 
          name="body" 
          placeholder="Body" 
          defaultValue={post?.body}
          required 
          className="p-2 border border-gray-200 rounded min-h-[100px]"
        />
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={createLoading || updateLoading}
          >
            {isEdit ? 'Update Post' : 'Create Post'}
          </button>
          {!isEdit && (
            <button 
              type="button" 
              onClick={() => onSuccess?.()}
              className="btn-secondary"
              disabled={createLoading || updateLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 