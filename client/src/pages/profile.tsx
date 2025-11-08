import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Heart,
  Plus,
  Trash2,
  Save,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, Alert, EmergencyContact } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    medicalInfo: "",
    emergencyContacts: [] as EmergencyContact[],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("connectaid_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        medicalInfo: userData.medicalInfo || "",
        emergencyContacts: userData.emergencyContacts || [],
      });
    } else {
      setIsEditing(true);
    }

    const storedAlerts = localStorage.getItem("connectaid_alerts");
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Required fields",
        description: "Please provide your name and phone number",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      id: user?.id || crypto.randomUUID(),
      ...formData,
      createdAt: user?.createdAt || new Date().toISOString(),
    };

    localStorage.setItem("connectaid_user", JSON.stringify(userData));
    setUser(userData as UserType);
    setIsEditing(false);
    toast({
      title: "Profile saved",
      description: "Your information has been updated successfully",
    });
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [
        ...formData.emergencyContacts,
        { name: "", phone: "", relationship: "" },
      ],
    });
  };

  const removeEmergencyContact = (index: number) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateEmergencyContact = (
    index: number,
    field: keyof EmergencyContact,
    value: string
  ) => {
    const updated = [...formData.emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, emergencyContacts: updated });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "bg-medical/20 text-medical border-medical/30";
      case "police":
        return "bg-police/20 text-police border-police/30";
      case "mental_health":
        return "bg-mental/20 text-mental border-mental/30";
      case "disaster":
        return "bg-disaster/20 text-disaster border-disaster/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="w-24" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Personal Information
                </h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    data-testid="button-edit"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Your name"
                      data-testid="input-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="your.email@example.com"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical">Medical Information</Label>
                  <Textarea
                    id="medical"
                    value={formData.medicalInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalInfo: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Allergies, medications, blood type, medical conditions..."
                    className="min-h-[100px]"
                    data-testid="input-medical"
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1"
                      data-testid="button-save"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        if (user) {
                          setFormData({
                            name: user.name || "",
                            phone: user.phone || "",
                            email: user.email || "",
                            medicalInfo: user.medicalInfo || "",
                            emergencyContacts: (user.emergencyContacts as EmergencyContact[]) || [],
                          });
                        }
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Emergency Contacts
                </h2>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addEmergencyContact}
                    data-testid="button-add-contact"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {formData.emergencyContacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No emergency contacts added yet
                  </p>
                ) : (
                  formData.emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-md border bg-muted/50 space-y-3"
                    >
                      <div className="grid md:grid-cols-3 gap-3">
                        <Input
                          value={contact.name}
                          onChange={(e) =>
                            updateEmergencyContact(index, "name", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="Name"
                          data-testid={`input-contact-name-${index}`}
                        />
                        <Input
                          value={contact.phone}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          placeholder="Phone"
                          data-testid={`input-contact-phone-${index}`}
                        />
                        <Input
                          value={contact.relationship}
                          onChange={(e) =>
                            updateEmergencyContact(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          placeholder="Relationship"
                          data-testid={`input-contact-relationship-${index}`}
                        />
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmergencyContact(index)}
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-remove-contact-${index}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Alerts
              </h2>

              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No alerts yet
                  </p>
                ) : (
                  alerts.slice(0, 5).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-2 p-4 rounded-md bg-muted/50 border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={getCategoryColor(alert.category)}
                          data-testid={`badge-alert-${alert.category}`}
                        >
                          {alert.category.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.responders?.length || 0} responders found
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              {alerts.length > 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  data-testid="button-view-all"
                >
                  View All Alerts
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
