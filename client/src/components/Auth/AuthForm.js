import Layout from "@/layouts/AuthLayout";
import Logo from "@/components/Logo/Logo";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaAt } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Button from "../Button/Button";

export default function AuthForm(props) {

    const {
        pageInfo,
        onSubmit,
        formSubmitButtonText, 
        authFooterText, 
        authFooterLink, 
        authFooterLinkText, 
        isSignUp 
    } = props;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [_, setCookies] = useCookies(["access_token"]);
    const router = useRouter();

    const notifySuccess = () => toast.success("Welcome to BariCare!");
    const notifyError = (errorMessage) => toast.error(errorMessage || "Something went wrong!");

    const handleLogin = async (event) =>  {
        event.preventDefault();
        try {
            const response = await axios.post("https://baricare-app.herokuapp.com/auth/login", { email, password });
            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            router.push('/');
        } catch (error) {
            notifyError(error.response.data.message);
            console.error(error);
        }
    };

    const handleSignUp = async (event) =>  {
        event.preventDefault();
        try {
            await axios.post("https://baricare-app.herokuapp.com/auth/register", { username, email, password });
            notifySuccess();
            setTimeout(() => {
                router.push('/login');
            }, 6000);
        } catch (error) {
            notifyError(error.response.data.message);
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (onSubmit === 'login') {
          await handleLogin(event);
        } else if (onSubmit === 'signup') {
          await handleSignUp(event);
        }
      };
    
    return (
        <Layout>
            <section className="w-3/4 mx-auto flex flex-col gap-10 auth-page">
                <div>
                    <div className="pb-4 logo-scale">
                        <Logo />
                    </div>
                    <p className="w-3/4 mx-auto text-gray-400">{ pageInfo }</p>
                    <form className="flex flex-col gap-4 pt-8 form" onSubmit={ handleSubmit }>
                        {isSignUp ? (
                            <div className="input-group flex flex-col gap-4">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Your username"
                                    required
                                    className="input-text"
                                    value={username}
                                    maxLength={20}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </div>
                        ) : null}
                        <div className="input-group flex flex-col gap-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your email"
                                required
                                className="input-text"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <span className="icon flex justify-end px-4"><FaAt /></span>
                        </div>
                        <div className="input-group flex flex-col gap-4">
                            <input
                                type={`${showPassword ? "text" : "password"}`}
                                name="password"
                                placeholder="Your password"
                                required
                                className="input-text"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <span
                                className="icon flex justify-end px-4"
                                onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <Button type="submit" buttonType="primary">{ formSubmitButtonText }</Button>
                    </form>
                    <div>
                        <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </div>
                <p className="text-center text-gray-400">{ authFooterText }{" "}
                    <Link href={ authFooterLink }>
                        <span className="auth-link">{ authFooterLinkText }</span>
                    </Link>
                </p>
            </section>
        </Layout>
    );
}