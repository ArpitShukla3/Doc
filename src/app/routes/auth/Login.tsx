import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "@apis/apis";
import useAuthStore from "@stores/authStore";
import { Button } from "@components/ui/elements/button";
import { Input } from "@components/ui/elements/input";
import { Label } from "@components/ui/elements/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/elements/card";
import { paths } from "@config/paths";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Email and password are required");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(form);
            login(data.accessToken, data.refreshToken);
            navigate(paths.home);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
            {/* Animated gradient background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,var(--primary)_0%,transparent_10%,transparent_40%,var(--accent)_50%,transparent_60%,transparent_90%,var(--primary)_100%)] opacity-[0.07]" />
                <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
            </div>

            {/* Floating orbs */}
            <div className="absolute top-20 right-32 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <Card className="w-full max-w-md mx-4 border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                        <LogIn className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                className="h-11 bg-background/50 border-border/60 focus-visible:ring-primary/30 transition-all"
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="h-11 pr-10 bg-background/50 border-border/60 focus-visible:ring-primary/30 transition-all"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 font-semibold text-sm bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            Don&apos;t have an account?{" "}
                            <Link
                                to={paths.auth.register}
                                className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
