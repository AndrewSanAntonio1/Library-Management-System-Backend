import api from './api'

export const publisherService = {
  async getAllPublishers() {
    const response = await api.get('/publishers')
    return response.data
  },

  async getPublisherById(id) {
    const response = await api.get(`/publishers/${id}`)
    return response.data
  },

  async createPublisher(data) {
    const response = await api.post('/publishers', data)
    return response.data
  },

  async updatePublisher(id, data) {
    const response = await api.put(`/publishers/${id}`, data)
    return response.data
  },

  async deletePublisher(id) {
    const response = await api.delete(`/publishers/${id}`)
    return response.data
  },
}
