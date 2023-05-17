import AuthForm from "./AuthForm";

export default function Login() {
    
    return (
        <AuthForm
            pageInfo="Login to your account and explore the community's healthy and bariatric weight loss recipes."
            formSubmitButtonText="Login"
            onSubmit="login"
            authFooterText="Don't have an account?"
            authFooterLink="/register"
            authFooterLinkText="Sign Up!"
            isSignUp={false}
        /> 
    );
  }
  