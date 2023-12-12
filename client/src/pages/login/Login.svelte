<script>
  import Button, { Label } from "@smui/button";
  import axios from "axios";
  import { SERVER_API_URL } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import Textfield from "@smui/textfield";
  import { Link } from "svelte-navigator";
  import { SIGNUP, HOME } from "../../routing/constants";
  import { user } from "../../store/store";
  import { useNavigate } from "svelte-navigator";
  import { hashValue } from "@src/common/functions";

  const navigate = useNavigate();
  let email = "";
  let password = "";
  let isProcessingOrder = false;
  let errorMessage = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    isProcessingOrder = true;
    const requestBody = {
      email,
      password: await hashValue(password),
    };
    try {
      const {
        data: { data },
      } = await axios.post(`${SERVER_API_URL}/auth/login`, requestBody);
      user.set({
        ...data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      sessionStorage.setItem("token", data.user.token);
    } catch (error) {
      errorMessage = error.response.data.errors[0].msg;
    } finally {
      isProcessingOrder = false;
      if ($user.isAuthenticated) {
        email = "";
        password = "";
        errorMessage = "";
        navigate(HOME, {
          replace: true,
        });
      }
    }
  };
</script>

<main>
  <div class="wrapper">
    <h2>Login</h2>
    <p>Do not have account yet? Sign up <Link to={SIGNUP}  >here.</Link></p>
    <form on:submit={handleSubmit} data-qa="login-form">
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={email}
        label="Email"
        required
        data-qa="email-input"
      />
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={password}
        label="Password"
        required
        type="password"
        data-qa="password-input"
      />
      {#if errorMessage !== ""}
        <div class="errorMessage" data-qa="login-error-message">{errorMessage}</div>
      {/if}
      <Button
        variant="raised"
        type="submit"
        style="width: 100%; margin-top: 16px"
        disabled={password === "" || email === ""}
        data-qa="login-submit"
      >
        <Label>Login</Label>
      </Button>
    </form>
  </div>
</main>

{#if isProcessingOrder}
  <div class="modal">
    <Loader />
  </div>
{/if}

<style>
  main,
  .wrapper {
    height: 100%;
    max-width: 1000px;
    margin: auto;
  }

  form {
    margin-top: 48px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: black;
    opacity: 0.6;
  }

  .errorMessage {
    color: var(--error-color);
  }
</style>
