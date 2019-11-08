const form = document.forms.namedItem('file-upload')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = new FormData(form)
  try {
    const response = await axios.post('http://localhost:5000/upload', data)
    const image = response.data
    console.log(image)
    const img = `
      <img src="${image}"></img>
    `
    form.insertAdjacentHTML('afterend', img);
  } catch(err) {
    console.log(err.message)
  }
})