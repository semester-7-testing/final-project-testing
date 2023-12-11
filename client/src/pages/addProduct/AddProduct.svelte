<script>
  import Button, { Label } from "@smui/button";
  import axios from "axios";
  import { SERVER_API_URL } from "../../common/constants";
  import Loader from "../../common/Loader.svelte";
  import Snackbar, { Actions, Label as SnackLabel } from "@smui/snackbar";
  import IconButton from "@smui/icon-button";
  import Textfield from "@smui/textfield";
  import { user } from "../../store/store";

  let name = "";
  let imgUrl = "";
  let price = "";
  let description = "";
  let isProcessingOrder = false;
  let snackbarWithClose;

  const handleSubmit = async (e) => {
    e.preventDefault();
    isProcessingOrder = true;
    try {
      await axios.post(
        `${SERVER_API_URL}/products`,
        {
          name,
          imgUrl,
          price,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${$user.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      return;
    }
    snackbarWithClose.open();
    isProcessingOrder = false;
    name = "";
    imgUrl = "";
    price = "";
    description = "";
  };
</script>

<main>
  <div class="wrapper">
    <h2>Add new product</h2>
    <form on:submit={handleSubmit} data-qa="add-product-form">
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={name}
        label="Product Name"
        required
        data-qa="product-name"
      />
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={imgUrl}
        label="Product Image URL"
        required
        data-qa="product-img-url"
      />
      <Textfield
        style="width: 100%;"
        helperLine$style="width: 100%;"
        bind:value={price}
        label="Price"
        required
        type="number"
        data-qa="product-price"
      />
      <Textfield
        textarea
        style="width: 100%;margin-top: 16px"
        helperLine$style="width: 100%; "
        bind:value={description}
        label="Description"
        required
        data-qa="product-description"
      />
      <Button
        variant="raised"
        type="submit"
        data-qa="add-product-submit"
        style="width: 100%; margin-top: 16px"
        disabled={name === "" ||
          imgUrl === "" ||
          price === "" ||
          description === ""}
      >
        <Label>Add Product</Label>
      </Button>
    </form>
  </div>
</main>

<Snackbar bind:this={snackbarWithClose} class="success" data-qa="add-product-success">
  <SnackLabel>New product has been added</SnackLabel>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

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
</style>
