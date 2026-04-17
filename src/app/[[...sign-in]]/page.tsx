"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserLock, MonitorSmartphone, WifiOff, Mail, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role as string;
      if (role) {
        setIsRedirecting(true);
        router.push(`/${role}`);
      }
      else {
        console.warn("User is signed in but has no role defined. Redirecting to home.");
        setIsRedirecting(true);
        router.push(`/med`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) {
    return ( // Manter o loader inicial enquanto o Clerk carrega
      <div className="h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-ciano/20 border-t-ciano rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {isRedirecting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-ciano/20 border-t-ciano rounded-full animate-spin" />
            <p className="text-gray-600">A redirecionar...</p>
          </div>
        </div>
      )}
    <div className="min-h-screen flex bg-gradient-to-br from-[#4fd1c5]/5 via-[#27bac1]/5 to-[#008080]/5">
      {/* Sidebar Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4fd1c5] via-[#27bac1] to-[#008080] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="mb-6">
            <Image src="/logo.png" alt="Logo" width={140} height={140} className="brightness-0 invert" />
          </div>
                    
          <div className="space-y-6 mt-6">
            <div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl"><UserLock /></div>
              <div>
                <h3 className="font-semibold">Privacidade Garantida</h3>
                <p className="text-sm opacity-90">Os seus dados e dos seus pacientes são confidenciais e nunca partilhados.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl"><MonitorSmartphone /></div>
              <div>
                <h3 className="font-semibold">Multiplataforma</h3>
                <p className="text-sm opacity-90">Aceda ao seu perfil em qualquer dispositivo</p>
              </div>
            </div>
            
            {/*<div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl"><WifiOff /></div>
              <div>
                <h3 className="font-semibold">Funciona Offline</h3>
                <p className="text-sm opacity-90">Aceda aos seus dados em qualquer lugar, mesmo sem ligação à internet</p>
              </div>
            </div>*/}
          </div>
          
          <div className="mt-12 text-sm opacity-80">
            <p>© 2026 Dr. Gest. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {!isSignUp ? (
          <SignIn.Root>
            <SignIn.Step
              name="start"
              className=" flex flex-col gap-5 w-full max-w-md p-6 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-3xl"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="lg:hidden">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4fd1c5] to-[#008080] bg-clip-text text-transparent">
                  Dr. Gest
                </h1>
                <p className="text-gray-500 text-center text-sm">Bem-vindo de volta!</p>
              </div>
              
              <h2 className="text-gray-600 text-center font-medium">Faça login na sua conta</h2>
              
              <Clerk.GlobalError className="text-sm text-red-400 bg-red-50 p-2 rounded-lg" />
              
              <Clerk.Field name="identifier" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700">
                  Email
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                  placeholder="exemplo@email.com"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700">
                  Palavra-passe
                </Clerk.Label>

                <div className="relative">
                  <Clerk.Input
                    type={showPassword ? "text" : "password"}
                    required
                    className="p-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200 w-full"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <SignIn.Action
                submit
                className="bg-gradient-to-r from-[#4fd1c5] to-[#0097b2] hover:from-[#27bac1] hover:to-[#008080] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Entrar
              </SignIn.Action>
              
              <div className="text-center text-sm text-gray-500">
                Não tem uma conta?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-[#0097b2] hover:text-[#4fd1c5] font-semibold transition-colors"
                >
                  Registar-se
                </button>
              </div>
            </SignIn.Step>
          </SignIn.Root>
        ) : (
          <SignUp.Root>
            <SignUp.Step
              name="start"
              className="flex flex-col gap-4 w-full max-w-md p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="lg:hidden">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4fd1c5] to-[#008080] bg-clip-text text-transparent">
                  Dr. Gest
                </h1>
              </div>
              <h2 className="text-gray-600 text-center font-medium">Criar nova conta</h2>
              
              <Clerk.GlobalError className="text-sm text-red-400 bg-red-50 p-2 rounded-lg" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Clerk.Field name="firstName" className="flex flex-col gap-2">
                  <Clerk.Label className="text-sm font-semibold text-gray-700">
                    Primeiro Nome
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    required
                    className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                    placeholder="João"
                  />
                  <Clerk.FieldError className="text-xs text-red-400" />
                </Clerk.Field>
                
                <Clerk.Field name="lastName" className="flex flex-col gap-2">
                  <Clerk.Label className="text-sm font-semibold text-gray-700">
                    Último Nome
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    required
                    className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                    placeholder="Silva"
                  />
                  <Clerk.FieldError className="text-xs text-red-400" />
                </Clerk.Field>
              </div>
              
              <Clerk.Field name="emailAddress" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700">
                  Email
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                  placeholder="exemplo@email.com"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700">
                  Palavra-passe
                </Clerk.Label>

                <div className="relative">
                  <Clerk.Input
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    className="p-3 pr-10 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200 w-full"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showSignUpPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              {/* Campo de Especialidade como INPUT */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600">
                      Especialidade
                    </label>
                    <input
                      type="text"
                      id="speciality"
                      name="speciality"
                      placeholder="Ex: Cardiologia, Pediatria, Neurologia..."
                      className="p-3 rounded-md ring-1 ring-gray-300 focus:ring-[#00dffc] focus:outline-none"
                      onChange={(e) => {
                        // Guarda o valor da especialidade no campo hidden para o Clerk
                        const specialityInput = document.getElementById('speciality-value') as HTMLInputElement;
                        if (specialityInput) specialityInput.value = e.target.value;
                      }}
                    />
                    {/* Campo hidden para enviar a especialidade como public metadata */}
                    <input 
                      type="hidden" 
                      id="speciality-value" 
                      name="publicMetadata.speciality" 
                    />
                  </div>
                  
                  {/* Campo hidden para a role */}
                  <input type="hidden" name="publicMetadata.role" value="med" />
              
              <SignUp.Action
                submit
                className="bg-gradient-to-r from-[#0097b2] to-[#4fd1c5] hover:from-[#27bac1] hover:to-[#008080] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Registar
              </SignUp.Action>
              
              <div className="text-center text-sm text-gray-500">
                Já tem uma conta?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-[#0097b2] hover:text-[#4fd1c5] font-semibold transition-colors"
                >
                  Entrar
                </button>
              </div>
            </SignUp.Step>
            
            <SignUp.Step
              name="verifications"
              className="flex flex-col gap-4 w-full max-w-md p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center space-y-2">
                <div className="text-4xl sm:text-5xl mb-2 flex justify-center">
                  <Mail />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4fd1c5] to-[#008080] bg-clip-text text-transparent">
                  Verifique o seu email
                </h1>

                <p className="text-sm text-gray-600">
                  Enviamos um código de verificação para o seu email.
                </p>
              </div>

              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700 text-center">
                  Código de Verificação
                </Clerk.Label>

                <Clerk.Input
                  type="text"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200 text-center text-xl sm:text-2xl tracking-widest"
                  placeholder="000000"
                />

                <Clerk.FieldError className="text-xs text-red-400 text-center" />
              </Clerk.Field>

              <SignUp.Action
                submit
                className="bg-gradient-to-r from-[#4fd1c5] to-[#0097b2] hover:from-[#008080] hover:to-[#27bac1] text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Verificar
              </SignUp.Action>
            </SignUp.Step>
          </SignUp.Root>
        )}
      </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoginPage;