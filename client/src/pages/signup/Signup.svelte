<script>
  import Button, { Label } from "@smui/button";
  import axios from "axios";
  import { SERVER_API_URL } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import Textfield from "@smui/textfield";
  import { Link } from "svelte-navigator";
  import { LOGIN, HOME } from "../../routing/constants";
  import { user } from "../../store/store";
  import { useNavigate } from "svelte-navigator";
  import { hashValue } from "@src/common/functions";

  const navigate = useNavigate();
  let name = "";
  let email = "";
  let password = "";
  let isLoading = false;
  let errorMessage = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    isLoading = true;
    const requestBody = {
      name,
      email,
      password: await hashValue(password),
    };
    try {
      const {
        data: { data },
      } = await axios.post(`${SERVER_API_URL}/auth/signup`, requestBody);
      user.set({
        ...data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      sessionStorage.setItem("token", data.user.token);
    } catch (error) {
      errorMessage = error.response.data.errors[0].msg;
    } finally {
      isLoading = false;
      if ($user.isAuthenticated) {
        name = "";
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
    <h2>Sign Up</h2>
    <p>Alreaady have account? Log in <Link to={LOGIN}>here.</Link></p>
    <form on:submit={handleSubmit}>
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={name}
        label="User Name"
        required
        data-qa="userName-input"
      />
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
        <div class="errorMessage">{errorMessage}</div>
      {/if}
      <Button
        variant="raised"
        type="submit"
        style="width: 100%; margin-top: 16px"
        disabled={password === "" || email === "" || name === ""}
        data-qa="signup-button"
      >
        <Label>Sign up</Label>
      </Button>
    </form>
  </div>
</main>

{#if isLoading}
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
