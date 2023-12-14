<script>
  import Button from "@smui/button";
  import { useNavigate } from "svelte-navigator";
  import { HOME } from "../../routing/constants";

  const navigate = useNavigate();
</script>

<main>
  <div class="wrapper">
    <h2 class="title" data-qa="payment-successful-title">Payment successful!</h2>
    <h4>Thank you for your order!</h4>
    <Button on:click={() => navigate(HOME, { replace: true })} data-qa="go-to-home-button"
      >Go To Home Page</Button
    >
  </div>
</main>

<style>
  main,
  .wrapper {
    height: 100%;
    max-width: 1000px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .title {
    color: var(--success-color);
  }
</style>
