import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePhotos } from '../context/usePhotos'
import './AdminPage.css'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 2023 }, (_, i) => 2024 + i)

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { photos, addPhoto, deletePhoto, getByYear } = usePhotos()

  const [activeYear, setActiveYear] = useState(CURRENT_YEAR)
  const [form, setForm] = useState({ title: '', location: '', description: '', year: CURRENT_YEAR })
  const [preview, setPreview] = useState(null)
  const [fileData, setFileData] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!isAdmin) {
    navigate('/login')
    return null
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setFileData(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fileData) return
    addPhoto({ ...form, year: Number(form.year), src: fileData })
    setForm({ title: '', location: '', description: '', year: CURRENT_YEAR })
    setPreview(null)
    setFileData(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const yearPhotos = getByYear(activeYear)

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your travel memories</p>
      </div>

      <div className="admin-layout">
        <div className="upload-section">
          <h2>Upload Photo</h2>
          <form onSubmit={handleSubmit}>
            <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
              {preview ? (
                <img src={preview} alt="preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>+</span>
                  <p>Click to select photo</p>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/*" onChange={handleFile} hidden />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Photo title" required />
              </div>
              <div className="form-group">
                <label>Year</label>
                <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bali, Indonesia" required />
            </div>

            <div className="form-group">
              <label>Description <span>(optional)</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="A short story about this moment..." rows={3} />
            </div>

            {success && <p className="success-msg">✦ Photo uploaded successfully</p>}
            <button type="submit" className="btn-upload">Upload Photo</button>
          </form>
        </div>

        <div className="manage-section">
          <h2>Manage Photos</h2>
          <div className="year-tabs">
            {YEARS.map(y => (
              <button key={y} className={activeYear === y ? 'active' : ''} onClick={() => setActiveYear(y)}>{y}</button>
            ))}
          </div>

          <p className="photo-count">{yearPhotos.length} photo{yearPhotos.length !== 1 ? 's' : ''} in {activeYear}</p>

          {yearPhotos.length === 0 ? (
            <div className="admin-empty">
              <span>✦</span>
              <p>No photos for {activeYear} yet</p>
            </div>
          ) : (
            <div className="admin-grid">
              {yearPhotos.map(photo => (
                <div key={photo.id} className="admin-card">
                  <img src={photo.src} alt={photo.title} />
                  <div className="admin-card-info">
                    <p className="admin-card-title">{photo.title}</p>
                    <p className="admin-card-loc">{photo.location}</p>
                  </div>
                  <button className="btn-delete" onClick={() => deletePhoto(photo.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
