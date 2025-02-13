"use client"

import { Suspense, useState } from 'react'
import { useBasic } from '@basictech/react'
import { useIsAdminSignedIn } from '../hooks/admin'
import { QuerySwitcher } from '../components/QuerySwitcher'
import { PostComments } from './PostComments'
import { PostForm } from './PostForm'

interface Post {
  id: string
  title: string
  body: string
}

interface PostItemProps {
  post: Post
  isAuthor: boolean
  isSignedIn: boolean
  onUpdate: () => void
}

function PostItem({ post, isAuthor, isSignedIn, onUpdate }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdateSuccess = () => {
    setIsEditing(false)
    onUpdate()
  }

  if (isEditing) {
    return (
      <div className="mb-8 p-5 border border-gray-200 rounded">
        <PostForm 
          post={post} 
          isEdit 
          onSuccess={handleUpdateSuccess} 
        />
      </div>
    )
  }

  return (
    <div className="mb-8 p-5 border border-gray-200 rounded relative">
      {isAuthor && (
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 btn-secondary"
        >
          Edit
        </button>
      )}
      
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.body}</p>

      <Suspense fallback={<div>Loading comments...</div>}>
        <PostComments postId={post.id} isSignedIn={isSignedIn} />
      </Suspense>
    </div>
  )
}

export function PostContent() {
  const { isSignedIn } = useBasic()
  const isAuthor = useIsAdminSignedIn()
  const [showForm, setShowForm] = useState(false)
  
  return (
    <QuerySwitcher collection="post">
      {(query) => {
        const { data: posts, error, isLoading: loading, refetch } = query
        
        if (loading) return <div>Loading posts...</div>
        if (error) return <div className="text-red-600">Error: {error}</div>

        // Sort posts by createdAt in descending order
        const sortedPosts = posts?.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        return (
          <>
            {!showForm ? (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-primary mb-4"
              >
                Add Post
              </button>
            ) : (
              <div className="mb-4">
                <PostForm 
                  onSuccess={() => {
                    setShowForm(false);
                    refetch();
                  }} 
                />
              </div>
            )}

            {sortedPosts?.length > 0 ? posts?.map((post: Post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                isAuthor={isAuthor} 
                isSignedIn={isSignedIn}
                onUpdate={refetch}
              />
            )) : <div>No posts</div>}
          </>
        )
      }}
    </QuerySwitcher>
  )
} 