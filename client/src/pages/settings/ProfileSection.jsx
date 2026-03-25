import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import axios from '@/api/axios'

export default function ProfileSection() {
  const { user, setUser } = useAuthStore()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.put('/user/profile', formData)
      toast.success('Profil mis à jour avec succès')
      if (formData.email !== user.email) {
        toast.info('Un email de vérification a été envoyé à votre nouvelle adresse.')
      }
      setUser(response.data.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-text">Modifier le profil</h2>
        <p className="mt-1 text-sm text-text-muted">
          Mettez à jour vos informations publiques.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Nom complet</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
           <label htmlFor="email" className="label">Adresse email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
          {formData.email !== user?.email && (
            <p className="mt-2 text-sm text-warning">
              Changer votre adresse email nécessitera une nouvelle vérification.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="avatar" className="label">URL de l'avatar (Optionnel)</label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="input"
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={loading}>
            Sauvegarder les modifications
          </Button>
        </div>
      </form>
    </div>
  )
}