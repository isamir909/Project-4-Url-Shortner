
// const isValidString=function(value){
//    console.log(typeof value)
// if(typeof value!="string"|| value==="undefined" )return true
// if (value === null) return false
// return true
// }


// const isValid = function (value) {
//     console.log(typeof value)
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true;
// }

let isBodyExist = function (Body) {
    if (Body === undefined || Object.keys(Body).length === 0) return true
}


module.exports.isBodyExist=isBodyExist