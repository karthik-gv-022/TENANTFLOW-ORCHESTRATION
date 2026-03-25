import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import {
InputOTP,
InputOTPGroup,
InputOTPSlot,
} from "@/components/ui/input-otp";

import { Badge } from "@/components/ui/badge";

import {
Workflow,
Loader2,
Phone,
ArrowLeft,
ShieldCheck,
Crown,
Briefcase,
Star,
User,
} from "lucide-react";

import { toast } from "sonner";
import { apiClient } from "@/integrations/api/client";
import { Separator } from "@/components/ui/separator";
import { CountryCodeSelector } from "@/components/auth/CountryCodeSelector";
import { detectCountryCode } from "@/lib/detectCountry";
import { cn } from "@/lib/utils";

const demoAccounts = [
{
role: "system_admin",
label: "System Admin",
desc: "Full system access",
icon: ShieldCheck,
color: "text-destructive",
},
{
role: "tenant_admin",
label: "Tenant Admin",
desc: "Organization admin",
icon: Crown,
color: "text-primary",
},
{
role: "manager",
label: "Manager",
desc: "Team management",
icon: Briefcase,
color: "text-accent",
},
{
role: "team_lead",
label: "Team Lead",
desc: "Lead a team",
icon: Star,
color: "text-yellow-500",
},
{
role: "team_member",
label: "Team Member",
desc: "Standard access",
icon: User,
color: "text-muted-foreground",
},
];

export default function Auth() {
const { user, loading } = useAuth();

const [step, setStep] = useState<"phone" | "otp">("phone");
const [isSubmitting, setIsSubmitting] = useState(false);

const [countryCode, setCountryCode] = useState(() =>
detectCountryCode()
);

const [phoneNumber, setPhoneNumber] = useState("");
const [formattedPhone, setFormattedPhone] = useState("");
const [otp, setOtp] = useState("");

const [demoLoading, setDemoLoading] = useState<string | null>(null);

if (loading) {
return ( <div className="flex items-center justify-center min-h-screen"> <Loader2 className="w-8 h-8 animate-spin text-primary" /> </div>
);
}

if (user) {
return <Navigate to="/dashboard" replace />;
}

const handleDemoLogin = async (role: string) => {
setDemoLoading(role);

```
try {
  const { data, error } = await apiClient.invokeFunction(
    "demo-login",
    { body: { role } }
  );

  if (error) throw error;

  if (data?.session) {
    await apiClient.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    toast.success(`Logged in as ${role.replace("_", " ")}`);
  }
} catch (error: any) {
  toast.error(error.message || "Demo login failed");
} finally {
  setDemoLoading(null);
}
```

};

const formatPhoneNumber = (value: string, code: string) => {
const digits = value.replace(/[^\d]/g, "");
return digits ? code + digits : code;
};

const handleSendOTP = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmitting(true);

```
try {
  const fullPhone = formatPhoneNumber(phoneNumber, countryCode);

  const { error } = await apiClient.requestOtp({
    phone: fullPhone,
  });

  if (error) throw error;

  setFormattedPhone(fullPhone);
  setStep("otp");

  toast.success("Verification code sent to your phone");
} catch (error: any) {
  toast.error(error.message || "Failed to send code");
} finally {
  setIsSubmitting(false);
}
```

};

const handleVerifyOTP = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmitting(true);

```
try {
  const { error } = await apiClient.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: "sms",
  });

  if (error) throw error;

  toast.success("Welcome!");
} catch (error: any) {
  toast.error(error.message || "Invalid code");
} finally {
  setIsSubmitting(false);
}
```

};

const handleBack = () => {
setStep("phone");
setOtp("");
};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4"> <div className="w-full max-w-md">

```
    {/* Logo */}
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg">
        <Workflow className="w-7 h-7 text-primary-foreground" />
      </div>

      <span className="text-2xl font-bold tracking-tight">
        TenantFlow
      </span>
    </div>

    <Card className="shadow-xl border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Welcome to TenantFlow
        </CardTitle>

        <CardDescription>
          {step === "phone"
            ? "Login to continue"
            : "Enter the verification code"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === "phone" ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin("team_member")}
            >
              Continue with Demo Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or login with phone
                </span>
              </div>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <Label htmlFor="phone">Phone Number</Label>

              <div className="flex gap-2">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                />

                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Send Verification Code
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <Label>Verification Code</Label>

            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || otp.length !== 6}
            >
              Verify & Sign In
            </Button>
          </form>
        )}
      </CardContent>
    </Card>

    {/* Demo Accounts */}
    <div className="mt-6 space-y-2">
      {demoAccounts.map(({ role, label, desc, icon: Icon, color }) => (
        <button
          key={role}
          onClick={() => handleDemoLogin(role)}
          disabled={!!demoLoading}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border bg-card hover:shadow-md"
        >
          <Icon className={cn("w-5 h-5", color)} />

          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              {desc}
            </p>
          </div>

          {demoLoading === role ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Badge variant="secondary">Demo</Badge>
          )}
        </button>
      ))}
    </div>

    <p className="text-center text-sm text-muted-foreground mt-6">
      Secure, scalable task orchestration for enterprise teams
    </p>
  </div>
</div>
```

);
}
