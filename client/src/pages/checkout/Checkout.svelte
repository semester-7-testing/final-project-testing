<script>
  import Button, { Label } from "@smui/button";
  import axios from "axios";
  import { SERVER_API_URL, STRIPE_PUBLIC_KEY } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import { Link } from "svelte-navigator";
  import { HOME, ORDER_CONFIRMATION } from "../../routing/constants";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import { user } from "../../store/store";
  import { loadStripe } from "@stripe/stripe-js";
  import { PaymentElement } from "svelte-stripe";
  import { onMount } from "svelte";
  import { useNavigate } from "svelte-navigator";

  const navigate = useNavigate();
  let stripe = null;
  let clientSecret = null;
  let deliveryAddress = "";
  let email = "";
  $: cartItems = JSON.parse(sessionStorage.getItem("cart"));
  let isProcessingOrder = false;
  let elements;

  const calculateSubtotal = (items) => {
    if (items === undefined || items.length === 0) return 0;
    let total = 0;
    items.forEach((item) => (total += item.quantity * item.price));
    return total;
  };

  let subTotal = calculateSubtotal(cartItems);

  const handleIncrement = (productId, quantity) => {
    cartItems = cartItems.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: quantity + 1,
        };
      } else {
        return item;
      }
    });
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    subTotal = calculateSubtotal(cartItems);
  };

  const handleDecrement = (productId, quantity) => {
    if (quantity === 1) {
      cartItems = cartItems.filter((item) => item.productId !== productId);
    } else {
      cartItems = cartItems.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity: quantity - 1,
          };
        } else {
          return item;
        }
      });
    }
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    subTotal = calculateSubtotal(cartItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isProcessingOrder = true;
    const products = cartItems.map(({ quantity, productId }) => ({
      quantity,
      productId,
    }));
    try {
      await axios.post(`${SERVER_API_URL}/order`, {
        userId: $user.id || null,
        products,
        deliveryAddress,
        email,
      });
    } catch (error) {
      console.log(error);
    }
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (result.error) {
      // payment failed, notify user
      processing = false;
    } else {
      cartItems = null;
      sessionStorage.removeItem("cart");
      email = "";
      deliveryAddress = "";
      isProcessingOrder = false;
      navigate(ORDER_CONFIRMATION, {
        replace: true,
      });
    }
  };

  onMount(async () => {
    subTotal = calculateSubtotal(cartItems);
    stripe = await loadStripe(STRIPE_PUBLIC_KEY);
    const {
      data: { data },
    } = await axios.post(`${SERVER_API_URL}/checkout`, {
      amount: subTotal,
    });
    clientSecret = data.clientSecret;
  });
</script>

<main>
  <div class="wrapper">
    <h2>Checkout</h2>
    <p>Please check summary of your order and proceed to the payment</p>
    {#if cartItems !== null && cartItems.length !== 0}
      <div class="itemsWrapper">
        {#each cartItems as { productName, productImg, quantity, productId }}
          <div class="item">
            <img src={productImg} alt={productName} />
            <h4>{productName}</h4>
            <div class="counter">
              <Button
                variant="raised"
                on:click={() => handleDecrement(productId, quantity)}
              >
                <Label>-</Label>
              </Button>
              <span>{quantity}</span>
              <Button
                variant="raised"
                on:click={() => handleIncrement(productId, quantity)}
              >
                <Label>+</Label>
              </Button>
            </div>
          </div>
        {/each}
      </div>
      <h3 class="subtotal">Subtotal: {subTotal} €</h3>
      {#if stripe && clientSecret}
        <form on:submit={handleSubmit}>
          <Textfield
            style="width: 100%;"
            helperLine$style="width: 100%;"
            bind:value={deliveryAddress}
            label="Delivery Address"
            required
            input$maxlength={30}
            data-qa="checkout-delivery-address"
          >
            <HelperText slot="helper">Enter your delivery address</HelperText>
          </Textfield>
          <Textfield
            style="width: 100%;"
            helperLine$style="width: 100%;"
            bind:value={email}
            label="Email Address"
            required
            input$maxlength={40}
            data-qa="checkout-email-address"
          >
            <HelperText slot="helper"
              >Enter your email to receive order confirmation</HelperText
            >
          </Textfield>
          <PaymentElement
            {stripe}
            {clientSecret}
            bind:elements
            theme="flat"
            labels="floating"
            variables={{ colorPrimary: "#7c4dff" }}
            rules={{ ".Input": { border: "solid 1px #0002" } }}
          />
          <Button
            variant="raised"
            type="submit"
            style="width: 100%; margin-top: 16px"
            disabled={isProcessingOrder}
          >
            <Label>Pay</Label>
          </Button>
        </form>
      {/if}
    {:else}
      <p>
        Your cart is empty. Do not wait and add some <Link to={HOME}
          >products</Link
        >
      </p>
    {/if}
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

  .itemsWrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .item {
    display: flex;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
  }

  img {
    height: 64px;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  h4 {
    margin-left: 16px;
    flex: 1;
  }

  .counter {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 16px;
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

  .subtotal {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.87);
  }
</style>
