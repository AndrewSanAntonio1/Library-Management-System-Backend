import api from './api'

export const memberService = {
  async getAllMembers() {
    const response = await api.get('/members')
    return response.data
  },

  async getMemberById(id) {
    const response = await api.get(`/members/${id}`)
    return response.data
  },

  async createMember(data) {
    const response = await api.post('/members', data)
    return response.data
  },

  async updateMember(id, data) {
    const response = await api.put(`/members/${id}`, data)
    return response.data
  },

  async deleteMember(id) {
    const response = await api.delete(`/members/${id}`)
    return response.data
  },
}
