"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, RegistrationFormValues } from "@/lib/validationSchema";
import styles from "./page.module.css";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setServerError(null);
    setIsSuccess(false);
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Flatten server side errors
          const errorMsg = result.errors.map((e: any) => e.message).join(", ");
          setServerError(errorMsg || "Validation failed on server.");
        } else {
          setServerError(result.error || "An unexpected error occurred.");
        }
        return;
      }

      setIsSuccess(true);
      reset(); // clear form
    } catch (err) {
      setServerError("Network error. Please try again later.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us to start experimenting</p>
        </div>

        {isSuccess && (
          <div className={styles.successMessage}>
            🎉 Account created successfully! Please check your email.
          </div>
        )}

        {serverError && (
          <div className={styles.serverError}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
              {...register("username")}
            />
            {errors.username && <span className={styles.errorMessage}>{errors.username.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              {...register("email")}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><span className={styles.spinner}></span> Creating Account...</>
            ) : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
