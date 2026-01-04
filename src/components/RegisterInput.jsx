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
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RegisterInput = ({ register }) => {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [nameError, setNameError] = React.useState("");
  const navigate = useNavigate();

  const validateName = (value) => {
    // Regex untuk hanya mengizinkan huruf (a-z, A-Z) dan spasi
    const nameRegex = /^[a-zA-Z\s]*$/;

    if (!nameRegex.test(value)) {
      setNameError("Name can only contain letters and spaces");
      return false;
    }

    if (value.trim().length > 0 && value.trim().length < 3) {
      setNameError("Name must be at least 3 characters");
      return false;
    }

    setNameError("");
    return true;
  };

  const onNameChange = (event) => {
    const value = event.target.value;

    // Hanya set value jika valid atau kosong
    if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
      validateName(value);
    }
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi nama sebelum submit
    if (!validateName(name)) {
      toast.error(nameError || "Please enter a valid name.");
      return;
    }

    if (name.trim().length === 0) {
      toast.error("Name is required.");
      return;
    }

    setIsLoading(true);

    // Kita definisikan register terlebih dahulu lalu panggil dengan toast.promise
    const registerPromise = register(name.trim(), username.trim(), email, password);
    
    toast.promise(registerPromise, {
      loading: "Creating account...",
      success: "Registration successful! Please wait for admin approval before logging in. 🎉",
      error: (err) => err?.message || "Registration failed",
    });

    // Di sini kita await hasil promise jika succes baru navigate
    try {
      await registerPromise;
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Maintenance Copilot Dashboard</CardTitle>
          <CardDescription>
            Create your account by filling the form below
          </CardDescription>
          <CardAction>
            <Link to="/">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ahmad Dhani"
                  required
                  value={name}
                  onChange={onNameChange}
                  className={nameError ? "border-red-500" : ""}
                />
                {nameError && (
                  <p className="text-sm text-red-500 mt-1">{nameError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ahmaddhani"
                  required
                  value={username}
                  onChange={onUsernameChange}
                />
              </div>
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
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterInput;
