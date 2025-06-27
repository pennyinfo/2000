
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Users, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { usePanchayaths } from "@/hooks/usePanchayaths";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  address: string;
  whatsappNumber: string;
  panchayath: string;
  ward: string;
  proDetails: string;
  selectedCategory: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { panchayaths, isLoading: panchayathsLoading } = usePanchayaths();
  
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedUID, setGeneratedUID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    whatsappNumber: "",
    panchayath: "",
    ward: "",
    proDetails: "",
    selectedCategory: ""
  });

  const handleCategorySelect = (category: any) => {
    setSelectedCategoryData(category);
    setFormData(prev => ({ ...prev, selectedCategory: category.name }));
    setShowForm(true);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateUID = (whatsappNumber: string, fullName: string) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    return `ESE${whatsappNumber}${firstLetter}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.whatsappNumber || !formData.address || !formData.panchayath) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate WhatsApp number
      const { data: existingRegistration } = await supabase
        .from('registrations')
        .select('id')
        .or(`whatsapp_number.eq.${formData.whatsappNumber},mobile_number.eq.${formData.whatsappNumber}`)
        .single();

      if (existingRegistration) {
        toast({
          title: "Registration Error",
          description: "This WhatsApp number is already registered",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const uid = generateUID(formData.whatsappNumber, formData.fullName);

      // Insert registration into Supabase
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.fullName,
            address: formData.address,
            whatsapp_number: formData.whatsappNumber,
            mobile_number: formData.whatsappNumber,
            panchayath: formData.panchayath,
            ward: formData.ward,
            pro_details: formData.proDetails,
            category: formData.selectedCategory,
            status: 'Pending',
            uid: uid
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: "There was an error submitting your registration. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      setGeneratedUID(uid);
      setShowSuccess(true);
      
      toast({
        title: "Registration Successful!",
        description: `Your UID is: ${uid}`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (division: string) => {
    if (division.includes('Pennyekart')) {
      return <CreditCard className="h-6 w-6 text-blue-600" />;
    } else if (division.includes('Self-Employment')) {
      return <Users className="h-6 w-6 text-green-600" />;
    } else {
      return <Briefcase className="h-6 w-6 text-purple-600" />;
    }
  };

  const getCategoryColor = (division: string) => {
    if (division.includes('Pennyekart')) {
      return 'bg-blue-50 border-blue-200';
    } else if (division.includes('Self-Employment')) {
      return 'bg-green-50 border-green-200';
    } else {
      return 'bg-purple-50 border-purple-200';
    }
  };

  // Group categories by division
  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.division]) {
      acc[category.division] = [];
    }
    acc[category.division].push(category);
    return acc;
  }, {} as Record<string, any[]>);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center pb-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-800">
              Registration Successful!
            </CardTitle>
            <p className="text-green-600">രജിസ്ട്രേഷൻ വിജയകരം!</p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Your Unique ID:</p>
              <p className="text-2xl font-bold text-green-800 font-mono">{generatedUID}</p>
              <p className="text-sm text-gray-500 mt-2">
                Note the UID (Unique Id number), this id is mandatory for all services.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                UID (യുണീക് ഐഡി നമ്പർ) രേഖപ്പെടുത്തുക, എല്ലാ സേവനങ്ങൾക്കും ഈ ഐഡി നിർബന്ധമാണ്.
              </p>
            </div>
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">Registration Details:</p>
              <p className="text-sm text-gray-600">Category: {selectedCategoryData?.name}</p>
              <p className="text-sm text-gray-600">Fee: ₹{selectedCategoryData?.offer_fee}</p>
              <p className="text-sm text-gray-600">Name: {formData.fullName}</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Home / ഹോമിലേക്ക് പോകുക
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back / തിരികെ
              </Button>
              <h1 className="text-xl font-bold text-pink-800">
                Registration / രജിസ്ട്രേഷൻ
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showForm ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Category
              </h1>
              <p className="text-lg text-pink-600">നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക</p>
            </div>

            {categoriesLoading ? (
              <div className="text-center py-8">Loading categories...</div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedCategories).map(([division, divisionCategories]) => (
                  <div key={division}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {division}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {divisionCategories.map((category) => (
                        <Card 
                          key={category.id} 
                          className={`${getCategoryColor(category.division)} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`} 
                          onClick={() => handleCategorySelect(category)}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getCategoryIcon(category.division)}
                                <div>
                                  <CardTitle className="text-lg">{category.name}</CardTitle>
                                  <p className="text-sm text-gray-600">{category.name_ml}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {category.actual_fee > category.offer_fee ? (
                                  <>
                                    <p className="text-lg font-bold text-green-600">₹{category.offer_fee}</p>
                                    <p className="text-sm text-gray-500 line-through">₹{category.actual_fee}</p>
                                  </>
                                ) : (
                                  <p className="text-lg font-bold text-green-600">
                                    {category.offer_fee === 0 ? 'FREE' : `₹${category.offer_fee}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>{category.description}</CardDescription>
                            <p className="text-sm text-gray-600 mt-1">{category.description_ml}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Selected Category Banner */}
            {selectedCategoryData && (
              <div className={`${getCategoryColor(selectedCategoryData.division)} p-6 rounded-lg mb-8 border-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getCategoryIcon(selectedCategoryData.division)}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedCategoryData.name}</h2>
                      <p className="text-gray-600">{selectedCategoryData.name_ml}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedCategoryData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">₹{selectedCategoryData.offer_fee}</p>
                    {selectedCategoryData.actual_fee > selectedCategoryData.offer_fee && (
                      <p className="text-lg text-gray-500 line-through">₹{selectedCategoryData.actual_fee}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Registration Form
                </CardTitle>
                <p className="text-pink-600">രജിസ്ട്രേഷൻ ഫോം</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Details / വ്യക്തിഗത വിവരങ്ങൾ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name / പൂർണ്ണ നാമം *</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="whatsappNumber">WhatsApp Number / വാട്സ്ആപ്പ് നമ്പർ *</Label>
                        <Input
                          id="whatsappNumber"
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                          placeholder="Enter WhatsApp number"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="address">Address / വിലാസം *</Label>
                      <Input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Location Details / സ്ഥാന വിവരങ്ങൾ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="panchayath">Panchayath / പഞ്ചായത്ത് *</Label>
                        <Select value={formData.panchayath} onValueChange={(value) => handleInputChange("panchayath", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Panchayath" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg">
                            {panchayaths.map((panchayath) => (
                              <SelectItem key={panchayath.id} value={panchayath.name}>
                                {panchayath.name} - {panchayath.district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ward">Ward / വാർഡ് *</Label>
                        <Input
                          id="ward"
                          type="text"
                          value={formData.ward}
                          onChange={(e) => handleInputChange("ward", e.target.value)}
                          placeholder="Enter ward number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Agent Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Agent Details / ഏജന്റ് വിവരങ്ങൾ
                    </h3>
                    <div>
                      <Label htmlFor="proDetails">Nearest Pennyekart P.R.O. Details</Label>
                      <Input
                        id="proDetails"
                        type="text"
                        value={formData.proDetails}
                        onChange={(e) => handleInputChange("proDetails", e.target.value)}
                        placeholder="Enter nearest P.R.O. details"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Back to Categories / വിഭാഗങ്ങളിലേക്ക് തിരികെ
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration / രജിസ്ട്രേഷൻ സമർപ്പിക്കുക'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
