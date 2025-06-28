import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uidGenerator } from "@/utils/uidGenerator";
import { useCategories } from "@/hooks/useCategories";
import { usePanchayaths } from "@/hooks/usePanchayaths";

const Registration = () => {
  const { toast } = useToast();
  const { categories } = useCategories();
  const { panchayaths } = usePanchayaths();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappError, setWhatsappError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    whatsappNumber: "",
    mobileNumber: "",
    panchayath: "",
    ward: "",
    proDetails: "",
    category: "",
    status: "pending",
    uid: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === "whatsappNumber") {
      setWhatsappError(false); // clear error when user edits number
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate UID before submission
      const newUid = uidGenerator();
      formData.uid = newUid;

      // Check for duplicate registration by WhatsApp or mobile number
      const { data: existingRegistration } = await supabase
        .from("registrations")
        .select("id")
        .or(`(whatsapp_number.eq.${formData.whatsappNumber},mobile_number.eq.${formData.whatsappNumber})`)
        .maybeSingle();

      if (existingRegistration) {
        setWhatsappError(true);
        toast({
          title: "Registration Error",
          description: "This WhatsApp number is already registered",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert new registration
      const { error } = await supabase.from("registrations").insert([
        {
          full_name: formData.fullName,
          address: formData.address,
          whatsapp_number: formData.whatsappNumber,
          mobile_number: formData.mobileNumber,
          panchayath: formData.panchayath,
          ward: formData.ward,
          pro_details: formData.proDetails,
          category: formData.category,
          status: "pending", // ensure lowercase
          uid: newUid,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully.",
      });

      // Reset form
      setFormData({
        fullName: "",
        address: "",
        whatsappNumber: "",
        mobileNumber: "",
        panchayath: "",
        ward: "",
        proDetails: "",
        category: "",
        status: "pending",
        uid: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registration Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>

        {/* WhatsApp Number */}
        <div>
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            type="tel"
            className={whatsappError ? "border-red-500" : ""}
            value={formData.whatsappNumber}
            onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
            placeholder="Enter WhatsApp number"
            required
          />
          {whatsappError && (
            <p className="text-sm text-red-600 mt-1">This number is already registered</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>

        {/* Panchayath */}
        <div>
          <Label htmlFor="panchayath">Panchayath</Label>
          <select
            id="panchayath"
            className="w-full border rounded p-2"
            value={formData.panchayath}
            onChange={(e) => handleInputChange("panchayath", e.target.value)}
            required
          >
            <option value="">Select Panchayath</option>
            {panchayaths.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div>
          <Label htmlFor="ward">Ward</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => handleInputChange("ward", e.target.value)}
            placeholder="Enter ward"
            required
          />
        </div>

        {/* PRO Details */}
        <div>
          <Label htmlFor="proDetails">PRO Details</Label>
          <Input
            id="proDetails"
            value={formData.proDetails}
            onChange={(e) => handleInputChange("proDetails", e.target.value)}
            placeholder="Enter PRO details"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full border rounded p-2"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Registration;
