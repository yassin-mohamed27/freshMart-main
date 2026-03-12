export interface SuccessLogin {
    message: string
    user: UserInterface
    token: string
}
export interface FailedLogin {
    message: string
    statusMsg: string
}
export interface UserInterface {
    token: string
    name: string
    email: string
    role: string
    _id: string 

}
