const str = `
## Test Simple

# Yesssssssssss

super cool text

## First Anchor

aosidjaosidjaosidjaoisdjaosidddddddddddddddddddddddddddd as dasddddddddd asdddddddddddd a sd asd asdasd asd asd asd asd asd asd .

eeeeeeeeeeeeeeeeeeeeeee

goto [subfolder](subfolder/index)
and [sub1](subfolder/subpageone)

<!-- <Search /> -->

<!-- {{msg}} -->`;

const result = str.split(/(^|\s)#{2}\s/gi);
const cleaning = result.filter(i => i != "" && i != "\n")
const mdData = cleaning.map(i => {
    let content = i.split("\n")
    let anchor = content.shift()
    return { anchor, content: content.join("\n") }
})


console.log(mdData);