const jwt = require("jsonwebtoken");

const secret = '@Harhil@';

function createTokeForUser(user){

    const payload= {
        _id : user._id,
        email : user.email,
        profileImageURL : user.profileImageUrl,
        role : user.role,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

function validetToken(token){
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    createTokeForUser,
    validetToken,
}