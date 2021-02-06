import jwt_decode from "jwt-decode";

const getUserType = () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwt_decode(token)
      return decoded.type || false
    }
    return false
  } catch (error) {
    return false
  }
}

export { getUserType }