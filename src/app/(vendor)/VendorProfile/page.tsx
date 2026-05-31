"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit2, Save, X, Upload, Trash2 } from "lucide-react"
export const dynamic = 'force-dynamic'
// Type Definitions
type StoreLogo = {
  id: string
  url: string
  alt: string
  filename: string
}

type ContactInfo = {
  phone: string
  address: string
  city: string
  country: string
}

type BusinessInfo = {
  businessLicense: string
  taxId: string
  businessType: string
}

type VendorProfile = {
  id: string
  email: string
  storeName: string
  slug: string
  storeDescription: string
  status: string
  role: string
  contactInfo: ContactInfo
  businessInfo: BusinessInfo
  storeLogo: StoreLogo | null
  createdAt: string
  updatedAt: string
}

type UpdatePayload = {
  storeName: string
  storeDescription: string
  contactInfo: ContactInfo
  businessInfo: BusinessInfo
  storeLogo?: string | null
}

type UploadResponse = {
  success: boolean
  message: string
  media: StoreLogo
}

type ProfileResponse = {
  success: boolean
  vendor: VendorProfile
}

type ErrorResponse = {
  error?: string
  message?: string
  details?: string
}

const BACKEND_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Form state
  const [formData, setFormData] = useState<VendorProfile>({
    id: "",
    email: "",
    storeName: "",
    slug: "",
    storeDescription: "",
    status: "pending",
    role: "vendor",
    contactInfo: {
      phone: "",
      address: "",
      city: "",
      country: "",
    },
    businessInfo: {
      businessLicense: "",
      taxId: "",
      businessType: "",
    },
    storeLogo: null,
    createdAt: "",
    updatedAt: "",
  })

  // Get auth token - check authToken first (primary), then fallback options
  const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null
    
    const authToken: string | null = localStorage.getItem('authToken')
    if (authToken) return authToken
    
    // Fallback to other possible keys
    const keys: string[] = ["vendor-token", "token", "jwt", "accessToken", "payload-token"]
    for (const key of keys) {
      const token: string | null = localStorage.getItem(key)
      if (token) return token
    }
    return null
  }

  // Fetch vendor profile
  const fetchVendorProfile = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const token: string | null = getAuthToken()

      if (!token) {
        setError("Not authenticated. Please log in as a vendor.")
        return
      }

      console.log('ðŸ” Fetching vendor profile...')

      const response: Response = await fetch(`${BACKEND_URL}/api/vendor/profile`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      })

      console.log('ðŸ“¡ Response status:', response.status)

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({}))
        console.error('âŒ Error response:', errorData)
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: Failed to fetch profile`)
      }

      const data: ProfileResponse = await response.json()
      console.log('âœ… Profile fetched:', data)
      
      const profileData: VendorProfile = data.vendor || data
      
      setVendor(profileData)
      setFormData(profileData)
      
      if (profileData.storeLogo?.url) {
        setLogoPreview(profileData.storeLogo.url)
      }
    } catch (err) {
      console.error('âŒ Failed to fetch profile:', err)
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendorProfile()
  }, [])

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section?: "contactInfo" | "businessInfo"
  ): void => {
    const { name, value } = e.target

    if (section) {
      setFormData((prev: VendorProfile) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }))
    } else {
      setFormData((prev: VendorProfile) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
        return
      }
      
      // Validate file size (5MB max)
      const maxSize: number = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 5MB.')
        return
      }
      
      setLogoFile(file)
      setError(null)
      
      const reader: FileReader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove logo
  const handleRemoveLogo = (): void => {
    setLogoFile(null)
    setLogoPreview(null)
    setFormData((prev: VendorProfile) => ({
      ...prev,
      storeLogo: null,
    }))
  }

  // Save changes
  const handleSave = async (): Promise<void> => {
    try {
      setIsSaving(true)
      setError(null)
      
      const token: string | null = getAuthToken()
      if (!token) {
        setError("Not authenticated")
        return
      }

      // Validate required fields
      if (!formData.storeName.trim()) {
        setError('Store name is required')
        return
      }

      let logoData: StoreLogo | null = formData.storeLogo

      // Upload logo if new file selected
      if (logoFile) {
        console.log('ðŸ“¤ Uploading logo...')
        
        const formDataLogo: FormData = new FormData()
        formDataLogo.append("file", logoFile)

        const uploadRes: Response = await fetch(`${BACKEND_URL}/api/vendor/upload-logo`, {
          method: "POST",
          headers: {
            Authorization: `JWT ${token}`,
          },
          body: formDataLogo,
        })

        if (uploadRes.ok) {
          const uploadData: UploadResponse = await uploadRes.json()
          logoData = uploadData.media
          console.log('âœ… Logo uploaded:', logoData)
        } else {
          const errorData: ErrorResponse = await uploadRes.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to upload logo")
        }
      }

      console.log('ðŸ“ Updating profile...')

      // Prepare update data
      const updatePayload: UpdatePayload = {
        storeName: formData.storeName.trim(),
        storeDescription: formData.storeDescription.trim(),
        contactInfo: formData.contactInfo,
        businessInfo: formData.businessInfo,
      }

      if (logoData) {
        updatePayload.storeLogo = logoData.id
      } else if (formData.storeLogo === null) {
        updatePayload.storeLogo = null
      }

      const response: Response = await fetch(`${BACKEND_URL}/api/vendor/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const data: ErrorResponse = await response.json().catch(() => ({}))
        throw new Error(data.error || data.message || "Failed to update profile")
      }

      const updatedData: ProfileResponse = await response.json()
      console.log('âœ… Profile updated successfully')
      
      const profileData: VendorProfile = updatedData.vendor || updatedData
      setVendor(profileData)
      setFormData(profileData)
      setLogoFile(null)
      setIsEditing(false)
      
      // Refresh to get latest data
      await fetchVendorProfile()
      
    } catch (err) {
      console.error('âŒ Failed to save profile:', err)
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#BB4E2C' }}></div>
            <p className="text-lg" style={{ color: '#1a3126' }}>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !vendor) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <Card className="rounded-none border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
            <CardContent className="rounded-none p-8 text-center">
              <p className="font-semibold text-lg mb-2" style={{ color: '#BB4E2C' }}>Failed to load profile</p>
              <p className="text-sm mb-6" style={{ color: '#1a3126', opacity: 0.7 }}>{error}</p>
              <Button 
                onClick={fetchVendorProfile}
                className="rounded-none px-6 py-2 text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#BB4E2C' }}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#1a3126' }}>Store Profile</h1>
          {!isEditing ? (
            <Button className="rounded-none"
              onClick={() => setIsEditing(true)}
              className="text-white flex items-center gap-2 px-6 py-3 w-full sm:w-auto justify-center font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#BB4E2C' }}
            >
              <Edit2 size={18} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3 flex-col sm:flex-row w-full sm:w-auto">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-none text-white flex items-center gap-2 px-6 py-3 justify-center flex-1 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#1a3126' }}
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button className="rounded-none"
                onClick={() => {
                  setIsEditing(false)
                  setFormData(vendor!)
                  setLogoFile(null)
                  setLogoPreview(vendor?.storeLogo?.url || null)
                  setError(null)
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white flex items-center gap-2 px-6 py-3 justify-center flex-1 font-medium transition-opacity"
              >
                <X size={18} />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 text-white font-medium" style={{ backgroundColor: '#BB4E2C' }}>
            {error}
          </div>
        )}

        {/* Store Logo Section */}
        <Card className="rounded-none mb-6 border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
          <CardHeader className="rounded-none " style={{ backgroundColor: '#1a3126' }}>
            <CardTitle className="rounded-none text-white">Store Logo</CardTitle>
          </CardHeader>
          <CardContent className="rounded-none p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Logo Preview */}
              <div className="w-full sm:w-40 h-40 border-2 flex items-center justify-center shrink-0" style={{ borderColor: '#ffffff', backgroundColor: '#ffffff' }}>
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Store Logo"
                    width={160}
                    height={160}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center" style={{ color: '#1a3126', opacity: 0.4 }}>
                    <Upload size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No logo</p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              {isEditing && (
                <div className="flex-1 space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed cursor-pointer transition-colors" style={{ borderColor: '#1a3126' }}>
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 mb-2" style={{ color: '#BB4E2C' }} />
                      <p className="text-sm font-medium" style={{ color: '#1a3126' }}>Click to upload logo</p>
                      <p className="text-xs mt-1" style={{ color: '#1a3126', opacity: 0.6 }}>PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoPreview && (
                    <Button
                      onClick={handleRemoveLogo}
                      className="rounded-none w-full text-white flex items-center gap-2 justify-center py-3 font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#BB4E2C' }}
                    >
                      <Trash2 size={18} />
                      Remove Logo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card className="rounded-none mb-6 border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
          <CardHeader className="rounded-none " style={{ backgroundColor: '#1a3126' }}>
            <CardTitle className="rounded-none text-white">Store Information</CardTitle>
          </CardHeader>
          <CardContent className="rounded-none p-6 space-y-4">
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Store Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border ${
                  isEditing
                    ? "bg-white focus:ring-2 focus:outline-none"
                    : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Store Slug (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Store URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                disabled
                className="w-full px-4 py-3 border cursor-not-allowed"
                style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff', color: '#1a3126', opacity: 0.7 }}
              />
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Store Description</label>
              <textarea
                name="storeDescription"
                value={formData.storeDescription}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border resize-none ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
                placeholder="Describe your store..."
              />
            </div>

            {/* Status (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Account Status</label>
              <div className="px-4 py-3 font-semibold inline-block capitalize" style={{ backgroundColor: '#1a3126', color: 'white' }}>
                {formData.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="rounded-none mb-6 border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
          <CardHeader className="rounded-none " style={{ backgroundColor: '#1a3126' }}>
            <CardTitle className="rounded-none text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="rounded-none p-6 space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.contactInfo.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, "contactInfo")}
                disabled={!isEditing}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 border ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Business Address</label>
              <textarea
                name="address"
                value={formData.contactInfo.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e, "contactInfo")}
                disabled={!isEditing}
                rows={3}
                placeholder="Enter your business address"
                className={`w-full px-4 py-3 border resize-none ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* City and Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.contactInfo.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, "contactInfo")}
                  disabled={!isEditing}
                  placeholder="Enter city"
                  className={`w-full px-4 py-3 border ${
                    isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                  }`}
                  style={{
                    borderColor: '#e5e5e5',
                    color: '#1a3126',
                    backgroundColor: isEditing ? 'white' : '#ffffff'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.contactInfo.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, "contactInfo")}
                  disabled={!isEditing}
                  placeholder="Enter country"
                  className={`w-full px-4 py-3 border ${
                    isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                  }`}
                  style={{
                    borderColor: '#e5e5e5',
                    color: '#1a3126',
                    backgroundColor: isEditing ? 'white' : '#ffffff'
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="rounded-none border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
          <CardHeader className="rounded-none " style={{ backgroundColor: '#1a3126' }}>
            <CardTitle className="rounded-none text-white">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="rounded-none p-6 space-y-4">
            {/* Business License */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Business License</label>
              <input
                type="text"
                name="businessLicense"
                value={formData.businessInfo.businessLicense}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, "businessInfo")}
                disabled={!isEditing}
                placeholder="Enter business license number"
                className={`w-full px-4 py-3 border ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.businessInfo.taxId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, "businessInfo")}
                disabled={!isEditing}
                placeholder="Enter tax ID"
                className={`w-full px-4 py-3 border ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1a3126' }}>Business Type</label>
              <select
                name="businessType"
                value={formData.businessInfo.businessType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e, "businessInfo")}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border ${
                  isEditing ? "bg-white focus:ring-2 focus:outline-none" : "cursor-not-allowed"
                }`}
                style={{
                  borderColor: '#e5e5e5',
                  color: '#1a3126',
                  backgroundColor: isEditing ? 'white' : '#ffffff'
                }}
              >
                <option value="">Select business type</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


