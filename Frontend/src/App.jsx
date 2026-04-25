import React from 'react'
import{BrowserRouter as Router, Routes, Route} from "react-router-dom"
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'

const App = () => {
  return (
    <>
    {/* <div>
      App
    </div> */}
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello World</h1>}/>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/feed" element={<Feed />}/>
      </Routes>
    </Router>      
    </>
    
  )
}

export default App;
