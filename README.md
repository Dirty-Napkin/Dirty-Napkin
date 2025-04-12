# Dirty Napkin
## Live Site
[https://dirtynapkin.netlify.app/](https://dirtynapkin.netlify.app/)
[https://dirtynapkin.co](https://dirtynapkin.co)
## Dev Site
[https://dirtynapkindev.netlify.app/](https://dirtynapkindev.netlify.app/)

## Guidelines
### Before Working:
- Fetch and pull from origin before doing anything else
- Make all changes on branches from the dev branch. DO NOT touch `main` or `dev` branches

### While Working:
- Use comments to organize and explain your code. Remember that others need to be able to understand what's going on
    - Similarly, make sure that all `img` elements have an `alt` attribute
- If you use AI to help you code, you should still understand what each line does and how the code works. This includes removing redundant or irrelevant elements of the code
- Commit and push often
    - Commit messages should be brief but specific. Use [Gitmoji](https://gitmoji.dev/) at the beginning of your commit messages to improve organization and clarity
- Except for `.README`, all file names are fully lowercase with dashes or underscores. `.html` and `.kit` files should only use dashes. Other things that get named (variables, functions, classes, ids, etc) use camel case (ex: `functionName`)
    - File names should not contain spaces
- Use the modularity of Prepros to keep things simple and organized. You shouldn't need to touch `styles.css` or any of the `.html` files
    - When creating a new `.kit` file, be sure to properly configure Prepros to output the right file in the right place. A template `.kit` file is in the dev folder
- We are going to use a spritesheet instead of FontAwesome
- Remember that [special characters need to be encoded](https://emn178.github.io/online-tools/html_encode.html)
- Be mindful of load times and don't overcomplicate
    - If you can animate using CSS [transitions](https://www.w3schools.com/css/css3_transitions.asp) or [animations](https://www.w3schools.com/css/css3_animations.asp), you don't need to use JS or AfterEffects
    - It might be better to use responsive images in some places. For example, instead of
  
      ```<img src="/assets/window_lockup.png" alt="The Window logo lockup">```
      
      you can use [this](https://github.com/Dirty-Napkin/Dirty-Napkin/blob/dev/docs/snippets.md#responsive-images)

### When You Are Done Working:
- Validate `styles.css` and all new or modified `.html` files
    - [HTML Validator](https://validator.w3.org/#validate_by_upload)
    - [CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_upload)
- Commit and push any remaining local changes
- Create a pull request for your branch to be merged back into the `dev` branch