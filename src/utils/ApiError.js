
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}




















// class ApiError extends Error {
//     constructor(//making constructor
//         statusCode,//jo bhi constructor ko use krega vo statuscode dega
//         message= "Something went wrong",
//         errors = [],
//         stack = ""
//     ){
//         super(message)//overwrite sbhko
//         this.statusCode = statusCode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors//error replace with humara error

//         if (stack) {
//             this.stack = stack
//         } else{
//             Error.captureStackTrace(this, this.constructor)//stack race k andr uska instance pass krdiy h
//         }

//     }
// }

// export {ApiError}

