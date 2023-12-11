<script>
  import { user } from "../../store/store";
  import { HOME } from "../../routing/constants";
  import { Link } from "svelte-navigator";
  import { SERVER_API_URL } from "@src/common/constants";
  import axios from "axios";
  import Loader from "@src/common/Loader.svelte";
  import { onMount } from "svelte";

  let isLoadingOrders = true;
  let orders = [];

  onMount(async () => {
    const {
      data: { data },
    } = await axios.get(`${SERVER_API_URL}/users/${$user.id}/orders`, {
      headers: {
        Authorization: `Bearer ${$user.token}`,
      },
    });
    isLoadingOrders = false;
    orders = data.orders;
  });
</script>

<main>
  <div class="wrapper">
    <h2>My Orders</h2>
    <p>Here you can see overview of your orders</p>
    {#if isLoadingOrders}
      <Loader />
    {:else if !!orders.length}
      <div class="itemsWrapper">
        {#each orders as order}
          <div class="orderCard">
            <h5>Order Items</h5>
            <ul>
              {#each order as orderItem}
                <li data-qa="orders-list">{orderItem.quantity} x {orderItem.name}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {:else}
      <p>
        You do not any orders. Do not wait and go shopping <Link to={HOME}
          >go shopping</Link
        >
      </p>
    {/if}
  </div>
</main>

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

  .orderCard {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 12px;
    overflow: hidden;
    padding: 0 16px;
  }
</style>
