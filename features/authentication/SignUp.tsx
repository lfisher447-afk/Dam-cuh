import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "../../hooks/useSignUp";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AuthProps } from "types";

import AuthLayout from "./AuthLayout";
import AuthPrompt from "../../ui/AuthPrompt";
import Button from "../../ui/Button";
import ErrorMessage from "../../ui/ErrorMessage";
import SpinnerMini from "../../ui/SpinnerMini";
import GoogleButton from "../../ui/GoogleButton";

function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isPending: authPending } = useUser();

  useEffect(() => {
    if (!authPending && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authPending, navigate]);

  const { mutate, isPending } = useSignUp();
  const { googleLogin, isPending: googlePending } = useGoogleLogin();

  const { handleSubmit, register, formState, getValues, reset } =
    useForm<AuthProps>();
  const { errors } = formState;

  function onSubmit({ email, password }: AuthProps) {
    if (!email || !password) return;

    mutate(
      {
        email,
        password,
      },

      {
        onSettled: () => {
          reset();
        },
      },
    );
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <h2 className="tracking-[ -0.03125rem] pb-10 font-outfit text-[2rem] font-normal text-white">
          {t("auth.signUp")}
        </h2>

        <div className="mb-6 flex w-full items-start justify-between border-b border-b-grayishBlue focus-within:border-b-white">
          <input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            className="w-full bg-transparent pb-[1.13rem] text-white focus:outline-none"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", {
              required: t("auth.fieldRequired"),
              setValueAs: (value) => value.trim(),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("auth.invalidEmail"),
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="mb-6 flex w-full items-start justify-between border-b border-b-grayishBlue focus-within:border-b-white">
          <input
            id="password"
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full bg-transparent pb-[1.13rem] text-white focus:outline-none"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
              required: t("auth.fieldRequired"),
              setValueAs: (value) => value.trim(),
              minLength: {
                value: 8,
                message: t("auth.passwordLength"),
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="mb-6 flex w-full items-start justify-between border-b border-b-grayishBlue focus-within:border-b-white">
          <input
            id="passwordConfirm"
            type="password"
            placeholder={t("auth.repeatPasswordPlaceholder")}
            className="w-full bg-transparent pb-[1.13rem] text-white focus:outline-none"
            {...register("confirmPassword", {
              required: t("auth.fieldRequired"),
              validate: (value) =>
                value === getValues("password") || t("auth.passwordsMismatch"),
            })}
          />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
          )}
        </div>

        <Button>{isPending ? <SpinnerMini /> : t("auth.createAccount")}</Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-darkBlue px-2 text-white/40">{t("auth.or")}</span>
          </div>
        </div>

        <div className="mb-4">
          <GoogleButton
            onClick={() => googleLogin()}
            isPending={googlePending}
            label={t("auth.continueWithGoogle")}
          />
        </div>

        <AuthPrompt>
          {t("auth.alreadyHaveAccount")}{" "}
          <Link to="/login">
            <span className="cursor-pointer text-red">{t("auth.loginLink")}</span>
          </Link>
        </AuthPrompt>
      </form>
    </AuthLayout>
  );
}
export default SignUp;
