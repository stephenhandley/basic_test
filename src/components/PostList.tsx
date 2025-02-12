import { useBasic, useQuery } from '@basictech/react'
import { isUserAdmin } from '../hooks/isUserAdmin'

interface Post {
  id: string
  title: string
  body: string
}

interface Comment {
  id: string
  post_id: string
  body: string
}

export function PostList() {
  const { isSignedIn, user, db } = useBasic()
  const isAuthor = isUserAdmin(user)

  // Correct usage of useQuery with functions
  const posts = useQuery(() => db.collection('post').getAll())
  const comments = useQuery(() => db.collection('comment').getAll())

  const handleAddComment = async (postId: string, body: string) => {
    await db.collection('comment').add({
      post_id: postId,
      body
    })
  }

  const handleCreatePost = async (title: string, body: string) => {
    await db.collection('post').add({
      title,
      body
    })
  }

  const handleUpdatePost = async (id: string, title: string, body: string) => {
    await db.collection('post').update(id, {
      title,
      body
    })
  }

  return (
    <div className="post-list">
      {isAuthor && (
        <div className="new-post">
          <h2>Create New Post</h2>
          <form onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const title = (form.elements.namedItem('title') as HTMLInputElement).value
            const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value
            handleCreatePost(title, body)
            form.reset()
          }}>
            <input name="title" placeholder="Title" required />
            <textarea name="body" placeholder="Body" required />
            <button type="submit">Create Post</button>
          </form>
        </div>
      )}

      {posts?.map((post: Post) => (
        <div key={post.id} className="post">
          {isAuthor ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const title = (form.elements.namedItem('title') as HTMLInputElement).value
              const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value
              handleUpdatePost(post.id, title, body)
            }}>
              <input name="title" defaultValue={post.title} />
              <textarea name="body" defaultValue={post.body} />
              <button type="submit">Update Post</button>
            </form>
          ) : (
            <>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </>
          )}

          <div className="comments">
            <h3>Comments</h3>
            {comments
              ?.filter((comment: Comment) => comment.post_id === post.id)
              .map((comment: Comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.body}</p>
                </div>
              ))}

            {isSignedIn && (
              <form onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value
                handleAddComment(post.id, body)
                form.reset()
              }}>
                <textarea name="body" placeholder="Add a comment..." required />
                <button type="submit">Add Comment</button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 