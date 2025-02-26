import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Alerts = () => {
  const [alert, setAlert] = useState(false);

  const handleAlert = () => {
    setAlert(!alert);
  };

  useEffect(() => {
    if (alert) {
      toast.success("Alerts enabled");
    }
  }, [alert]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Bell className="w-6 h-6" />
          <span>Alerts & Notifications</span>
          <div className="ml-auto">
            <Switch
              id="notifSwitch"
              onCheckedChange={handleAlert}
              checked={alert}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* <p>Browser notifications</p> */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="notifSwitch">
              Get notificaitions for new referrals received
            </Label>
            {/* <Switch id="notifSwitch" /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Alerts;
