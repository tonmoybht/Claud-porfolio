import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export const fetchProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params })
  return data
}

export const submitContact = async (formData) => {
  const { data } = await api.post('/contact', formData)
  return data
}

export const checkHealth = async () => {
  const { data } = await api.get('/health')
  return data
}

export default api
