"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, X, ShoppingCart } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'

type TokenPackage = {
  id: string
  name: { en: string; zh: string }
  tokens: number
  price: number
  discount?: number
  popular?: boolean
  badge?: { en: string; zh: string }
  features: { en: string[]; zh: string[] }
  category?: 'basic' | 'business' | 'industry'
}

type PackageComparisonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  packages: TokenPackage[]
  onPurchase: (pkg: TokenPackage) => void
}

export function PackageComparisonDialog({ 
  open, 
  onOpenChange, 
  packages,
  onPurchase 
}: PackageComparisonDialogProps) {
  const { language } = useLanguage()

  const allFeatures = Array.from(
    new Set(packages.flatMap(pkg => pkg.features[language]))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {language === 'en' ? 'Package Comparison' : '套餐对比'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Compare features and pricing across different packages'
              : '比较不同套餐的功能和价格'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="relative overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-background z-10">
                <tr>
                  <th className="text-left p-3 border-b font-semibold">
                    {language === 'en' ? 'Features' : '功能'}
                  </th>
                  {packages.map(pkg => (
                    <th key={pkg.id} className="p-3 border-b text-center min-w-[180px]">
                      <div className="space-y-2">
                        {pkg.popular && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {language === 'en' ? 'Popular' : '热门'}
                          </Badge>
                        )}
                        {pkg.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {pkg.badge[language]}
                          </Badge>
                        )}
                        <div className="font-semibold">{pkg.name[language]}</div>
                        <div className="text-2xl font-bold text-primary">${pkg.price}</div>
                        <div className="text-xs text-muted-foreground">
                          {(pkg.tokens / 1000).toLocaleString()}K tokens
                        </div>
                        {pkg.discount && (
                          <Badge variant="outline" className="text-accent border-accent text-xs">
                            -{pkg.discount}%
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3 text-sm">{feature}</td>
                    {packages.map(pkg => {
                      const hasFeature = pkg.features[language].includes(feature)
                      return (
                        <td key={pkg.id} className="p-3 text-center">
                          {hasFeature ? (
                            <CheckCircle size={20} className="text-accent mx-auto" weight="fill" />
                          ) : (
                            <X size={20} className="text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-background border-t">
                <tr>
                  <td className="p-3"></td>
                  {packages.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center">
                      <Button 
                        className="w-full"
                        variant={pkg.popular ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          onPurchase(pkg)
                          onOpenChange(false)
                        }}
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        {language === 'en' ? 'Buy Now' : '立即购买'}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
