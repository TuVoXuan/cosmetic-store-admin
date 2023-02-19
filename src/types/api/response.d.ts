declare interface IResponseSuccess<T> {
  message: string
  data: T
}
declare interface IResponseError {
  error: string
  statusCode: number
}
