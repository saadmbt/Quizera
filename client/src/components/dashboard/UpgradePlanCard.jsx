import { Crown, Sparkles } from 'lucide-react'
import React from 'react'

function UpgradePlanCard() {
  return (
    <div className="p-4 mx-4 mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center mb-3">
            <Crown className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Upgrade to Pro</h3>
          </div>
          <p className="text-sm text-blue-100 mb-3">Unlock premium features and enhance your learning experience</p>
          <div className="flex items-center gap-2 text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Unlimited flashcards</span>
          </div>
          <button className="w-full py-2 px-4 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors duration-200">
            Upgrade Now
          </button>
    </div>
  )
}

export default UpgradePlanCard