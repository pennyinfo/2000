
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Star, ArrowRight, Heart, Home, Briefcase } from "lucide-react";
import RegistrationStatusChecker from "@/components/RegistrationStatusChecker";

const Index = () => {
  const navigate = useNavigate();

  const templates = [
    {
      title: "Pennyekart E-commerce",
      titleMl: "പെന്നികാർട്ട് ഇ-കൊമേഴ്സ്",
      description: "Start your online business with home delivery services",
      descriptionMl: "വീട്ടിലെത്തിക്കൽ സേവനത്തോടെ ഓൺലൈൻ ബിസിനസ് ആരംഭിക്കുക",
      icon: <Home className="h-8 w-8 text-pink-600" />,
      color: "bg-pink-50 border-pink-200"
    },
    {
      title: "Farmelife",
      titleMl: "ഫാമേലൈഫ്",
      description: "Dairy and poultry farming opportunities",
      descriptionMl: "പാലുൽപ്പാദനവും കോഴിവളർത്തലും",
      icon: <Users className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Organelife",
      titleMl: "ഓർഗനേലൈഫ്",
      description: "Organic vegetable gardening",
      descriptionMl: "ജൈവ പച്ചക്കറി കൃഷി",
      icon: <Star className="h-8 w-8 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "Foodelife",
      titleMl: "ഫുഡേലൈഫ്",
      description: "Food processing and catering",
      descriptionMl: "ഭക്ഷ്യ സംസ്കരണം",
      icon: <Heart className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Entrelife",
      titleMl: "എൻട്രേലൈഫ്",
      description: "Skill-based entrepreneurship",
      descriptionMl: "കഴിവുകൾ അടിസ്ഥാനമാക്കിയുള്ള സംരംഭകത്വം",
      icon: <Briefcase className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-pink-800">
                E-life Society
                <span className="block text-sm text-pink-600 font-normal">
                  ഇ-ലൈഫ് സൊസൈറ്റി
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-8">
              <button className="text-gray-700 hover:text-pink-600 font-medium">
                Home / ഹോം
              </button>
              <button 
                onClick={() => navigate('/registration')}
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Registration / രജിസ്ട്രേഷൻ
              </button>
              <button 
                onClick={() => navigate('/categories')}
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Categories / വിഭാഗങ്ങൾ
              </button>
              <button 
                onClick={() => navigate('/admin')}
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Hero Content */}
          <div className="lg:col-span-2">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Empowering Women
                <span className="block text-pink-600">Self-Employment</span>
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                സ്ത്രീകളുടെ സ്വയംതൊഴിൽ പ്രോത്സാഹനം
              </p>
              <p className="text-lg text-gray-500 mb-8 max-w-2xl">
                Join thousands of women who have started their entrepreneurial journey with us. 
                Choose from various self-employment opportunities designed specifically for women.
              </p>
              <p className="text-base text-gray-500 mb-8 max-w-2xl">
                ഞങ്ങളോടൊപ്പം സംരംഭകത്വ യാത്ര ആരംഭിച്ച ആയിരക്കണക്കിന് സ്ത്രീകളോട് ചേരുക
              </p>
              
              <Button 
                onClick={() => navigate('/registration')}
                size="lg" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-pink-600 mt-2">ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക</p>
            </div>
          </div>

          {/* Registration Status Checker */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <RegistrationStatusChecker />
          </div>
        </div>

        {/* Self-Employment Templates */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Self-Employment Opportunities
            <span className="block text-lg text-pink-600 font-normal mt-2">
              സ്വയംതൊഴിൽ അവസരങ്ങൾ
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <Card key={index} className={`${template.color} hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`} onClick={() => navigate('/categories')}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {template.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {template.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">
                    {template.titleMl}
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-700 mb-2">
                    {template.description}
                  </CardDescription>
                  <p className="text-sm text-gray-600">
                    {template.descriptionMl}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-2">നിങ്ങളുടെ യാത്ര ആരംഭിക്കാൻ തയ്യാറാണോ?</p>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Join our community of successful women entrepreneurs. Register today and get access to 
            training, resources, and ongoing support for your business.
          </p>
          <Button 
            onClick={() => navigate('/registration')}
            size="lg" 
            variant="secondary"
            className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
          >
            Start Registration / രജിസ്ട്രേഷൻ ആരംഭിക്കുക
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
