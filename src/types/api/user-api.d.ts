declare interface ISignIn {
  email: string
  password: string
}

declare interface ISignInRes {
  token: string
  user: IUser
}

declare interface IUser {
  _id: string
  name: string
  email: string
  birthday: string
  gender: Gender
  role: AdminRole
}

declare type UpdateUser = Pick<IUser, 'name' | 'birthday' | 'gender'>

declare type ChangePass = {
  oldPass: string
  newPass: string
}
