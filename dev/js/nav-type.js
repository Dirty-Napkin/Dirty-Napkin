console.log("Hello World - nav-type.js is working!");

document.addEventListener("DOMContentLoaded", () => {
    const textElement = document.querySelector(".centered-text")
    const shiftedLetter = document.querySelector(".shift-letter")
  
    textElement.addEventListener("mouseenter", () => {
      const fontSize = window.getComputedStyle(shiftedLetter).fontSize
      const letterSpacing = window.getComputedStyle(shiftedLetter).letterSpacing
      const shiftAmount = parseFloat(fontSize) * 1 // Moves R one character height down
      
      // Create a temporary span to measure character width
      const tempSpan = document.createElement('span')
      tempSpan.textContent = 'R' // Using the same character as reference
      tempSpan.style.visibility = 'hidden'
      tempSpan.style.position = 'absolute'
      tempSpan.style.fontSize = fontSize
      tempSpan.style.letterSpacing = letterSpacing
      document.body.appendChild(tempSpan)
      const charWidth = tempSpan.offsetWidth
      document.body.removeChild(tempSpan)
  
      shiftedLetter.style.transform = `translateY(${shiftAmount}px) translateX(${charWidth}px)`
    })
  
    textElement.addEventListener("mouseleave", () => {
      shiftedLetter.style.transform = "translateY(0)"
    })
  })
  