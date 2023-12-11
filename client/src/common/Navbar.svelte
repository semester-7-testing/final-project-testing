<script>
  import { Link } from "svelte-navigator";
  import {
    HOME,
    LOGIN,
    CHECKOUT,
    MY_ORDERS,
    ADD_PRODUCT,
    CHAT_ROOMS,
  } from "../routing/constants";
  import { user, defaultUser } from "../store/store";
  import IconButton from "@smui/icon-button";
  import Button, { Label } from "@smui/button";
  import { useNavigate } from "svelte-navigator";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";
  import Snackbar, { Actions, Label as SnackLabel } from "@smui/snackbar";

  let cartMenu;
  let userMenu;
  let snackbarWithClose;
  const navigate = useNavigate();

  const emptyCart = () => {
    sessionStorage.removeItem("cart");
    snackbarWithClose.open();
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cart");
    user.set(defaultUser);
    navigate(HOME);
  };
</script>

<div class="navbar">
  <Link to={HOME} class="logoLink" style="display: flex; align-items: center;">
    <img src="/logo.png" alt="KEA Foot Shop" height="60px" data-qa="menu-home"/>
  </Link>
  <div class="rightMenu">
    {#if $user.isAuthenticated && !$user.isLoading}
      <div><b>{$user.name}</b></div>
      <IconButton class="material-icons" on:click={() => userMenu.setOpen(true)} data-qa="menu-account"
        >account_circle</IconButton
      >
      <Menu bind:this={userMenu}>
        <List>
          {#if $user.isAdmin}
            <Item on:SMUI:action={() => navigate(ADD_PRODUCT)} data-qa="menu-account-add-product">
              <Text>Add Product</Text>
            </Item>
            <Item on:SMUI:action={() => navigate(CHAT_ROOMS)} data-qa="menu-account-chat-rooms">
              <Text>Chat Rooms</Text>
            </Item>
          {/if}
          <Item on:SMUI:action={() => navigate(MY_ORDERS)} data-qa="menu-account-my-orders">
            <Text>My Orders</Text>
          </Item>
          <Item on:SMUI:action={logout} data-qa="menu-account-logout">
            <Text>Log out</Text>
          </Item>
        </List>
      </Menu>
    {/if}
    {#if !$user.isAuthenticated && !$user.isLoading}
      <Button variant="raised" on:click={() => navigate(LOGIN)} data-qa="login-button"
        ><Label>Login</Label></Button
      >
    {/if}
    <IconButton class="material-icons" on:click={() => cartMenu.setOpen(true)} data-qa="menu-cart"
      >shopping_cart</IconButton
    >
    <Menu bind:this={cartMenu}>
      <List>
        <Item on:SMUI:action={() => navigate(CHECKOUT)} data-qa="menu-cart-checkout">
          <Text>Checkout</Text>
        </Item>
        <Item on:SMUI:action={emptyCart} data-qa="menu-cart-empty-cart">
          <Text>Empty Cart</Text>
        </Item>
      </List>
    </Menu>
  </div>
</div>
<Snackbar bind:this={snackbarWithClose} class="success">
  <SnackLabel>Your cart was emptied</SnackLabel>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style>
  .navbar {
    display: flex;
    padding: 0 48px;
    background-color: black;
    height: 64px;
    justify-content: space-between;
  }
  .rightMenu {
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
