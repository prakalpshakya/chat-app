const messageForm = document.querySelector('form')
const user = document.querySelector('input')
const message = document.querySelector('textarea')
const messages = document.querySelector('#messages')
const doc = document.querySelector('input[type="file"]')

const getMessages = async (url = '') => {
  const response = await fetch(url)

  return response.json()
}

getMessages('http://localhost:3000/messages').then((data) => {
  if (data.errors) {
    alert(data.message)
  }
  data.forEach((message) => {
    addMessage(message)
  })
})

const arrayBufferToBase64 = (buffer) => {
  let binary = ''
  let bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const addMessage = (message) => {
  let imgTag = ''
  if (message.doc !== undefined) {
    const buffer = message.doc.data
    const imgSrc = `data:image/png;base64,${arrayBufferToBase64(buffer)}`
    imgTag = `<img src=${imgSrc}>`
  }

  messages.innerHTML += `<h4>${message.name}</h4> <p>${message.message}</p> ${imgTag}`
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData()
  formData.append('name', user.value)
  formData.append('message', message.value)

  if (doc.files[0] !== undefined) {
    formData.append('doc', doc.files[0])
  }

  postMessage('http://localhost:3000/messages', formData).then((data) => {
    if (data.errors) {
      alert(data.message)
    }
  })
})

const postMessage = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  })

  return response.json()
}
