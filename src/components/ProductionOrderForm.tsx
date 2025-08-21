import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
interface OrderFormData {
  // Customer Information
  customerNumber: string;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  orderDate: string;

  // Product Information
  articleNumber: string;
  productDescription: string;
  decorationNumber: string;
  quantityCans: string;
  quantityTrays: string;

  // Special Options
  specialFilling: string[];

  // Can Size
  canSize: string;

  // Packaging Options
  packagingType: string;
  packagingVariant: string;
  fullWrapPack: string;

  // Top Variants
  topVariant: string;
  topVariantOther: string;
  bpaniNextGen: string;

  // Recipe & Allergens
  recipeNumber: string;
  containsAllergens: string;
  allergenDetails: string;
  recipeOther: string;

  // Dates & Processing
  expiryDate: string;
  pasteurization: string;
  flashPasteurization: string;

  // Writing/Diction
  writingLine1: string;
  writingLine2: string;

  // Palletization
  palletType: string;
  traysPerPallet: string;

  // Protection & Wrapping
  doubleWrapping: string;

  // Tray Information
  trayType: string;
  trayColor: string;
  trayNumber: string;

  // EAN/UPC Information
  eanUpcCan: string;
  eanUpcTray: string;
  eanSticker: string;

  // Additional Information
  additionalInfo: string;

  // ABV Information
  abvPercentage: string;

  // Delivery Information
  deliveryDate: string;

  // Foil Layout Information
  foilLayoutNumber: string;

  // EAN/UPC for 4Pack/6Pack
  eanUpc4Pack6Pack: string;

  // 4Pack/6Pack EAN Sticker choice
  fourPack6PackEanSticker: string;

