function drag(element, _left, _top) {
  let parentElement = element.parentElement || element
  let dx = 0
  let dy = 0
  let left = 0
  let top = 0
  function mousemove(e) {
    left = e.clientX
    top = e.clientY
    parentElement.style.marginTop = 0
    parentElement.style.marginLeft = 0
    parentElement.style.top = top - dy + 'px'
    parentElement.style.left = left - dx + 'px'
    element.addEventListener('mouseup', mouseup)
  }
  function mouseup() {
    parentElement.style.cursor = 'default'
    element.removeEventListener('mousemove', mousemove)
    element.removeEventListener('mouseup', mouseup)
  }
  element.addEventListener('mousedown', (e) => {
    parentElement.style.cursor = 'all-scroll'
    dx = e.clientX - parentElement.offsetLeft
    dy = e.clientY - parentElement.offsetTop
    element.addEventListener('mousemove', mousemove)
    element.addEventListener('mouseup', mouseup)
  })
}
export default drag
