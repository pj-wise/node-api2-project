import React from "react";
import { Route } from "react-router-dom";
import PostList from "./components/PostList";
import './App.css';

const App = () => {

  return (
    <div className="App">
      <Route exact path='/' component={PostList}/>
    </div>
  );
}

export default App;
