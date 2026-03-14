import LoginForm from "@/app/login/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* El contenedor principal centra el formulario en la pantalla 
        y le da un fondo gris claro (bg-gray-50)
      */}
      <LoginForm />
    </main>
  );
}