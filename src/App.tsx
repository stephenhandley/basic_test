import { useBasic } from '@basictech/react'
import { Header } from './components/Header'
import { PostList } from './components/PostList'
import { DataProvider } from './context/DataContext'

function App() {
  const { isAuthReady, isSignedIn } = useBasic()

  return (
    <DataProvider>
      {isAuthReady ? (
        <>
          <Header />
          {isSignedIn && (
            <main className="max-w-5xl mx-auto p-5">
              <PostList />
            </main>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}
    </DataProvider>
  )
}

export default App
