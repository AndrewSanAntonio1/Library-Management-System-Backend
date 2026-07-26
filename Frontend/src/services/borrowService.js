import api from './api'

export const borrowService = {
  async getAllBorrowRecords() {
    const response = await api.get('/borrow-records')
    return response.data
  },

  async getBorrowRecordById(id) {
    const response = await api.get(`/borrow-records/${id}`)
    return response.data
  },

  async getMemberBorrowRecords(memberId) {
    const response = await api.get(`/borrow-records?memberId=${memberId}`)
    return response.data
  },
}
