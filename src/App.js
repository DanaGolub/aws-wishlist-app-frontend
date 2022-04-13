import * as amplify from './amplify'
import { useEffect, useState } from 'react'
import { Button, Text, View, Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

function App() {

  useEffect(() => {
    // getImages()
    getPosts();
    // getUser();
  }, [])

  const [file, setFile] = useState()
  const [imgUrl, setImgUrl] = useState([])
  const [description, setDescription] = useState("")
  const [arrayOfImages, setArrayOfImages] = useState([])
  const [updatedComment, setUpdatedComment] = useState({ updatedCommentText: "", boolUpdatedComment: false, postId: "" })
  const [arrayOfComments, setArrayOfComments] = useState([])

  const [comment, setComment] = useState({ commentText: "", postId: "" })


  const uploadImage = async event => {
    event.preventDefault()
    const result = await amplify.uploadImage(file)
    const url = await amplify.getImage(result.key)
    console.log(url)
    // setImgUrl(url)
    setImgUrl([url, ...imgUrl])
    console.log(imgUrl)
  }


  // async function createPost(file, description) {
  const createPost = async event => {
    event.preventDefault()
    const result = await amplify.createPost(file, description)
    console.log(result)
    getPosts()
  }


  async function getPosts() {
    // debugger
    const result = await amplify.getPosts()
    console.log('after loading page, get posts ' + result.comments)
    setArrayOfImages(result)
  }


  async function getUser() {
    const result = await amplify.getUser()
    console.log('after loading page, get user' + result)
    // setImgUrl(url)
  }


  async function getImages() {
    const url = await amplify.getImages()
    console.log('after loading page ' + url)
    setImgUrl(url)
  }


  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }


  async function deletePost(imageName, id, username) {
    console.log("VALUE OF ID PASSED FROM BTN CLICK " + id)
    const result = await amplify.deletePost(imageName, id, username)
    console.log('after deleting image ' + result)
    getPosts()
    // setImgUrl(url)
  }


  const createComment = async event => {
    event.preventDefault()
    console.log(comment)
    const result = await amplify.createComment(comment.postId, comment.commentText)
    getPosts()
  }


  // async function retrieveComments(postId) {
  //   const result = await amplify.getComments(postId)
  //   setArrayOfComments(result)
  //   result.map(comment => console.log(comment.text))
  //   // console.log(postId)
  //   // console.log(result)
  //   return result
  // }


  async function editComment(postId, commentId) {
    const result = await amplify.getComment(postId, commentId)

  }


  async function deleteComment(postId, commentId) {
    console.log(postId + " " + commentId)
    const result = await amplify.deleteComment(postId, commentId)
    setUpdatedComment({
      updatedCommentText: '',
      boolUpdatedComment: false
    })
    console.log('after deleting comment ' + result)
    getPosts()
  }


  return (
    <>
      <Authenticator className="loginWindow">
        {({ signOut, user }) => (
          <div className="App">
            <div className="top-section">
              <form className="post-form" onSubmit={createPost}>
                <input onChange={fileSelected} type="file" accept="image/*"></input>
                <input onChange={e => setDescription(e.target.value)} type="text" placeholder="description"></input>
                <button type="submit">Upload</button>
              </form>
              <Button onClick={signOut} size="small" type="submit" className="signout-btn">Sign Out</Button>
            </div>
            {
              arrayOfImages && arrayOfImages.map(image => (
                <div className="post-container" key={image.key} >
                  <p>{image.SK}</p>
                  <div className="post-img-btns-container">
                    <div className="img-descr">
                      <img className="post-img" src={image.imageUrl}></img>
                      {image.description && <p className="post-description">{image.description}</p>}
                      {image.comments && image.comments.map(cm => (
                        <div>
                          <Button onClick={() => deleteComment(cm.PK, cm.SK)} size="small">Delete</Button>
                          <Button onClick={() => setUpdatedComment({ updatedCommentText: cm.text, boolUpdatedComment: true, postId: cm.PK })} size="small">Edit Comment</Button>
                          <p>{cm.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="post-btns">
                      {user && <Button size="small" onClick={signOut}>Edit Post</Button >}
                      {user && <Button size="small" onClick={() => deletePost(image.imageName, image.id, user.username)}>Delete Post</Button >}
                    </div>
                  </div>
                  {/* Need to test if this is visible for non-logged in users ------> */}


                  {/* {updatedComment && (updatedComment.postId == image.SK) ? */}
                  {updatedComment && (updatedComment.postId == image.SK) ?
                    (
                      <form className="comment-form" onSubmit={editComment}>
                        <input
                          // value={updatedComment.postId}
                          value={updatedComment.updatedCommentText}
                          onChange={e => setUpdatedComment({ updatedCommentText: e.target.value, boolUpdatedComment: true, postId: image.SK })}
                          type="text"
                          placeholder="comment">
                        </input>
                        <Button onClick={() => console.log(updatedComment.updatedCommentText)} size="small">Edit this comment</Button>
                      </form>
                    )
                    :
                    (
                      <form className="comment-form" onSubmit={createComment}>
                        <input onChange={e => setComment({ commentText: e.target.value, postId: image.id })}
                          type="text"
                          placeholder="comment">
                        </input>
                        <Button size="small" type="submit">Add a comment</Button>
                      </form>
                    )
                  }
                  <hr />
                </div>
              )
              )
            }

          </div>
        )}
      </Authenticator>
    </>
  )
}

export default App




// && (updatedComment.postId !== image.SK)

// onClick={() => changeImage(image.imageUrl)}

// {
//   imgUrl.map(image => (
//     <figure >
//       {/* key={image.key} */}
//     <img 
//     // onClick={() => deleteImage(image.image_name) } 
//     src={imgUrl}>
//     </img>
//     {/* <figcaption>{image.description}</figcaption> */}
//     </figure>
//   ))
// }

// createPost('Dana',
//   'image description',
//   'image name')


// {
//   imgUrl.map(image => (
//     <figure >
//       {/* key={image.key} */}
//       <img
//         // onClick={() => deleteImage(image.image_name) }
//         src={image}>
//       </img>
//       <p>{description}</p>
//       {/* <figcaption>{image.description}</figcaption> */}
//     </figure>
//   ))
// }


{/* {retrieveComments(image.id).map(comment => <span>(comment.Text)</span>)} */ }
{/* {console.log(image.id + " image id from react render")} */ }
{/* {retrieveComments(image.id).map(comment => <p>{comment.Text}</p>)} */ }
{/* {arrayOfComments.map(cm => cm.text)} */ }


// let arrayOfImages = result.map(item => console.log(item))
// let dbArrayOfComments = result.map(item => amplify.getComments(item.postId))


// !updatedComment ?
//   <input onChange={e => setComment({ commentText: e.target.value, postId: image.id })} type="text" placeholder="comment"></input>
//   :



{/* <Button onClick={console.log(image)}>print</Button > */ }


{/* <input onChange={e => setComment(e.target.value)} type="text" placeholder="comment"></input> */ }

                      // <input  value={updatedComment.updatedCommentText} onChange={e => setComment({ commentText: e.target.value, postId: image.id })} type="text" placeholder="comment"></input>
