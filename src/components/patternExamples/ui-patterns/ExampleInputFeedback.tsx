// src/components/pattern-examples/ExampleInputFeedback.tsx
"use client";

import { useState } from "react";

/**
 * ExampleInputFeedback
 * - Demuestra "Input Feedback" (validación en línea + mensajes junto al campo)
 * - Sin dependencias de shadcn; puro HTML + Tailwind.
 */
export default function ExampleInputFeedback() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isEmpty = email.trim() === "";
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && !isEmpty && !isValid;
  const showSuccess = touched && isValid;

  return (
    <div className="w-full max-w-md rounded-xl border p-4 shadow-sm bg-white">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Inline Validation Demo</h3>
        <p className="text-sm text-muted-foreground">
          Feedback inmediato mientras escribes. Usa un email válido para ver el estado.
        </p>
      </div>

      <label htmlFor="email" className="text-sm font-medium">
        Correo electrónico
      </label>
      <div className="mt-1 relative">
        <input
          id="email"
          type="email"
          placeholder="nombre@dominio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          className={[
            "w-full rounded-lg border px-3 py-2 outline-none transition",
            showError ? "border-red-400 focus:ring-2 focus:ring-red-200" :
            showSuccess ? "border-emerald-400 focus:ring-2 focus:ring-emerald-200" :
            "border-gray-300 focus:ring-2 focus:ring-gray-200"
          ].join(" ")}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby="email-help email-error email-success"
        />
        {/* Iconito de estado a la derecha */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          {showError && <span className="text-red-500 text-sm">✖</span>}
          {showSuccess && <span className="text-emerald-600 text-sm">✔</span>}
        </div>
      </div>

      {/* Ayuda contextual persistente */}
      <p id="email-help" className="mt-1 text-xs text-gray-500">
        Usaremos tu correo solo para notificaciones importantes. Formato: usuario@dominio.cl
      </p>

      {/* Mensaje de error inline */}
      {showError && (
        <p id="email-error" className="mt-2 text-sm text-red-600">
          El formato no parece válido. Ejemplo: usuario@dominio.com
        </p>
      )}

      {/* Mensaje de éxito inline */}
      {showSuccess && (
        <p id="email-success" className="mt-2 text-sm text-emerald-700">
          ¡Perfecto! El correo tiene un formato válido.
        </p>
      )}

      {/* Estado deshabilitado si vacío (opcional) */}
      <button
        className={[
          "mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition",
          isValid ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-600 cursor-not-allowed"
        ].join(" ")}
        disabled={!isValid}
        onClick={() => alert(`Enviado a: ${email}`)}
      >
        Continuar
      </button>
    </div>
  );
}
