import api from './api'

export const fineService = {
  async getAllFines() {
    const response = await api.get('/fines')
    return response.data
  },

  async getFineById(id) {
    const response = await api.get(`/fines/${id}`)
    return response.data
  },

  async getMemberFines(memberId) {
    const response = await api.get(`/fines?memberId=${memberId}`)
    return response.data
  },
}
