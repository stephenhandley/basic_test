import { useBasic } from '@basictech/react'
import { PostList } from './components/PostList'
import './App.css'

function App() {
  const basic = useBasic()

  console.log("dbStatus", basic.dbStatus, basic.db);

  const isReady = basic.isAuthReady && basic.dbStatus == "ONLINE"

  return (
    <div className="app">
      <header>
        {basic.isSignedIn ? (
          <div className="auth">
            <p>Signed in as: {basic.user?.email}</p>
            <button onClick={basic.signout}>Sign Out</button>
          </div>
        ) : (
          <button onClick={basic.signin}>Sign In</button>
        )}
      </header>

      { isReady ? (
        <main>
          <PostList />
        </main>
      ) : (
        <div>
          <div>Loading...</div>
        </div>
      )}
    </div>
  )
}

export default App
