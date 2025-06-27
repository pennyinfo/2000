
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationStatus {
  full_name: string;
  category: string;
  status: string;
  created_at: string;
  panchayath: string;
}

const RegistrationStatusChecker = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [registrationData, setRegistrationData] = useState<RegistrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateUID = (mobile: string, fullName: string) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    return `ESE${mobile}${firstLetter}`;
  };

  const checkRegistrationStatus = async () => {
    if (!mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter a mobile number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('full_name, category, status, created_at, panchayath')
        .or(`mobile_number.eq.${mobileNumber},whatsapp_number.eq.${mobileNumber}`)
        .maybeSingle();

      if (error) {
        console.error('Error checking status:', error);
        toast({
          title: "Error",
          description: "Failed to check registration status",
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        toast({
          title: "Not Found",
          description: "No registration found with this mobile number",
          variant: "destructive"
        });
        setRegistrationData(null);
        return;
      }

      setRegistrationData(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-pink-600" />
          <span>Check Registration Status</span>
        </CardTitle>
        <p className="text-sm text-pink-600">രജിസ്ട്രേഷൻ സ്റ്റാറ്റസ് പരിശോധിക്കുക</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="mobile">Mobile Number / മൊബൈൽ നമ്പർ</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Button 
          onClick={checkRegistrationStatus}
          disabled={isLoading}
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          {isLoading ? 'Checking...' : 'Check Status / സ്റ്റാറ്റസ് പരിശോധിക്കുക'}
        </Button>

        {registrationData && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">Your UID:</p>
              <p className="text-lg font-bold text-gray-800 font-mono">
                {generateUID(mobileNumber, registrationData.full_name)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name:</span>
                <span className="text-sm font-medium">{registrationData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium">{registrationData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Panchayath:</span>
                <span className="text-sm font-medium">{registrationData.panchayath}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className={getStatusColor(registrationData.status)}>
                  {registrationData.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applied:</span>
                <span className="text-sm font-medium">
                  {new Date(registrationData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationStatusChecker;
