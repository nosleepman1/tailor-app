import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import axios from '@/api/axios'

export default function PasswordSection() {
  const { user } = useAuthStore()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      await axios.put('/user/password', formData)
      toast.success('Mot de passe modifié avec succès')
      setFormData({
        current_password: '',
        password: '',
        password_confirmation: ''
      })
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors)
        const firstError = Object.values(error.response.data.errors)[0]?.[0]
        if (firstError) {
          toast.error(firstError)
        }
      } else {
        toast.error(error.response?.data?.message || 'Échec de la modification du mot de passe')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-text">Changer de mot de passe</h2>
        <p className="mt-1 text-sm text-text-muted">
          Assurez-vous que votre compte utilise un mot de passe long et aléatoire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label htmlFor="current_password" className="label">Mot de passe actuel</label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className={`input ${errors.current_password ? 'border-error focus:border-error focus:ring-error' : ''}`}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-error focus:border-error focus:ring-error' : ''}`}
            required
          />
        </div>

        <div>
          <label htmlFor="password_confirmation" className="label">Confirmer le mot de passe</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-error focus:border-error focus:ring-error' : ''}`}
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            isLoading={loading}
            disabled={formData.password !== formData.password_confirmation || formData.password.length < 8}
          >
            Mettre à jour le mot de passe
          </Button>
        </div>
      </form>
    </div>
  )
}