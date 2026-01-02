// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// export const metadata: Metadata = {
//   title: 'Contact - ClickMarket',
//   description: 'Contactez-nous pour toute question, commande spéciale ou feedback. Notre équipe est à votre écoute.',
// }

const contactInfo = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Téléphone",
    details: "+221 33 123 45 67",
    description: "Du lundi au samedi, 8h-20h"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    details: "contact@clickmarket.sn",
    description: "Réponse sous 24h"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Adresse",
    details: "Dakar, Sénégal",
    description: "Siège social"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Horaires",
    details: "7j/7, 8h-20h",
    description: "Support client"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contactez-<span className="text-green-600 dark:text-green-400">nous</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions. N&apos;hésitez pas à nous contacter !
          </p>
        </div>
        
        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Message envoyé avec succès !</p>
                <p className="text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'border-red-500' : ''}
                        placeholder="Votre nom"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'border-red-500' : ''}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sujet
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Sujet de votre message"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={errors.message ? 'border-red-500' : ''}
                      placeholder="Décrivez votre demande..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* FAQ Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Questions fréquentes
              </h3>
              <div className="space-y-4">
                {[
                  {
                    q: "Quels sont les délais de livraison ?",
                    a: "Nous livrons sous 24h dans les zones A et B, et sous 48h dans les zones C et D."
                  },
                  {
                    q: "Comment payer ma commande ?",
                    a: "Paiement à la livraison (espèces) ou via Wave/Orange Money avant livraison."
                  },
                  {
                    q: "Puis-je modifier ou annuler ma commande ?",
                    a: "Oui, jusqu'à 2h avant la livraison prévue via votre compte ou par téléphone."
                  }
                ].map((faq, index) => (
                  <Card key={index} className="border-0 shadow dark:shadow-gray-900/50 dark:bg-gray-800">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {faq.a}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Nos coordonnées
              </h3>
              
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow dark:shadow-gray-900/50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {info.title}
                        </h4>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {info.details}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Map Placeholder */}
            <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Notre localisation
                </h3>
                <div className="bg-gray-100 dark:bg-gray-900 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Dakar, Sénégal
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      (Carte interactive disponible)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Media */}
            <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Suivez-nous
                </h3>
                <div className="flex flex-wrap gap-4">
                  {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                    <Button
                      key={platform}
                      variant="outline"
                      className="flex-1 dark:border-gray-600 dark:text-gray-300"
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Support Info */}
            <Card className="border-0 shadow-lg dark:shadow-gray-900/50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Support urgent
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Pour les urgences concernant votre commande en cours
                </p>
                <Button className="w-full gap-2 bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4" />
                  Urgence commande
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}