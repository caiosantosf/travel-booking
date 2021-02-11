import jwt_decode from "jwt-decode";

const decodeToken = option => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt_decode(token)
      return decoded[option] || false
    }
    return false
  } catch (error) {
    return false
  }
}

const getUserType = () => {
  return decodeToken('type')
}

const getUserId = () => {
  return decodeToken('id')
}

export { getUserType, getUserId }