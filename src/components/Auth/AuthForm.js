import { useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import classes from "./AuthForm.module.css";
import { AuthContext } from "../../store/auth-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const eye = <FontAwesomeIcon icon={faEye} />;

const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5gDXU2oie50gIt4DB0W5z4xfFNGhkxDw";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5gDXU2oie50gIt4DB0W5z4xfFNGhkxDw";
    }

    // setIsLoading(true);
    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: enteredEmail,
    //     password: enteredPassword,
    //     returnSecureToken: true,
    //   }),
    // })
    //   .then((res) => {
    //     setIsLoading(false);

    //     if (res.ok) {
    //       return res.json();
    //       //   .then((data) =>
    //       //   {
    //       //   const successMessage = `${
    //       //     isLogin ? 'Login' : 'Sign up'
    //       //   } successfully.`;
    //       //   alert(successMessage);
    //       //   console.log(data);
    //       // });
    //     } else {
    //       return res.json().then((data) => {
    //         let errorMessage = `Authenticated ${
    //           isLogin ? 'login' : 'sign up'
    //         } failed !`;

    //         // console.log(data);

    //         throw new Error(errorMessage);
    //       });
    //     }
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     alert(error.message);
    //   });

    setIsLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        authCtx.login(data.idToken);
        history.replace("/");
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            ref={passwordInputRef}
            className={classes["input-password"]}
          />
          <i onClick={togglePasswordVisiblity}>
            {showPassword ? eyeSlash : eye}
          </i>
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
