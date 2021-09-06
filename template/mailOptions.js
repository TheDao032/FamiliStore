const environment = require('../environments/environment')

const registerOptions = (to, cusName, token) => {
    return {
        from: {
            name: 'FamilyStore',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Xác nhận Email',
        html: ` <h1>Chào ${cusName} thân mến! </h1><br>
                <h3>Bạn đã sử dung email ${to} để đăng ký tài khoản trên FamaliStore, chào mừng bạn đến với trang website của chúng tôi:</h3>
                <h3>Mã Xác minh: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
    
}
  
const forgotPasswordOptions = (to, cusName, token) => {
    return {
        from: {
            name: 'FamilyStore',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Quên mật khẩu',
        html: ` <h1>Chào ${cusName} thân mến! </h1><br>
                <h3>Mã Xác minh quên mật khẩu: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
}

const verifyBillOptions = (account, listProduct, address, receiverName, receiverPhone) => {
    
    var htmlOption = ` <h1>Chào quý khách thân mến! </h1><br>
    <h3>FamilyStore gửi quý khách hóa đơn điện tử. Quý khách vui lòng xem chi tiết hóa đợn bên dưới.</h3>
    <h3>Thông tin đơn hàng:</h3>
    <h3>Địa chỉ giao hàng: ${address}</h3>
    <h3>Thông tin khách hàng:</h3>
    <h4>        - ${account.acc_email}</h4>
    <h4>        - ${receiverName}</h4>
    <h4>        - ${receiverPhone}</h4><br>
    <h3>Danh sách sản phẩm:</h3>
    <div id="infoList">
        <table class="table table-hover" id="tableCategory">
            <thead>
                <tr style="background-color:bisque">
                    <th scope="col" class="text-center" style="width: 25%">Tên sản phầm</th>
                    <th scope="col" style="width: 25%;" class="text-center">Mô tả</th>
                    <th scope="col" style="width: 15%;" class="text-center">số lượng</th>
                    <th scope="col" class="text-center">Giá</th>
                </tr>
            </thead>
            <tbody id="tbodyCateParent">`
    listProduct.forEach((prod) => {
        const price = prod.prod_price * prod.bdetail_quantity
        htmlOption += `\n<div id="">
                            <tr>
                                <div style="size:100px;margin:1%;background-color:aliceblue">
                                    <td class="text-center">
                                        <label>${prod.prod_name}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${prod.prod_description}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${prod.bdetail_quantity}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${price}</label>
                                    </td>
                                </div>
                            </tr>
                        </div>`
    })

    htmlOption += `\n</tbody>
                </table>
            </div>
            <h3>Tổng tiền đơn hàng: ${listProduct[0].bill_total_price} VNĐ</h3>
            <h3>Trân trọng!</h3>`
    
    return {
        from: {
            name: 'FamilyStore',
            email: `${environment.mailConfig.user}`
        },
        to: `${account.acc_email}`,
        subject: 'Xác nhận đơn hàng',
        html: htmlOption
    }
}

module.exports = {
    registerOptions,
    forgotPasswordOptions,
    verifyBillOptions
}