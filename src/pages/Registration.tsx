
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Users, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  nameMl: string;
  actualFee: number;
  offerFee: number;
  description: string;
  descriptionMl: string;
  icon: React.ReactNode;
  color: string;
}

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedUID, setGeneratedUID] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    whatsappNumber: "",
    panchayath: "",
    ward: "",
    proDetails: "",
    selectedCategory: ""
  });

  const categories: Category[] = [
    // Pennyekart Hybrid-Ecommerce
    {
      id: "pennyekart-free",
      name: "Pennyekart Free Registration",
      nameMl: "പെന്നികാർട്ട് സൗജന്യ രജിസ്ട്രേഷൻ",
      actualFee: 0,
      offerFee: 0,
      description: "Free delivery 2PM to 6PM • Home services included",
      descriptionMl: "സൗജന്യ ഡെലിവറി 2PM മുതൽ 6PM വരെ • വീട്ടിലെത്തിക്കൽ സേവനം",
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "pennyekart-paid",
      name: "Pennyekart Paid Registration",
      nameMl: "പെന്നികാർട്ട് പെയ്ഡ് രജിസ്ട്രേഷൻ",
      actualFee: 500,
      offerFee: 300,
      description: "Delivery 8AM to 7PM • Rs.20 delivery fee may apply",
      descriptionMl: "ഡെലിവറി 8AM മുതൽ 7PM വരെ • ₹20 ഡെലിവറി ഫീസ് ബാധകം",
      icon: <CreditCard className="h-6 w-6 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    // E-life Self-Employment
    {
      id: "farmelife",
      name: "Farmelife",
      nameMl: "ഫാമേലൈഫ്",
      actualFee: 800,
      offerFee: 400,
      description: "Dairy and poultry farm support",
      descriptionMl: "പാലുൽപ്പാദനവും കോഴിവളർത്തലും",
      icon: <Users className="h-6 w-6 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: "organelife",
      name: "Organelife",
      nameMl: "ഓർഗനേലൈഫ്",
      actualFee: 600,
      offerFee: 350,
      description: "Organic vegetable gardening",
      descriptionMl: "ജൈവ പച്ചക്കറി കൃഷി",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      id: "foodelife",
      name: "Foodelife",
      nameMl: "ഫുഡേലൈഫ്",
      actualFee: 700,
      offerFee: 400,
      description: "Food processing-based opportunities",
      descriptionMl: "ഭക്ഷ്യ സംസ്കരണം അടിസ്ഥാനമാക്കിയുള്ള അവസരങ്ങൾ",
      icon: <Briefcase className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      id: "entrelife",
      name: "Entrelife",
      nameMl: "എൻട്രേലൈഫ്",
      actualFee: 750,
      offerFee: 450,
      description: "Skill-based entrepreneurship (tailoring, handicrafts)",
      descriptionMl: "കഴിവുകൾ അടിസ്ഥാനമാക്കിയുള്ള സംരംഭകത്വം",
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    },
    // E-life Job Card
    {
      id: "job-card",
      name: "E-life Job Card Registration",
      nameMl: "ഇ-ലൈഫ് ജോബ് കാർഡ് രജിസ്ട്രേഷൻ",
      actualFee: 1000,
      offerFee: 500,
      description: "Combo registration • Special discounts • Point system",
      descriptionMl: "കോമ്പോ രജിസ്ട്രേഷൻ • പ്രത്യേക കിഴിവുകൾ • പോയിന്റ് സിസ്റ്റം",
      icon: <CheckCircle className="h-6 w-6 text-pink-600" />,
      color: "bg-pink-50 border-pink-200"
    }
  ];

  const panchayaths = [
    { name: "Amarambalam", district: "Malappuram" },
    { name: "Tirur", district: "Malappuram" },
    { name: "Tanur", district: "Malappuram" },
    { name: "Kuttippuram", district: "Malappuram" },
    { name: "Vengara", district: "Malappuram" }
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, selectedCategory: category.id }));
    setShowForm(true);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateUID = (whatsappNumber: string, fullName: string) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    return `ESE${whatsappNumber}${firstLetter}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.whatsappNumber || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const uid = generateUID(formData.whatsappNumber, formData.fullName);
    setGeneratedUID(uid);
    setShowSuccess(true);

    // Here you would typically save to database
    console.log("Registration Data:", { ...formData, uid, category: selectedCategory });
    
    toast({
      title: "Registration Successful!",
      description: `Your UID is: ${uid}`,
    });
  };

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
              <p className="text-sm text-gray-600">Category: {selectedCategory?.name}</p>
              <p className="text-sm text-gray-600">Fee: ₹{selectedCategory?.offerFee}</p>
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

            {/* Category Sections */}
            <div className="space-y-8">
              {/* Pennyekart Hybrid-Ecommerce */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Pennyekart Hybrid-Ecommerce Registration
                </h2>
                <p className="text-pink-600 mb-6">പെന്നികാർട്ട് ഹൈബ്രിഡ്-ഇകൊമേഴ്സ് രജിസ്ട്രേഷൻ</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.slice(0, 2).map((category) => (
                    <Card key={category.id} className={`${category.color} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`} onClick={() => handleCategorySelect(category)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {category.icon}
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600">{category.nameMl}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {category.actualFee > 0 ? (
                              <>
                                <p className="text-lg font-bold text-green-600">₹{category.offerFee}</p>
                                <p className="text-sm text-gray-500 line-through">₹{category.actualFee}</p>
                              </>
                            ) : (
                              <p className="text-lg font-bold text-green-600">FREE</p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{category.description}</CardDescription>
                        <p className="text-sm text-gray-600 mt-1">{category.descriptionMl}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* E-life Self-Employment */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  E-life Self-Employment Registration
                </h2>
                <p className="text-pink-600 mb-6">ഇ-ലൈഫ് സ്വയംതൊഴിൽ രജിസ്ട്രേഷൻ</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {categories.slice(2, 6).map((category) => (
                    <Card key={category.id} className={`${category.color} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`} onClick={() => handleCategorySelect(category)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {category.icon}
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600">{category.nameMl}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₹{category.offerFee}</p>
                            <p className="text-sm text-gray-500 line-through">₹{category.actualFee}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{category.description}</CardDescription>
                        <p className="text-sm text-gray-600 mt-1">{category.descriptionMl}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* E-life Job Card */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  E-life Job Card Registration
                </h2>
                <p className="text-pink-600 mb-6">ഇ-ലൈഫ് ജോബ് കാർഡ് രജിസ്ട്രേഷൻ</p>
                <div className="max-w-md">
                  {categories.slice(6).map((category) => (
                    <Card key={category.id} className={`${category.color} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`} onClick={() => handleCategorySelect(category)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {category.icon}
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600">{category.nameMl}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₹{category.offerFee}</p>
                            <p className="text-sm text-gray-500 line-through">₹{category.actualFee}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{category.description}</CardDescription>
                        <p className="text-sm text-gray-600 mt-1">{category.descriptionMl}</p>
                        <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-800">
                            Special: Applicable only to new joiners • Job card holders can apply for other categories
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Selected Category Banner */}
            {selectedCategory && (
              <div className={`${selectedCategory.color} p-6 rounded-lg mb-8 border-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedCategory.icon}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h2>
                      <p className="text-gray-600">{selectedCategory.nameMl}</p>
                      <p className="text-sm text-gray-500 mt-1">{selectedCategory.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">₹{selectedCategory.offerFee}</p>
                    {selectedCategory.actualFee > selectedCategory.offerFee && (
                      <p className="text-lg text-gray-500 line-through">₹{selectedCategory.actualFee}</p>
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
                              <SelectItem key={panchayath.name} value={panchayath.name}>
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
                    >
                      Back to Categories / വിഭാഗങ്ങളിലേക്ക് തിരികെ
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-pink-600 hover:bg-pink-700"
                    >
                      Submit Registration / രജിസ്ട്രേഷൻ സമർപ്പിക്കുക
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
