"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import * as SignUp from "@clerk/elements/sign-up";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role) {
        router.push(`/${role}`);
      }
    }
  }, [user, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#4fd1c5]/10 to-[#008080]/10">
        <div className="text-[#0097b2] font-medium animate-pulse">A carregar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#4fd1c5]/5 via-[#27bac1]/5 to-[#008080]/5">
      {/* Sidebar Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4fd1c5] via-[#27bac1] to-[#008080] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="mb-8 animate-float">
            <Image src="/logo.png" alt="Logo" width={100} height={100} className="brightness-0 invert" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Dr. Gest</h1>
          
          <div className="space-y-6 mt-8">
            <div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl">🏥</div>
              <div>
                <h3 className="font-semibold">Gestão Hospitalar</h3>
                <p className="text-sm opacity-90">Complete solution for medical institutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl">👨‍⚕️</div>
              <div>
                <h3 className="font-semibold">Equipa Especializada</h3>
                <p className="text-sm opacity-90">Connect with top medical professionals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-semibold">Análise Avançada</h3>
                <p className="text-sm opacity-90">Data-driven insights for better decisions</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-sm opacity-80">
            <p>© 2024 Dr. Gest. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {!isSignUp ? (
          <SignIn.Root>
            <SignIn.Step
              name="start"
              className="bg-white rounded-2xl shadow-2xl flex flex-col gap-5 w-full max-w-md p-6 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-3xl"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="lg:hidden">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#008080] to-[#4fd1c5] bg-clip-text text-transparent">
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
                <Clerk.Input
                  type="password"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <SignIn.Action
                submit
                className="bg-gradient-to-r from-[#0097b2] to-[#4fd1c5] hover:from-[#008080] hover:to-[#27bac1] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
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
              className="bg-white rounded-2xl shadow-2xl flex flex-col gap-4 w-full max-w-md p-6 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="lg:hidden">
                  <Image src="/logo.png" alt="Logo" width={48} height={48} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#008080] to-[#4fd1c5] bg-clip-text text-transparent">
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
                <Clerk.Input
                  type="password"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Especialidade
                </label>
                <select
                  name="speciality"
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200 bg-white"
                  onChange={(e) => {
                    const input = document.querySelector('[name="speciality"]') as HTMLInputElement;
                    if (input) input.value = e.target.value;
                  }}
                >
                  <option value="">Selecione uma especialidade</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Ginecologia">Ginecologia</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                </select>
              </div>
              
              <SignUp.Action
                submit
                className="bg-gradient-to-r from-[#0097b2] to-[#4fd1c5] hover:from-[#008080] hover:to-[#27bac1] text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
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
              name="continue"
              className="bg-white rounded-2xl shadow-2xl flex flex-col gap-5 w-full max-w-md p-6 sm:p-8 md:p-10"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">📧</div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#008080] to-[#4fd1c5] bg-clip-text text-transparent mb-2">
                  Verifique o seu email
                </h1>
                <p className="text-gray-600">
                  Enviamos um código de verificação para o seu email.
                </p>
              </div>
              
              <Clerk.Field name="code" className="flex flex-col gap-2">
                <Clerk.Label className="text-sm font-semibold text-gray-700">
                  Código de Verificação
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="p-3 rounded-xl border-2 border-gray-200 focus:border-[#4fd1c5] focus:outline-none transition-all duration-200 text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <Clerk.FieldError className="text-xs text-red-400" />
              </Clerk.Field>
              
              <SignUp.Action
                submit
                className="bg-gradient-to-r from-[#0097b2] to-[#4fd1c5] hover:from-[#008080] hover:to-[#27bac1] text-white font-semibold py-3 rounded-xl transition-all duration-200"
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
  );
};

export default LoginPage;