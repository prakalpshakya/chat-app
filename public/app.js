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

const addMessage = (message) => {
  let fileTag = ''
  if (message.file !== undefined) {
    if (message.file.filetype === 'image') {
      fileTag = `<img src='/docs/${message.file.filename}' width='200' height = '150'} >`
    } else {
      fileTag = `<a href='/docs/${message.file.filename}'>PDF file</a>`
    }
  }

  messages.innerHTML += `<h4>${message.name}</h4> <p>${message.message}</p> ${fileTag}`
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
    doc.value = ''
    message.value = ''
  })
})

const postMessage = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  })

  return response.json()
}
