export interface User {
  _id: string
  username: string
  email: string
  phone?: string
}

export interface Item {
  _id: string
  title: string
  desc: string
  type: "LOST" | "FOUND"
  posted_by: string
  claimed_by?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  error?: string
}
