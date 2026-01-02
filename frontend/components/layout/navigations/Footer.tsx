'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="dark:border-t dark:border-gray-800 bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div>
            
            <Link href="/" className="flex items-center">
              <div className="relative w-40 h-20">
                <Image
                  src="/logo.png"
                  alt="ClickMarket Logo"
                  fill
                  priority
                  className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-4">
              Des fruits et légumes frais directement des producteurs locaux. 
              Livraison rapide dans votre zone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/produits" className="hover:text-green-400">Nos produits</Link></li>
              <li><Link href="/categories" className="hover:text-green-400">Catégories</Link></li>
              <li><Link href="/about" className="hover:text-green-400">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-green-400">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-green-400">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+221 33 123 45 67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span>contact@clickmarket.sn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Inscrivez-vous pour recevoir nos offres spéciales
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="ml-2 bg-green-600 hover:bg-green-700">
                S&apos;inscrire
              </Button>
            </div>
          </div> */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ClickMarket. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Conditions
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}