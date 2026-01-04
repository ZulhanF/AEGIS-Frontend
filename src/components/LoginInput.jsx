import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function LoginInput({ login, isLoading }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(login(email, password), {
      loading: "Logging in...",
      success: (user) => `Welcome back, ${user.name}! 👋`,
      error: (err) => {
        const message = err?.message || "Login failed";
        // Cek jika error terkait verifikasi
        if (message.toLowerCase().includes("verif") || message.toLowerCase().includes("approv")) {
          return "⏳ Your account is pending admin approval. Please wait for verification.";
        }
        return message;
      },
    });
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Maintenance Copilot Dashboard</CardTitle>
          <CardDescription>
            Enter your credential below to login to your account
          </CardDescription>
          <CardAction>
            <Link to="/register">
              <Button variant="link">Register</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={onEmailChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={onPasswordChange}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginInput;
