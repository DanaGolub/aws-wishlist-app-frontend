import Amplify, { API, Storage } from "aws-amplify"
import awsExports from "./aws-exports"

Amplify.configure(awsExports)

const apiName = 'wishListApp'

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b => b.toString(16)).join("")
}

export async function uploadImage(file) {
  const result = await Storage.put(randomString(), file);
  return result
}

export async function getImage(name) {
  const url = await Storage.get(name);
  return url;
}

//not sure this method works, left it here for test
export async function getImages() {
  const list = await Storage.list();
  return list;
} /////

export async function deleteImage(name) {
  const result = await Storage.remove(name);
  return result;
}


export async function getUser() {
  const path = `/users`
  const comments = await API.get(apiName, path)
  return comments.Items
}

export async function getPosts() {
  const path = '/posts'
  const result = await API.get(apiName, path)
  return await Promise.all(result.Items.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    const postId = (item.SK).replace("POST#", "")
    const comments = await getComments(postId)
    return {
      ...item,
      imageUrl,
      comments
    }
  }))
}


export async function getComments(postId) {
  const path = `/posts/${postId}/comments`
  const comments = await API.get(apiName, path)
  return comments.Items
}


export async function updatePost(pId, description) {
  const postId = (pId).replace("POST#", "")

  const path = `/posts/${postId}`
  console.log('path for del url: ' + path)
  const result = await API.put(apiName, path, {
    body: {
      description,
    }
  })
  console.log(result)
  return result;
}


export async function updateComment(pId, cId, comment) {
  const postId = (pId).replace("POST#", "")
  const commentId = (cId).replace("COMMENT#", "")
  console.log(comment)
  const path = `/posts/${postId}/${commentId}`
  console.log('path for del url: ' + path)
  const result = await API.put(apiName, path, {
    body: {
      comment,
    }
  })
  console.log(result)
  return result;
}




export async function createComment(postId, text) {
  const path = `/posts/${postId}/comments`
  const result = await API.post(apiName, path, {
    body: {
      text
    }
  })
  return result
}


export async function createPost(file, description) {
  const { key } = await Storage.put(randomString(), file);
  const path = '/posts'
  const result = await API.post(apiName, path, {
    body: {
      imageName: key,
      description
    }
  })
  console.log(result)
  return result
}


export async function deletePost(imgName, postId, username) {
  const path = `/posts/${postId}`
  console.log('path for del url: ' + path)
  const result = await API.del(apiName, path)
  const deletedImg = await deleteImage(imgName)
  console.log(deletedImg)
  return result;
}


export async function deleteComment(pId, cId) {
  const postId = (pId).replace("POST#", "")
  const commentId = (cId).replace("COMMENT#", "")
  const path = `/posts/${postId}/${commentId}`
  console.log('path for del url: ' + path)
  const result = await API.del(apiName, path)
  console.log(result)
  return result;
}

