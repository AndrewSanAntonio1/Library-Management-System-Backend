import api from './api'

export const reservationService = {
  async getAllReservations() {
    const response = await api.get('/reservations')
    return response.data
  },

  async getReservationById(id) {
    const response = await api.get(`/reservations/${id}`)
    return response.data
  },

  async createReservation(data) {
    const response = await api.post('/reservations', data)
    return response.data
  },

  async cancelReservation(id) {
    const response = await api.delete(`/reservations/${id}`)
    return response.data
  },

  async getMemberReservations(memberId) {
    const response = await api.get(`/reservations?memberId=${memberId}`)
    return response.data
  },
}
