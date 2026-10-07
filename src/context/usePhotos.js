import { useState } from 'react'

const STORAGE_KEY = 'travel_photos'

const getPhotos = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const savePhotos = (photos) => localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))

export function usePhotos() {
  const [photos, setPhotos] = useState(getPhotos)

  const addPhoto = (photo) => {
    const updated = [...photos, { ...photo, id: Date.now() }]
    savePhotos(updated)
    setPhotos(updated)
  }

  const deletePhoto = (id) => {
    const updated = photos.filter(p => p.id !== id)
    savePhotos(updated)
    setPhotos(updated)
  }

  const getByYear = (year) => photos.filter(p => p.year === year)

  const years = [...new Set(photos.map(p => p.year))].sort((a, b) => b - a)

  return { photos, addPhoto, deletePhoto, getByYear, years }
}
