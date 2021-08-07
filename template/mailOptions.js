const environment = require('../environments/environment')

const registerOptions = (to, cusName, token) => {
    return {
        from: `<${environment.mailConfig.user}>`,
        to: `${to}`,
        subject: 'Xác nhận Email',
        html: ` <h1>Chào ${cusName} thân mến! </h1><br>
                <h3>Bạn đã chọn ${email} sử dung email để đăng ký tài khoản Famali Store, chào mừng bạn đến với trang thương mại điện tử của chúng tôi:</h3>
                <h3>Mã Xác minh: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
    
}
  
const forgotPasswordOptions = (to, cusName, token) => {
    return {
        from: `<${environment.mailConfig.user}>`,
        to: `${to}`,
        subject: 'Quên mật khẩu',
        html: ` <h1>Chào ${cusName} thân mến! </h1><br>
                <h3>Mã Xác minh quên mật khẩu: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
}

module.exports = {
    registerOptions,
    forgotPasswordOptions
}