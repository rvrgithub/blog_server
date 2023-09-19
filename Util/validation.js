// exports.isPresent = function (name){
//     return Object.keys(req.body).length === 0
// }
exports.isValidName = function (name) {
    return /^[a-zA-Z ]{2,10}$/.test(name)
}
exports.isValidPhone = function (phone) {
    return /^((?!(0))[0-9]{10})$/.test(phone)
}

exports.isValidEmail = function (Email) {
    return /^(?=.{1,30}$)[a-zA-Z0-9_\.]+\@(([a-z])+\.)+([a-z]{2,4})$/.test(Email)
}

exports.isValidPwd = function (Password) {
    return /^[0-9]{8}$/.test(Password)
}

