let users = []

module.exports = {
    push: user => users.push(user),
    pop: user => users = users.filter(item => item.username !== user.username),
    checkUser: username => users.filter(item => item.username == username).length ? users.filter(item => item.username == username)[0] : false

}