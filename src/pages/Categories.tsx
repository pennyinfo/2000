
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Users, Briefcase } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();

  const getCategoryIcon = (division: string) => {
    if (division.includes('Pennyekart')) {
      return <CreditCard className="h-8 w-8 text-blue-600" />;
    } else if (division.includes('Self-Employment')) {
      return <Users className="h-8 w-8 text-green-600" />;
    } else {
      return <Briefcase className="h-8 w-8 text-purple-600" />;
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
                Categories / വിഭാഗങ്ങൾ
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Self-Employment Categories
          </h1>
          <p className="text-lg text-pink-600">സ്വയംതൊഴിൽ വിഭാഗങ്ങൾ</p>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore various self-employment opportunities designed to empower women entrepreneurs. 
            Each category offers unique benefits and training programs.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedCategories).map(([division, divisionCategories]) => (
              <div key={division}>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  {division}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {divisionCategories.map((category) => (
                    <Card 
                      key={category.id} 
                      className={`${getCategoryColor(category.division)} hover:shadow-lg transition-all duration-300`}
                    >
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          {getCategoryIcon(category.division)}
                        </div>
                        <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="flex justify-center items-center space-x-4">
                            <div>
                              {category.actual_fee > category.offer_fee ? (
                                <>
                                  <p className="text-2xl font-bold text-green-600">₹{category.offer_fee}</p>
                                  <p className="text-sm text-gray-500 line-through">₹{category.actual_fee}</p>
                                  <p className="text-xs text-green-600">Special Offer!</p>
                                </>
                              ) : (
                                <p className="text-2xl font-bold text-green-600">
                                  {category.offer_fee === 0 ? 'FREE' : `₹${category.offer_fee}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2">What you'll get:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Professional training and guidance</li>
                            <li>• Business setup assistance</li>
                            <li>• Marketing support</li>
                            <li>• Ongoing mentorship</li>
                            <li>• Certificate upon completion</li>
                          </ul>
                        </div>

                        <Button 
                          onClick={() => navigate('/registration')}
                          className="w-full bg-pink-600 hover:bg-pink-700"
                        >
                          Register Now / ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6">നിങ്ങളുടെ യാത്ര ആരംഭിക്കാൻ തയ്യാറാണോ?</p>
          <Button 
            onClick={() => navigate('/registration')}
            size="lg" 
            variant="secondary"
            className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold rounded-full"
          >
            Start Registration / രജിസ്ട്രേഷൻ ആരംഭിക്കുക
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
