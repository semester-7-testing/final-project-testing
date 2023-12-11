<script>
  import Button, { Label } from "@smui/button";
  import axios from "axios";
  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";
  import { SERVER_API_URL } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import Snackbar, { Actions, Label as SnackLabel } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  const params = useParams();
  let snackbarWithClose;

  let product = null;
  let counter = 0;

  const handleIncrement = () => {
    counter++;
  };

  const handleDecrement = () => {
    if (counter === 0) return;
    counter--;
  };

  const handleAddToCart = () => {
    //returns null if does not exist
    let cart = sessionStorage.getItem("cart");
    if (cart === null) {
      cart = [];
      cart.push({
        productId: product._id,
        quantity: counter,
        productImg: product.imgUrl,
        productName: product.name,
        price: product.price,
      });
    } else {
      cart = JSON.parse(cart);
      const productCartIndex = cart.findIndex(
        (item) => item.productId === product._id
      );
      if (productCartIndex > -1) {
        cart[productCartIndex].quantity += counter;
      } else {
        cart.push({
          productId: product._id,
          quantity: counter,
          productImg: product.imgUrl,
          productName: product.name,
          price: product.price,
        });
      }
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    counter = 0;
    snackbarWithClose.open();
  };

  onMount(async () => {
    const {
      data: { data },
    } = await axios.get(`${SERVER_API_URL}/products/${$params.id}`);
    product = data.product;
  });
</script>

<main>
  <div class="wrapper">
    {#if product !== null}
      <div class="imgWrapper">
        <img src={product.imgUrl} alt={product.name} />
      </div>
      <div>
        <b>
          {product.name}
        </b>
      </div>
      <p>
        {product.description}
      </p>
      <div>Price: {product.price} &euro;</div>
      <div class="bottom">
        <div class="counterWrapper">
          <div class="counter">
            <Button variant="raised" on:click={handleDecrement}>
              <Label>-</Label>
            </Button>
            <span>{counter}</span>
            <Button variant="raised" on:click={handleIncrement} data-qa="product-quantity-increment">
              <Label>+</Label>
            </Button>
          </div>
          <div>
            <Button
              class="add-to-cart-btn"
              on:click={handleAddToCart}
              disabled={!counter}
              data-qa="product-add-to-cart"
            >
              <Label>ADD TO CART</Label>
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <Loader />
    {/if}
  </div>
</main>
<Snackbar bind:this={snackbarWithClose} class="success">
  <SnackLabel>Product added to cart</SnackLabel>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  main,
  .wrapper {
    height: 100%;
    max-width: 1000px;
    margin: auto;
  }

  img {
    width: 500px;
  }
  .imgWrapper {
    display: flex;
    justify-content: center;
  }

  .bottom {
    display: flex;
    justify-content: center;
  }

  .counterWrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .counter {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
