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
  packagingVariant: string;
  
  // Top Variants
  topVariant: string;
  bpaniNextGen: string;
  
  // Recipe & Allergens
  recipeNumber: string;
  containsAllergens: string;
  allergenDetails: string;
  
  // Dates & Processing
  expiryDate: string;
  pasteurization: string;
  flashPasteurization: string;
  
  // Writing/Diction
  writingLine1: string;
  writingLine2: string;
  
  // Palletization
  palletType: string;
  
  // Protection & Wrapping
  cornerProtection: string;
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
  
  // Delivery Information
  deliveryDate: string;
}

const ProductionOrderForm: React.FC = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerNumber: '',
    customerId: '',
    articleNumber: '',
    productDescription: '',
    decorationNumber: '',
    quantityCans: '',
    quantityTrays: '',
    specialFilling: [],
    canSize: '',
    packagingVariant: '',
    topVariant: '',
    bpaniNextGen: '',
    recipeNumber: '',
    containsAllergens: '',
    allergenDetails: '',
    expiryDate: '',
    pasteurization: '',
    flashPasteurization: '',
    writingLine1: '',
    writingLine2: '',
    palletType: '',
    cornerProtection: '',
    doubleWrapping: '',
    trayType: '',
    trayColor: '',
    trayNumber: '',
    eanUpcCan: '',
    eanUpcTray: '',
    eanSticker: '',
    additionalInfo: '',
    deliveryDate: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialFillingChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialFilling: checked 
        ? [...prev.specialFilling, value]
        : prev.specialFilling.filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.customerNumber || !formData.productDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Customer Name and Product Description).",
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
      description: `Order for ${formData.productDescription} has been submitted. You'll receive a confirmation email shortly.`,
    });

    // Reset form
    setFormData({
      customerNumber: '',
      customerId: '',
      articleNumber: '',
      productDescription: '',
      decorationNumber: '',
      quantityCans: '',
      quantityTrays: '',
      specialFilling: [],
      canSize: '',
      packagingVariant: '',
      topVariant: '',
      bpaniNextGen: '',
      recipeNumber: '',
      containsAllergens: '',
      allergenDetails: '',
      expiryDate: '',
      pasteurization: '',
      flashPasteurization: '',
      writingLine1: '',
      writingLine2: '',
      palletType: '',
      cornerProtection: '',
      doubleWrapping: '',
      trayType: '',
      trayColor: '',
      trayNumber: '',
      eanUpcCan: '',
      eanUpcTray: '',
      eanSticker: '',
      additionalInfo: '',
      deliveryDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary text-primary-foreground py-6 px-8 rounded-lg shadow-medium mb-6">
            <h1 className="text-3xl font-bold mb-2">Production Order Form</h1>
            <p className="text-lg opacity-90">Starzinger Beverage Group - "The Spring of Quality!"</p>
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
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerNumber" className="text-sm font-medium">Customer Name *</Label>
                <Input
                  id="customerNumber"
                  value={formData.customerNumber}
                  onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerId" className="text-sm font-medium">Customer ID</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  onChange={(e) => handleInputChange('customerId', e.target.value)}
                  className="mt-1"
                />
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
                <Input
                  id="articleNumber"
                  value={formData.articleNumber}
                  onChange={(e) => handleInputChange('articleNumber', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="productDescription" className="text-sm font-medium">Product Description *</Label>
                <Input
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="decorationNumber" className="text-sm font-medium">Cliche Number</Label>
                <Input
                  id="decorationNumber"
                  value={formData.decorationNumber}
                  onChange={(e) => handleInputChange('decorationNumber', e.target.value)}
                  className="mt-1"
                />
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
                {['CBD', 'Alcohol', 'Vegan', 'Bio/Organic'].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.specialFilling.includes(option)}
                      onCheckedChange={(checked) => handleSpecialFillingChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm font-medium">{option}</Label>
                  </div>
                ))}
              </div>
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
                <RadioGroup value={formData.canSize} onValueChange={(value) => handleInputChange('canSize', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="250ml-slim" id="250ml-slim" />
                    <Label htmlFor="250ml-slim">250 ml Slim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="330ml-base" id="330ml-base" />
                    <Label htmlFor="330ml-base">330 ml Base</Label>
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
                <Label className="text-sm font-medium mb-3 block">Packaging Variant</Label>
                <RadioGroup value={formData.packagingVariant} onValueChange={(value) => handleInputChange('packagingVariant', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24pcs-tray" id="24pcs-tray" />
                    <Label htmlFor="24pcs-tray">24 pcs Tray / 4-Pack Foil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12pcs-tray" id="12pcs-tray" />
                    <Label htmlFor="12pcs-tray">12 pcs Tray / 6-Pack Foil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overfoil" id="overfoil" />
                    <Label htmlFor="overfoil">Overfoil</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

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
                  <Select value={formData.topVariant} onValueChange={(value) => handleInputChange('topVariant', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select top variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deckel-top">Deckel / Top</SelectItem>
                      <SelectItem value="lasche-lid">Lasche / Lid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="bpaniNextGen" className="text-sm font-medium">BPANI (NexGen) Top</Label>
                  <RadioGroup value={formData.bpaniNextGen} onValueChange={(value) => handleInputChange('bpaniNextGen', value)}>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="bpani-yes" />
                        <Label htmlFor="bpani-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="bpani-no" />
                        <Label htmlFor="bpani-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Recipe & Allergens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipeNumber" className="text-sm font-medium">Recipe Number</Label>
                  <Input
                    id="recipeNumber"
                    value={formData.recipeNumber}
                    onChange={(e) => handleInputChange('recipeNumber', e.target.value)}
                    className="mt-1"
                    placeholder="Please attach recipe to each order"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Contains Allergens?</Label>
                  <RadioGroup value={formData.containsAllergens} onValueChange={(value) => handleInputChange('containsAllergens', value)}>
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
                </div>
              </div>

              {formData.containsAllergens === 'yes' && (
                <div>
                  <Label htmlFor="allergenDetails" className="text-sm font-medium">Which Allergens?</Label>
                  <Textarea
                    id="allergenDetails"
                    value={formData.allergenDetails}
                    onChange={(e) => handleInputChange('allergenDetails', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              )}

              {/* Pasteurization Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Pasteurization</Label>
                  <RadioGroup value={formData.pasteurization} onValueChange={(value) => handleInputChange('pasteurization', value)}>
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
                  <RadioGroup value={formData.flashPasteurization} onValueChange={(value) => handleInputChange('flashPasteurization', value)}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="writingLine1" className="text-xs text-muted-foreground">Line 1</Label>
                    <Input
                      id="writingLine1"
                      value={formData.writingLine1}
                      onChange={(e) => handleInputChange('writingLine1', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="writingLine2" className="text-xs text-muted-foreground">Line 2</Label>
                    <Input
                      id="writingLine2"
                      value={formData.writingLine2}
                      onChange={(e) => handleInputChange('writingLine2', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Palletization */}
              <div>
                <Label htmlFor="palletType" className="text-sm font-medium">Palletization</Label>
                <Select value={formData.palletType} onValueChange={(value) => handleInputChange('palletType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select pallet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="euro-pallet">Euro-pallet (tray per pallet)</SelectItem>
                    <SelectItem value="container-pallet">Container-pallet (tray per pallet)</SelectItem>
                    <SelectItem value="uk-pallet">UK-pallet (tray per pallet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Protection Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Corner Protection</Label>
                  <RadioGroup value={formData.cornerProtection} onValueChange={(value) => handleInputChange('cornerProtection', value)}>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="corner-yes" />
                        <Label htmlFor="corner-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="corner-no" />
                        <Label htmlFor="corner-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Double Wrapping of Pallets</Label>
                  <RadioGroup value={formData.doubleWrapping} onValueChange={(value) => handleInputChange('doubleWrapping', value)}>
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

              {/* Tray Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="trayType" className="text-sm font-medium">Tray Type</Label>
                  <Select value={formData.trayType} onValueChange={(value) => handleInputChange('trayType', value)}>
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
                  <Input
                    id="trayColor"
                    value={formData.trayColor}
                    onChange={(e) => handleInputChange('trayColor', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="trayNumber" className="text-sm font-medium">Tray Number</Label>
                  <Input
                    id="trayNumber"
                    value={formData.trayNumber}
                    onChange={(e) => handleInputChange('trayNumber', e.target.value)}
                    className="mt-1"
                  />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eanUpcCan" className="text-sm font-medium">4-Pack or 6-Pack EAN Sticker</Label>
                    <Input
                      id="eanUpcCan"
                      value={formData.eanUpcCan}
                      onChange={(e) => handleInputChange('eanUpcCan', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eanUpcTray" className="text-sm font-medium">EAN/UPC Tray</Label>
                    <Input
                      id="eanUpcTray"
                      value={formData.eanUpcTray}
                      onChange={(e) => handleInputChange('eanUpcTray', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tray EAN Sticker</Label>
                    <RadioGroup value={formData.eanSticker} onValueChange={(value) => handleInputChange('eanSticker', value)}>
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
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additionalInfo" className="text-sm font-medium">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="mt-1"
                  rows={3}
                  placeholder="Please provide any additional specifications or requirements..."
                />
              </div>

              {/* Delivery Date */}
              <div>
                <Label htmlFor="deliveryDate" className="text-sm font-medium">Delivery Date of Compounds</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-glow hover:to-primary text-white px-12 py-3 text-lg font-semibold shadow-medium hover:shadow-strong transition-all duration-300"
            >
              Submit Production Order
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductionOrderForm;