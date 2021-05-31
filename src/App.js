import React, { Component } from "react";
import http from './services/httpService'
import "./App.css";
import config from "./config.json";
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
class App extends Component {
  state = {
    posts: []
  };

  handleAdd = async() => {
  const obj = {title:'a', body:'b'};
  const {data:post} = await http.post(config.apiEndPoint, obj)
  const posts = [post, ...this.state.posts]  
  this.setState({posts})
  };

  handleUpdate = async post => {
    console.log("Update", post);
    post.title = "UPDATED";
    const {data} = await http.put(config.apiEndPoint + '/' + post.id, post);
    console.log(data);
    const posts = [...this.state.posts];
    const index  = posts.indexOf(post);
    posts[index] = {...post};
    this.setState({posts});

    //http.patch(api.config.apiEndPoint + '/' + post.id, {title:post.title})

  };

  handleDelete = async post => {
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter(p=>p.id !== post.id)
    this.setState({posts});
    
    try
    {
      await http.delete(config.apiEndPoint + '/' + post.id);   
    }
    catch(ex){
      if(ex.response && ex.response.status === 404)
        toast.error("This post has already been deleted.");

      this.setState({posts:originalPosts});

    }
  };
  async componentDidMount(){
    const {data:posts} = await http.get(config.apiEndPoint);
    this.setState({posts});
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer/>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
