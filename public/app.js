const messageForm = document.querySelector('form')
const user = document.querySelector('input')
const message = document.querySelector('textarea')
const messages = document.querySelector('#messages')

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
  messages.innerHTML += `<h4>${message.name}</h4> <p>${message.message}</p>`
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const userValue = user.value
  const messageValue = message.value

  postMessage('http://localhost:3000/messages', {
    name: userValue,
    message: messageValue,
  }).then((data) => {
    if (data.errors) {
      alert(data.message)
    }
  })
})

const postMessage = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return response.json()
}
