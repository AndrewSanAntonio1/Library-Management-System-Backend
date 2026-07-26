import api from './api'

export const bookService = {
  async getAllBooks() {
    const response = await api.get('/books')
    return response.data
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`)
    return response.data
  },

  async searchBooks(query) {
    const response = await api.get(`/books?search=${query}`)
    return response.data
  },
}
