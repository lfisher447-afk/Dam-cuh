import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLogin } from "../../hooks/useLogin";
import { useGoogleLogin } from "../../hooks/useGoogleLogin";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { AuthProps } from "types";

import AuthLayout from "./AuthLayout";
import AuthPrompt from "../../ui/AuthPrompt";
import ErrorMessage from "../../ui/ErrorMessage";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import GoogleButton from "../../ui/GoogleButton";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isPending: authPending } = useUser();

  useEffect(() => {
    if (!authPending && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authPending, navigate]);

  const { handleSubmit, register, formState, reset } = useForm<AuthProps>();
  const { errors } = formState;
  const { login, isPending } = useLogin();
  const { googleLogin, isPending: googlePending } = useGoogleLogin();

  function onSubmit({ email, password }: AuthProps) {
    if (!email || !password) return;

    login(
      { email, password },
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
          {t("auth.login")}
        </h2>

        <div className="mb-6 flex w-full items-start justify-between border-b border-b-grayishBlue focus-within:border-b-white">
          <input
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
          {errors?.email && (
            <ErrorMessage>{errors?.email?.message}</ErrorMessage>
          )}
        </div>

        <div className="mb-6 flex w-full items-start justify-between border-b border-b-grayishBlue focus-within:border-b-white">
          <input
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
          {errors?.password && (
            <ErrorMessage>{errors?.password?.message}</ErrorMessage>
          )}
        </div>

        <Button>{isPending ? <SpinnerMini /> : t("auth.loginToAccount")}</Button>

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
          {t("auth.dontHaveAccount")}{" "}
          <Link to="/sign-up">
            <span className="cursor-pointer text-red">{t("auth.signUpLink")}</span>
          </Link>
        </AuthPrompt>
      </form>
    </AuthLayout>
  );
}
export default Login;