  // Tray EAN Code Printed
  trayEanCodePrinted: string;
}
const ProductionOrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerNumber: '',
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    orderDate: new Date().toISOString().split('T')[0],
    articleNumber: '',
    productDescription: '',
    decorationNumber: '',
    quantityCans: '',
    quantityTrays: '',
    specialFilling: [],
    canSize: '',
    packagingType: '',
    packagingVariant: '',
    fullWrapPack: '',
    topVariant: '',
    topVariantOther: '',
    bpaniNextGen: '',
    recipeNumber: '',
    containsAllergens: '',
    allergenDetails: '',
    recipeOther: '',
    expiryDate: '',
    pasteurization: '',
    flashPasteurization: '',
    writingLine1: '',
    writingLine2: '',
    palletType: '',
    traysPerPallet: '',
    doubleWrapping: '',
    trayType: '',
    trayColor: '',
    trayNumber: '',
    eanUpcCan: '',
    eanUpcTray: '',
    eanSticker: '',
    additionalInfo: '',
    abvPercentage: '',
    deliveryDate: '',
    foilLayoutNumber: '',
    eanUpc4Pack6Pack: '',
    fourPack6PackEanSticker: '',
    trayEanCodePrinted: ''
  });
  const {
    toast
  } = useToast();
  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSpecialFillingChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialFilling: checked ? [...prev.specialFilling, value] : prev.specialFilling.filter(item => item !== value)
    }));
  };
  // Helper function to get palletization options based on configuration
  const getPalletizationOptions = () => {
    const canSize = formData.canSize;
    const packagingType = formData.packagingType;
    const packagingVariant = formData.packagingVariant;
    const fullWrapPack = formData.fullWrapPack;
    
    // Determine the pack size for different configurations
    let packSize = '';
    if (packagingType === 'tray') {
      if (packagingVariant === '24pcs-tray') packSize = '24';
      else if (packagingVariant === '12pcs-tray') packSize = '12';
      else if (packagingVariant === 'overfoil') packSize = '4';
      else if (packagingVariant === '6pcs-tray') packSize = '6';
    } else if (packagingType === 'full-wrap') {
      if (fullWrapPack === '24-pack') packSize = '24';
      else if (fullWrapPack === '12-pack') packSize = '12';
    }
    
    // Define all the configuration rules
    const options = {
      euroOptions: [] as string[],
      ukOptions: [] as string[],
      isUnsupported: false,
      errorMessage: ''
    };
    
    // Check for unsupported configurations first
    if (canSize === '500ml-base' && packagingType === 'full-wrap' && packSize === '24') {
      options.isUnsupported = true;
      options.errorMessage = 'The combination of 500ml cans with 24 Pack Full Wrap is not supported.';
      return options;
    }
    
    if (canSize === '250ml-slim' && packagingType === 'full-wrap' && packSize === '12') {
      options.isUnsupported = true;
      options.errorMessage = 'The combination of 250ml Slim cans with 12 Pack Full Wrap is not supported.';
      return options;
    }
    
    if ((canSize === '330ml-sleek' || canSize === '355ml-sleek') && packagingType === 'full-wrap' && packSize === '12') {
      options.isUnsupported = true;
      options.errorMessage = 'The combination of 330ml/355ml Sleek cans with 12 Pack Full Wrap is not supported.';
      return options;
    }
    
    // Now handle supported configurations
    if (canSize === '250ml-slim' && packagingType === 'tray') {
      if (packSize === '24' || packSize === '4' || packSize === '6') {
        options.euroOptions = ['108', '120']; // Customer can choose between 108 and 120 for 24 pack
        options.ukOptions = ['160'];
      } else if (packSize === '12') {
        options.euroOptions = ['240'];
        options.ukOptions = ['310'];
      }
    }
    
    if (canSize === '250ml-slim' && packagingType === 'full-wrap' && packSize === '24') {
      options.euroOptions = ['120'];
      options.ukOptions = []; // UK not supported for this configuration
    }
    
    if ((canSize === '330ml-sleek' || canSize === '355ml-sleek') && packagingType === 'tray') {
      if (packSize === '24' || packSize === '4' || packSize === '6') {
        options.euroOptions = ['90'];
        options.ukOptions = ['117'];
      } else if (packSize === '12') {
        options.euroOptions = ['180'];
        options.ukOptions = ['225'];
      }
    }
    
    if (canSize === '500ml-base' && packagingType === 'tray') {
      if (packSize === '24' || packSize === '4' || packSize === '6') {
        options.euroOptions = ['63', '72'];
        options.ukOptions = ['90'];
      } else if (packSize === '12') {
        options.euroOptions = ['144'];
        options.ukOptions = ['144']; // Updated to match user requirements
      }
    }
    
    if ((canSize === '330ml-sleek' || canSize === '355ml-sleek') && packagingType === 'full-wrap' && packSize === '24') {
      options.euroOptions = ['90'];
      options.ukOptions = ['117'];
    }
    
    if (canSize === '500ml-base' && packagingType === 'full-wrap' && packSize === '12') {
      options.euroOptions = ['144'];
      options.ukOptions = ['176'];
    }
    
    return options;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customerNumber || !formData.productDescription || !formData.customerFirstName || !formData.customerLastName || !formData.customerEmail || !formData.orderDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Company Name, Product Description, Contact Details, and Order Date).",
        variant: "destructive"
      });
      return;
    }

    // Store the order data (in a real app, this would be sent to a backend)
    localStorage.setItem('latestOrder', JSON.stringify({
      ...formData,
      orderNumber: `SZ${Date.now()}`,
      submittedAt: new Date().toISOString()
    }));
    toast({
      title: "Order Submitted Successfully!",
      description: `Order for ${formData.productDescription} has been submitted. You'll receive a confirmation email shortly.`
    });

    // Reset form
    setFormData({
      customerNumber: '',
      customerId: '',
      customerFirstName: '',
      customerLastName: '',
      customerEmail: '',
      orderDate: new Date().toISOString().split('T')[0],
      articleNumber: '',
      productDescription: '',
      decorationNumber: '',
      quantityCans: '',
      quantityTrays: '',
      specialFilling: [],
      canSize: '',
      packagingType: '',
      packagingVariant: '',
      fullWrapPack: '',
      topVariant: '',
      topVariantOther: '',
      bpaniNextGen: '',
      recipeNumber: '',
      containsAllergens: '',
      allergenDetails: '',
      recipeOther: '',
      expiryDate: '',
      pasteurization: '',
      flashPasteurization: '',
      writingLine1: '',
      writingLine2: '',
      palletType: '',
      traysPerPallet: '',
      doubleWrapping: '',
      trayType: '',
      trayColor: '',
      trayNumber: '',
      eanUpcCan: '',
      eanUpcTray: '',
      eanSticker: '',
      additionalInfo: '',
      abvPercentage: '',
      deliveryDate: '',
      foilLayoutNumber: '',
      eanUpc4Pack6Pack: '',
      fourPack6PackEanSticker: '',
      trayEanCodePrinted: ''
    });
  };
  return <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary text-primary-foreground py-6 px-8 rounded-lg shadow-medium mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img src="/lovable-uploads/30f5d91d-b692-4ad3-85ff-f9b9b45f5bf2.png" alt="Starzinger Logo" className="h-16 w-auto brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Product Specification Form</h1>
            
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer Information */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerNumber" className="text-sm font-medium">Company Name *</Label>
                <Input id="customerNumber" value={formData.customerNumber} onChange={e => handleInputChange('customerNumber', e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="customerId" className="text-sm font-medium">Customer ID</Label>
                <Input id="customerId" value={formData.customerId} onChange={e => handleInputChange('customerId', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="orderDate" className="text-sm font-medium">Date *</Label>
                <Input id="orderDate" type="date" value={formData.orderDate} onChange={e => handleInputChange('orderDate', e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="customerFirstName" className="text-sm font-medium">First Name *</Label>
                <Input id="customerFirstName" value={formData.customerFirstName} onChange={e => handleInputChange('customerFirstName', e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="customerLastName" className="text-sm font-medium">Last Name *</Label>
                <Input id="customerLastName" value={formData.customerLastName} onChange={e => handleInputChange('customerLastName', e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-sm font-medium">Email Address *</Label>
                <Input id="customerEmail" type="email" value={formData.customerEmail} onChange={e => handleInputChange('customerEmail', e.target.value)} className="mt-1" required />
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="articleNumber" className="text-sm font-medium">Already Existing Article Number</Label>
                <Input id="articleNumber" value={formData.articleNumber} onChange={e => handleInputChange('articleNumber', e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="productDescription" className="text-sm font-medium">Product Description *</Label>
                <Input id="productDescription" value={formData.productDescription} onChange={e => handleInputChange('productDescription', e.target.value)} className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="decorationNumber" className="text-sm font-medium">Can Layout Number</Label>
                <Input id="decorationNumber" value={formData.decorationNumber} onChange={e => handleInputChange('decorationNumber', e.target.value)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Special Filling Options */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Special Filling Options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Alcohol', 'Vegan', 'Organic', 'Halal'].map(option => <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={option} checked={formData.specialFilling.includes(option)} onCheckedChange={checked => handleSpecialFillingChange(option, checked as boolean)} />
                    <Label htmlFor={option} className="text-sm font-medium">{option}</Label>
                  </div>)}
              </div>
              
              {/* ABV Field - Conditional on Alcohol Selection */}
              {formData.specialFilling.includes('Alcohol') && <div className="mt-4">
                  <Label htmlFor="abvPercentage" className="text-sm font-medium">If Alcohol, please enter the %ABV</Label>
                  <Input id="abvPercentage" value={formData.abvPercentage} onChange={e => handleInputChange('abvPercentage', e.target.value)} className="mt-1 max-w-xs" placeholder="e.g., 5.0" type="number" step="0.1" min="0" max="100" />
                </div>}
            </CardContent>
          </Card>

          {/* Can Size & Packaging */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Can Size & Packaging
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Can Size:</Label>
                <RadioGroup value={formData.canSize} onValueChange={value => handleInputChange('canSize', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="250ml-slim" id="250ml-slim" />
                    <Label htmlFor="250ml-slim">250 ml Slim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="330ml-sleek" id="330ml-sleek" />
                    <Label htmlFor="330ml-sleek">330 ml Sleek</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="355ml-sleek" id="355ml-sleek" />
                    <Label htmlFor="355ml-sleek">355 ml Sleek</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="500ml-base" id="500ml-base" />
                    <Label htmlFor="500ml-base">500 ml Base</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-3 block">Packaging Type</Label>
                <RadioGroup value={formData.packagingType || ''} onValueChange={value => handleInputChange('packagingType', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tray" id="packaging-tray" />
                    <Label htmlFor="packaging-tray">Tray</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-wrap" id="packaging-full-wrap" />
                    <Label htmlFor="packaging-full-wrap">Full Wrap</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Conditional Pack Size Selection */}
              {formData.packagingType && <div>
                  <Label className="text-sm font-medium mb-3 block">
                    {formData.packagingType === 'tray' ? 'Tray Pack Size' : 'Full Wrap Pack Size'}
                  </Label>
                  <RadioGroup value={formData.packagingVariant} onValueChange={value => handleInputChange('packagingVariant', value)}>
                    {formData.packagingType === 'tray' && <>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="24pcs-tray" id="24pcs-tray" />
                          <Label htmlFor="24pcs-tray">24 Pack</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12pcs-tray" id="12pcs-tray" />
                          <Label htmlFor="12pcs-tray">12 Pack</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="overfoil" id="overfoil" />
                          <Label htmlFor="overfoil">4Pack with Overfoil</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="6pcs-tray" id="6pcs-tray" />
                          <Label htmlFor="6pcs-tray">6Pack with Overfoil</Label>
                        </div>
                      </>}
                    {formData.packagingType === 'full-wrap' && <>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-wrap-24" id="full-wrap-24" />
                          <Label htmlFor="full-wrap-24">24 Pack</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="full-wrap-12" id="full-wrap-12" />
                          <Label htmlFor="full-wrap-12">12 Pack</Label>
                        </div>
                      </>}
                  </RadioGroup>
                </div>}
               {/* MOQ Notification for 250ml Slim + 12 Pack Tray */}
               {formData.canSize === '250ml-slim' && formData.packagingType === 'tray' && formData.packagingVariant === '12pcs-tray' && <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                   <div className="flex items-center gap-2 text-blue-800">
                     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <span className="font-medium">MOQ Information</span>
                   </div>
                   <p className="text-sm text-blue-700 mt-1">
                     For 250ml Slim cans with 12 Pack tray configuration, the Minimum Order Quantity (MOQ) is 400,000 cans.
                   </p>
                 </div>}

               {/* Palletization - Dynamic based on configuration */}
               {(() => {
                 const palletOptions = getPalletizationOptions();
                 const showPalletization = formData.canSize && formData.packagingType && 
                   ((formData.packagingType === 'tray' && (formData.packagingVariant === '24pcs-tray' || formData.packagingVariant === '12pcs-tray' || formData.packagingVariant === 'overfoil' || formData.packagingVariant === '6pcs-tray')) ||
                    (formData.packagingType === 'full-wrap' && formData.fullWrapPack));

                 if (!showPalletization) return null;

                 if (palletOptions.isUnsupported) {
                   return (
                     <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                       <div className="flex items-center gap-2 text-destructive">
                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                         </svg>
                         <span className="font-medium">Configuration Not Supported</span>
                       </div>
                       <p className="text-sm text-destructive mt-1">
                         {palletOptions.errorMessage}
                       </p>
                     </div>
                   );
                 }

                 if (palletOptions.euroOptions.length === 0 && palletOptions.ukOptions.length === 0) {
                   return null;
                 }

                 return (
                   <div className="mt-6 space-y-4">
                     <h4 className="font-semibold text-lg">Palletization</h4>
                     <div>
                       <Label htmlFor="palletType" className="text-sm font-medium">Pallet Type</Label>
                       <Select value={formData.palletType} onValueChange={value => handleInputChange('palletType', value)}>
                         <SelectTrigger className="mt-1">
                           <SelectValue placeholder="Select pallet type" />
                         </SelectTrigger>
                         <SelectContent>
                           {palletOptions.euroOptions.length > 0 && (
                             <SelectItem value="euro-pallet">Euro-pallet (tray per pallet)</SelectItem>
                           )}
                           {palletOptions.ukOptions.length > 0 && (
                             <SelectItem value="uk-pallet">UK-pallet (tray per pallet)</SelectItem>
                           )}
                         </SelectContent>
                       </Select>
                     </div>

                     {/* Conditional Tray Count for Pallets */}
                     {formData.palletType && (
                       <div>
                         <Label className="text-sm font-medium">
                           {formData.packagingType === 'full-wrap' && formData.fullWrapPack === '12-pack' ? 'Trays Wraps per Pallet' : 'Trays per Pallet'}
                         </Label>
                         <Select value={formData.traysPerPallet || ''} onValueChange={value => handleInputChange('traysPerPallet', value)}>
                           <SelectTrigger className="mt-1">
                             <SelectValue placeholder="Select tray count" />
                           </SelectTrigger>
                           <SelectContent>
                             {formData.palletType === 'euro-pallet' && palletOptions.euroOptions.map(option => (
                               <SelectItem key={option} value={option}>
                                 {option} {formData.packagingType === 'full-wrap' && formData.fullWrapPack === '12-pack' ? 'Trays Wraps' : 'Trays'} per Euro Pallet
                               </SelectItem>
                             ))}
                             {formData.palletType === 'uk-pallet' && palletOptions.ukOptions.map(option => (
                               <SelectItem key={option} value={option}>
                                 {option} {formData.packagingType === 'full-wrap' && formData.fullWrapPack === '12-pack' ? 'Trays Wraps' : 'Trays'} per UK Pallet
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                     )}

                     {/* Protection Options */}
                     <div>
                       <Label className="text-sm font-medium">Double Wrapping of Pallets</Label>
                       <RadioGroup value={formData.doubleWrapping} onValueChange={value => handleInputChange('doubleWrapping', value)}>
                         <div className="flex items-center space-x-4 mt-2">
                           <div className="flex items-center space-x-2">
                             <RadioGroupItem value="yes" id="wrap-yes" />
                             <Label htmlFor="wrap-yes">Yes</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                             <RadioGroupItem value="no" id="wrap-no" />
                             <Label htmlFor="wrap-no">No</Label>
                           </div>
                         </div>
                       </RadioGroup>
                     </div>
                   </div>
                 );
               })()}
            </CardContent>
            </Card>

          {/* Full Wrap Pack Size Selection */}
          {formData.packagingVariant === 'full-wrap' && <Card className="shadow-soft">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                <CardTitle className="text-primary flex items-center gap-2">
                  <span className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">!</span>
                  Full Wrap Pack Size
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Select Pack Size for Full Wrap</Label>
                  <RadioGroup value={formData.fullWrapPack} onValueChange={value => handleInputChange('fullWrapPack', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24-pack" id="full-wrap-24" />
                      <Label htmlFor="full-wrap-24">24 Pack</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12-pack" id="full-wrap-12" />
                      <Label htmlFor="full-wrap-12">12 Pack</Label>
                    </div>
                  </RadioGroup>
                  
                  {/* Configuration Warning */}
                  {formData.canSize === '250ml-slim' && formData.fullWrapPack === '12-pack' && <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-destructive">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-medium">Configuration Not Supported</span>
                      </div>
                      <p className="text-sm text-destructive mt-1">
                        The combination of 250ml Slim cans with 12 Pack Full Wrap is not supported. Please choose a different can size or pack configuration.
                      </p>
                    </div>}
                </div>
              </CardContent>
            </Card>}

          {/* Conditional Foil Layout Number Field */}
          {(formData.packagingVariant === 'overfoil' || formData.packagingVariant === '6pcs-tray') && <Card className="shadow-soft">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                <CardTitle className="text-primary flex items-center gap-2">
                  <span className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">!</span>
                  Printed Foil Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="foilLayoutNumber" className="text-sm font-medium">Layout Number of the Printed Foil *</Label>
                    <Input id="foilLayoutNumber" value={formData.foilLayoutNumber} onChange={e => handleInputChange('foilLayoutNumber', e.target.value)} className="mt-1" placeholder="Enter foil layout number" required />
                  </div>
                  <div>
                    <Label htmlFor="eanUpc4Pack6Pack" className="text-sm font-medium">EAN/UPC 4Pack/ 6Pack</Label>
                    <Input id="eanUpc4Pack6Pack" value={formData.eanUpc4Pack6Pack} onChange={e => handleInputChange('eanUpc4Pack6Pack', e.target.value)} className="mt-1" placeholder="Enter EAN/UPC for 4Pack/6Pack" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">4Pack/ 6Pack EAN Sticker</Label>
                    <RadioGroup value={formData.fourPack6PackEanSticker} onValueChange={value => handleInputChange('fourPack6PackEanSticker', value)}>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="foil-ean-yes" />
                          <Label htmlFor="foil-ean-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="foil-ean-no" />
                          <Label htmlFor="foil-ean-no">No</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>}

          {/* Technical Specifications */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">5</span>
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Top Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topVariant" className="text-sm font-medium">Top Variant</Label>
                  <Select value={formData.topVariant} onValueChange={value => handleInputChange('topVariant', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select top variant" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="none">None / Clear Selection</SelectItem>
                       <SelectItem value="silver-top-silver-lid">Silver Top - Silver Lid</SelectItem>
                       <SelectItem value="silver-top-blue-lid">Silver Top - Blue Lid</SelectItem>
                       <SelectItem value="silver-top-red-lid">Silver Top - Red Lid</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="topVariantOther" className="text-sm font-medium">Other:</Label>
                  <Input id="topVariantOther" value={formData.topVariantOther || ''} onChange={e => handleInputChange('topVariantOther', e.target.value)} className="mt-1" placeholder="Specify other top variant" />
                </div>
                
                
              </div>

              {/* Recipe & Other */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipeNumber" className="text-sm font-medium">Recipe Number</Label>
                  <Input id="recipeNumber" value={formData.recipeNumber} onChange={e => handleInputChange('recipeNumber', e.target.value)} className="mt-1" placeholder="Please attach recipe to each order" />
                </div>
                
                <div>
                  <Label htmlFor="recipeOther" className="text-sm font-medium">CO2 content in g/L </Label>
                  <Input id="recipeOther" value={formData.recipeOther || ''} onChange={e => handleInputChange('recipeOther', e.target.value)} className="mt-1" />
                </div>
              </div>

              {/* Pasteurization & Allergens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Pasteurization</Label>
                  <p className="text-xs text-muted-foreground mb-2">(CO2: max. 4,8 to 5,0 g/L)</p>
                  <RadioGroup value={formData.pasteurization} onValueChange={value => handleInputChange('pasteurization', value)}>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="past-yes" />
                        <Label htmlFor="past-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="past-no" />
                        <Label htmlFor="past-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Flash Pasteurization</Label>
                  <RadioGroup value={formData.flashPasteurization} onValueChange={value => handleInputChange('flashPasteurization', value)}>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="flash-yes" />
                        <Label htmlFor="flash-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="flash-no" />
                        <Label htmlFor="flash-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Beverage contains Allergens?</Label>
                  <RadioGroup value={formData.containsAllergens} onValueChange={value => handleInputChange('containsAllergens', value)}>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="allergen-yes" />
                        <Label htmlFor="allergen-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="allergen-no" />
                        <Label htmlFor="allergen-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {formData.containsAllergens === 'yes' && (
                    <div className="mt-4">
                      <Label htmlFor="allergenDetails" className="text-sm font-medium">Which Allergens?</Label>
                      <Textarea id="allergenDetails" value={formData.allergenDetails} onChange={e => handleInputChange('allergenDetails', e.target.value)} className="mt-1" rows={2} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Packaging & Labeling */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">6</span>
                Packaging & Labeling
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* Writing/Diction */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Writing/Diction (on the bottom of cans)</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="max-w-xs">
                    <Label htmlFor="writingLine1" className="text-xs text-muted-foreground">Line 1</Label>
                    <Input id="writingLine1" value={formData.writingLine1} onChange={e => handleInputChange('writingLine1', e.target.value)} className="mt-1" />
                  </div>
                  <div className="max-w-xs">
                    <Label htmlFor="writingLine2" className="text-xs text-muted-foreground">Line 2</Label>
                    <Input id="writingLine2" value={formData.writingLine2} onChange={e => handleInputChange('writingLine2', e.target.value)} className="mt-1" />
                  </div>
                  <div className="max-w-xs">
                    <Label htmlFor="expiryDate" className="text-xs text-muted-foreground">Expiry in Months:</Label>
                    <Input id="expiryDate" value={formData.expiryDate} onChange={e => handleInputChange('expiryDate', e.target.value)} className="mt-1" />
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-3">Format Examples:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Example European Format:</p>
                          <p>Line 1: DD.MM.YYYY HH:MM</p>
                          <p>Line 2: DD.MM.YYYY L/DDDMM</p>
                        </div>
                        <div>
                          <p className="font-medium">Example US Format:</p>
                          <p>Line 1: MM.DD.YYYY HH:MM</p>
                          <p>Line 2: MM.DD.YYYY L/DDDMM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tray Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trayType" className="text-sm font-medium">Tray/ Full-Wrap Type</Label>
                  <Select value={formData.trayType} onValueChange={value => handleInputChange('trayType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select tray type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="printed">Printed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="trayColor" className="text-sm font-medium">Tray Color</Label>
                  <Input id="trayColor" value={formData.trayColor} onChange={e => handleInputChange('trayColor', e.target.value)} className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="trayNumber" className="text-sm font-medium">Tray/Full-Wrap Layout Number</Label>
                  <Input id="trayNumber" value={formData.trayNumber} onChange={e => handleInputChange('trayNumber', e.target.value)} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EAN/UPC & Final Details */}
          <Card className="shadow-soft">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
              <CardTitle className="text-primary flex items-center gap-2">
                <span className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">7</span>
                EAN/UPC & Final Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
               {/* EAN/UPC Information */}
               <div>
                 <h4 className="font-semibold mb-4">EAN/UPC Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label htmlFor="eanUpcCan" className="text-sm font-medium">EAN/UPC Can</Label>
                     <Input id="eanUpcCan" value={formData.eanUpcCan} onChange={e => handleInputChange('eanUpcCan', e.target.value)} className="mt-1" />
                   </div>
                   
                   <div>
                     <Label htmlFor="eanUpcTray" className="text-sm font-medium">EAN/UPC Tray</Label>
                     <Input id="eanUpcTray" value={formData.eanUpcTray} onChange={e => handleInputChange('eanUpcTray', e.target.value)} className="mt-1" />
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                   <div>
                     <Label className="text-sm font-medium">Place Tray EAN Sticker on top of the Tray</Label>
                     <RadioGroup value={formData.eanSticker} onValueChange={value => handleInputChange('eanSticker', value)}>
                       <div className="flex items-center space-x-4 mt-2">
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="yes" id="ean-yes" />
                           <Label htmlFor="ean-yes">Yes</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="no" id="ean-no" />
                           <Label htmlFor="ean-no">No</Label>
                         </div>
                       </div>
                     </RadioGroup>
                   </div>

                   <div>
                     <Label className="text-sm font-medium">Tray EAN Code is printed on the tray</Label>
                     <RadioGroup value={formData.trayEanCodePrinted || ''} onValueChange={value => handleInputChange('trayEanCodePrinted', value)}>
                       <div className="flex items-center space-x-4 mt-2">
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="yes" id="tray-ean-printed-yes" />
                           <Label htmlFor="tray-ean-printed-yes">Yes</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="no" id="tray-ean-printed-no" />
                           <Label htmlFor="tray-ean-printed-no">No</Label>
                         </div>
                       </div>
                     </RadioGroup>
                   </div>
                 </div>
               </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium">Additional Information</Label>
                <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={e => handleInputChange('additionalInfo', e.target.value)} className="mt-1" rows={3} placeholder="Please provide any additional specifications or requirements..." />
              </div>

              {/* Delivery Date */}
              
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" size="lg" className="bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-glow hover:to-primary text-white px-12 py-3 text-lg font-semibold shadow-medium hover:shadow-strong transition-all duration-300">
              Submit Product Specification Form
            </Button>
          </div>

        </form>
      </div>
    </div>;
};
export default ProductionOrderForm;