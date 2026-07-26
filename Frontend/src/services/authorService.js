import api from './api'

export const authorService = {
  async getAllAuthors() {
    const response = await api.get('/authors')
    return response.data
  },

  async getAuthorById(id) {
    const response = await api.get(`/authors/${id}`)
    return response.data
  },

  async createAuthor(data) {
    const response = await api.post('/authors', data)
    return response.data
  },

  async updateAuthor(id, data) {
    const response = await api.put(`/authors/${id}`, data)
    return response.data
  },

  async deleteAuthor(id) {
    const response = await api.delete(`/authors/${id}`)
    return response.data
  },
}
