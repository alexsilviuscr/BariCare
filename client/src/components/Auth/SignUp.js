import AuthForm from "./AuthForm";

export default function SignUp() {

    return (
        <AuthForm
            pageInfo="Become part of our community where you can explore healthy and bariatric weight loss recipes."
            formSubmitButtonText="Sign up"
            onSubmit="signup"
            authFooterText="Already have an account?"
            authFooterLink="/login"
            authFooterLinkText="Login"
            isSignUp={true}
        /> 
    );
}


