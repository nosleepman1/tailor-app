import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/Layout'
import Loader from '@/components/Loader'
import { useClients } from '@/hooks/useClients'
import clientService from '@/services/clientService'

const STEPS = [
  { id: 1, label: 'Informations', icon: '◎' },
  { id: 2, label: 'Mesures',      icon: '◈' },
  { id: 3, label: 'Modèles',      icon: '✦' },
]

const MESURES = [
  'epaule','taille','poitrine','hanches','manches',
  'cou','cuisse','bras','pantalon','biceps','fesses'
]

const emptyForm = {
  firstname: '', lastname: '', phone: '', price: '',
  mesures: Object.fromEntries(MESURES.map(k => [k, ''])),
  model_image: null, tissus_image: null,
}

export default function ClientForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { createClient, updateClient } = useClients()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [previews, setPreviews] = useState({ model_image: null, tissus_image: null })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)
  const [errors, setErrors] = useState({})

  // Load client if editing
  useEffect(() => {
    if (!isEdit) return
    setFetchLoading(true)
    clientService.getClient(id)
      .then(res => {
        const c = res.data || res
        setForm({
          firstname: c.firstname || '',
          lastname:  c.lastname  || '',
          phone:     c.phone     || '',
          price:     c.price     || '',
          mesures:   { ...Object.fromEntries(MESURES.map(k => [k, ''])), ...(c.mesures || {}) },
          model_image: null,
          tissus_image: null,
        })
        if (c.model_image)  setPreviews(p => ({ ...p, model_image: c.model_image }))
        if (c.tissus_image) setPreviews(p => ({ ...p, tissus_image: c.tissus_image }))
      })
      .catch(console.error)
      .finally(() => setFetchLoading(false))
  }, [id, isEdit])

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  function setMesure(key, value) {
    setForm(f => ({ ...f, mesures: { ...f.mesures, [key]: value } }))
  }

  function handleFile(key, file) {
    if (!file) return
    setField(key, file)
    const url = URL.createObjectURL(file)
    setPreviews(p => ({ ...p, [key]: url }))
  }

  function validateStep1() {
    const errs = {}
    if (!form.firstname.trim()) errs.firstname = 'Prénom requis'
    if (!form.lastname.trim())  errs.lastname  = 'Nom requis'
    if (!form.phone.trim())     errs.phone     = 'Téléphone requis'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return
    if (step < 3) setStep(s => s + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = { ...form, mesures: JSON.stringify(form.mesures) }
      if (isEdit) {
        await updateClient(id, payload)
      } else {
        await createClient(payload)
      }
      navigate('/clients')
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {}
      setErrors(serverErrors)
      setStep(1) // go back to show errors
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return (
    <Layout title={isEdit ? 'Modifier client' : 'Nouveau client'}>
      <div className="flex justify-center py-20"><Loader size="lg" label="Chargement..." /></div>
    </Layout>
  )

  return (
    <Layout title={isEdit ? 'Modifier client' : 'Nouveau client'}>
      <div className="max-w-lg mx-auto page-enter">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all flex-1 justify-center ${
                  step === s.id
                    ? 'bg-primary-600/20 border border-primary-500/30 text-primary-300'
                    : step > s.id
                    ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 cursor-pointer'
                    : 'bg-dark-800/50 border border-dark-700/30 text-dark-500'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.id}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-px shrink-0 ${step > s.id ? 'bg-emerald-500/40' : 'bg-dark-700/40'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Informations */}
        {step === 1 && (
          <div className="card p-5 space-y-4 animate-slide-up">
            <h2 className="font-display font-semibold text-white">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom *</label>
                <input className={`input ${errors.firstname ? 'border-red-500' : ''}`}
                  value={form.firstname} onChange={e => setField('firstname', e.target.value)} placeholder="Moussa" />
                {errors.firstname && <p className="text-xs text-red-400 mt-1">{errors.firstname}</p>}
              </div>
              <div>
                <label className="label">Nom *</label>
                <input className={`input ${errors.lastname ? 'border-red-500' : ''}`}
                  value={form.lastname} onChange={e => setField('lastname', e.target.value)} placeholder="Diallo" />
                {errors.lastname && <p className="text-xs text-red-400 mt-1">{errors.lastname}</p>}
              </div>
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input className={`input ${errors.phone ? 'border-red-500' : ''}`}
                type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+221 77 000 00 00" />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Prix (FCFA)</label>
              <input className="input font-mono" type="number" value={form.price}
                onChange={e => setField('price', e.target.value)} placeholder="15000" />
            </div>
          </div>
        )}

        {/* Step 2: Mesures */}
        {step === 2 && (
          <div className="card p-5 animate-slide-up">
            <h2 className="font-display font-semibold text-white mb-4">Mensurations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MESURES.map(key => (
                <div key={key}>
                  <label className="label">{key}</label>
                  <input
                    className="input font-mono text-center"
                    type="number"
                    step="0.1"
                    value={form.mesures[key]}
                    onChange={e => setMesure(key, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-dark-500 mt-4">* Toutes les mesures sont en centimètres</p>
          </div>
        )}

        {/* Step 3: Images */}
        {step === 3 && (
          <div className="card p-5 space-y-5 animate-slide-up">
            <h2 className="font-display font-semibold text-white">Photos</h2>

            {[
              { key: 'model_image', label: 'Photo du modèle', hint: 'Modèle de référence' },
              { key: 'tissus_image', label: 'Photo du tissu', hint: 'Tissu choisi' },
            ].map(({ key, label, hint }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <label className="block cursor-pointer group">
                  <div className={`border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden
                    ${previews[key] ? 'border-primary-500/40' : 'border-dark-600/50 group-hover:border-primary-500/30'}`}>
                    {previews[key] ? (
                      <img src={previews[key]} alt={label} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="h-32 flex flex-col items-center justify-center gap-2 text-dark-400 group-hover:text-dark-300 transition-colors">
                        <span className="text-3xl opacity-30">✦</span>
                        <p className="text-xs">{hint}</p>
                        <p className="text-[10px] text-dark-600">Cliquer pour sélectionner</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={e => handleFile(key, e.target.files[0])}
                  />
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1">
              ← Précédent
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="btn-primary flex-1">
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement...</>
              ) : (
                isEdit ? '✓ Mettre à jour' : '✓ Enregistrer'
              )}
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}
