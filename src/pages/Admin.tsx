import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Settings, Database, Download, Search, Edit, Trash2, Plus } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRegistrations } from "@/hooks/useRegistrations";
import { useCategories } from "@/hooks/useCategories";
import { usePanchayaths } from "@/hooks/usePanchayaths";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, currentAdmin, isLoading: authLoading, login, logout } = useAdminAuth();
  const { registrations, isLoading: regsLoading, updateRegistrationStatus } = useRegistrations();
  const { categories, isLoading: catsLoading, updateCategory } = useCategories();
  const { panchayaths, isLoading: panchLoading, addPanchayath, updatePanchayath, deletePanchayath } = usePanchayaths();
  
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPanchayath, setSelectedPanchayath] = useState("all");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingPanchayath, setEditingPanchayath] = useState<string | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ actual_fee: 0, offer_fee: 0 });
  const [panchayathFormData, setPanchayathFormData] = useState({ name: "", malayalam_name: "", district: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginForm.username, loginForm.password);
  };

  const generateUID = (mobile: string, fullName: string) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    return `ESE${mobile}${firstLetter}`;
  };

  const handleCategoryEdit = async (categoryId: string) => {
    if (editingCategory === categoryId) {
      // Save changes
      const success = await updateCategory(categoryId, categoryFormData);
      if (success) {
        setEditingCategory(null);
      }
    } else {
      // Start editing
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setCategoryFormData({
          actual_fee: category.actual_fee,
          offer_fee: category.offer_fee || 0
        });
        setEditingCategory(categoryId);
      }
    }
  };

  const handlePanchayathEdit = async (panchayathId: string) => {
    if (editingPanchayath === panchayathId) {
      // Save changes
      const success = await updatePanchayath(panchayathId, panchayathFormData);
      if (success) {
        setEditingPanchayath(null);
      }
    } else {
      // Start editing
      const panchayath = panchayaths.find(p => p.id === panchayathId);
      if (panchayath) {
        setPanchayathFormData({
          name: panchayath.name,
          malayalam_name: panchayath.malayalam_name || "",
          district: panchayath.district
        });
        setEditingPanchayath(panchayathId);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Login
            </CardTitle>
            <CardDescription>
              Access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredRegistrations = registrations.filter(reg => {
    const regUid = generateUID(reg.mobile_number, reg.full_name);
    const matchesSearch = reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         regUid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.whatsapp_number?.includes(searchTerm) ||
                         reg.mobile_number?.includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || reg.category === selectedCategory;
    const matchesPanchayath = selectedPanchayath === "all" || reg.panchayath === selectedPanchayath;
    
    return matchesSearch && matchesCategory && matchesPanchayath;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canEdit = currentAdmin?.role === "super" || currentAdmin?.role === "local";
  const canDelete = currentAdmin?.role === "super";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-xl font-bold text-blue-800">
                Admin Panel - {currentAdmin?.role?.toUpperCase()} Admin ({currentAdmin?.username})
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="registrations" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="registrations" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Registration Details</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Category & Fees</span>
            </TabsTrigger>
            <TabsTrigger value="panchayaths" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Panchayath Details</span>
            </TabsTrigger>
          </TabsList>

          {/* Registration Details Tab */}
          <TabsContent value="registrations">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Registration Details ({filteredRegistrations.length})</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        type="text"
                        placeholder="Search by name, UID, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="categoryFilter">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="panchayathFilter">Panchayath</Label>
                    <Select value={selectedPanchayath} onValueChange={setSelectedPanchayath}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Panchayaths" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="all">All Panchayaths</SelectItem>
                        {panchayaths.map(p => (
                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Registration Table */}
                {regsLoading ? (
                  <div className="text-center py-8">Loading registrations...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-semibold">UID</th>
                          <th className="text-left p-3 font-semibold">Name</th>
                          <th className="text-left p-3 font-semibold">Category</th>
                          <th className="text-left p-3 font-semibold">WhatsApp</th>
                          <th className="text-left p-3 font-semibold">Panchayath</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations.map((reg) => {
                          const regUid = generateUID(reg.mobile_number, reg.full_name);
                          return (
                            <tr key={reg.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-mono text-sm">{regUid}</td>
                              <td className="p-3">{reg.full_name}</td>
                              <td className="p-3">{reg.category}</td>
                              <td className="p-3">{reg.whatsapp_number || reg.mobile_number}</td>
                              <td className="p-3">{reg.panchayath}</td>
                              <td className="p-3">
                                <Badge className={getStatusColor(reg.status || 'Pending')}>
                                  {reg.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  {canEdit && (
                                    <Select
                                      value={reg.status || 'Pending'}
                                      onValueChange={(value) => updateRegistrationStatus(reg.id, value)}
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Category & Fees Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {catsLoading ? (
                  <div className="text-center py-8">Loading categories...</div>
                ) : (
                  <div className="grid gap-4">
                    {categories.map((category) => (
                      <Card key={category.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{category.name}</h3>
                              <p className="text-xs text-gray-500 mt-1">{category.division}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              {editingCategory === category.id ? (
                                <>
                                  <div className="flex space-x-2">
                                    <div>
                                      <Label className="text-xs">Actual Fee</Label>
                                      <Input
                                        type="number"
                                        value={categoryFormData.actual_fee}
                                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, actual_fee: Number(e.target.value) }))}
                                        className="w-20 h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Offer Fee</Label>
                                      <Input
                                        type="number"
                                        value={categoryFormData.offer_fee}
                                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, offer_fee: Number(e.target.value) }))}
                                        className="w-20 h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Actual Fee</p>
                                    <p className="font-semibold">₹{category.actual_fee}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Offer Fee</p>
                                    <p className="font-semibold text-green-600">₹{category.offer_fee}</p>
                                  </div>
                                </>
                              )}
                              {canEdit && (
                                <Button 
                                  size="sm" 
                                  variant={editingCategory === category.id ? "default" : "outline"}
                                  onClick={() => handleCategoryEdit(category.id)}
                                >
                                  {editingCategory === category.id ? "Save" : <Edit className="h-3 w-3" />}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panchayaths Tab */}
          <TabsContent value="panchayaths">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Panchayath Details Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {panchLoading ? (
                  <div className="text-center py-8">Loading panchayaths...</div>
                ) : (
                  <div className="space-y-4">
                    {panchayaths.map((panchayath) => (
                      <Card key={panchayath.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            {editingPanchayath === panchayath.id ? (
                              <div className="flex space-x-4 flex-1">
                                <div>
                                  <Label className="text-xs">Name</Label>
                                  <Input
                                    value={panchayathFormData.name}
                                    onChange={(e) => setPanchayathFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Malayalam Name</Label>
                                  <Input
                                    value={panchayathFormData.malayalam_name}
                                    onChange={(e) => setPanchayathFormData(prev => ({ ...prev, malayalam_name: e.target.value }))}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">District</Label>
                                  <Input
                                    value={panchayathFormData.district}
                                    onChange={(e) => setPanchayathFormData(prev => ({ ...prev, district: e.target.value }))}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="font-semibold">{panchayath.name}</h3>
                                <p className="text-sm text-gray-600">{panchayath.malayalam_name}</p>
                                <p className="text-xs text-gray-500">{panchayath.district}</p>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              {canEdit && (
                                <Button 
                                  size="sm" 
                                  variant={editingPanchayath === panchayath.id ? "default" : "outline"}
                                  onClick={() => handlePanchayathEdit(panchayath.id)}
                                >
                                  {editingPanchayath === panchayath.id ? "Save" : <Edit className="h-3 w-3" />}
                                </Button>
                              )}
                              {canDelete && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600"
                                  onClick={() => deletePanchayath(panchayath.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
