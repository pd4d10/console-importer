const input = document.querySelector('input')

input.addEventListener('keyup', function () {
  fetch('https://api.cdnjs.com/libraries?search=' + input.value)
    .then(res => res.json())
    .then(json => {
      document.querySelector('table').innerHTML = json
    })
})
