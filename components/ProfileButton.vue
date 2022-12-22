<template>
  <v-menu bottom offset-y transition="slide-y-transition" v-model="showMenu">
    <template v-slot:activator="{ on, attrs }">
      <div
        :class="`d-flex justify-center align-center pa-1 rounded profile-button ${
          showMenu ? 'selection' : menuHover ? 'paper' : ''
        }`"
        v-bind="attrs"
        v-on="on"
        @mouseenter="mouseEnter('menu')"
        @mouseleave="mouseLeave('menu')"
        @click="toggleMenu"
      >
        <v-flex class="d-none d-sm-flex flex-column"
          ><span class="px-3">{{ name }}</span>
          <span class="px-3 grey--text text-right">
            <span class="">{{ balance }}</span>
            <span class="font-weight-light text-caption">Br</span>
          </span></v-flex
        >
        <DynamicAvatar
          :image="imageUrl"
          :firstName="firstName"
          :lastName="lastName"
          :isVerified="isVerified"
          :size="40"
        />
        <v-icon>mdi-menu-down</v-icon>
      </div>
    </template>
    <v-list class="user-select-none px-2">
      <v-list-item class="d-sm-none pa-4">
        <DynamicAvatar
          :image="imageUrl"
          :firstName="firstName"
          :lastName="lastName"
          :isVerified="isVerified"
          :size="30"
          class="pr-3"
        />
        <span class="pl-3 pr-2">{{ name }}</span>
      </v-list-item>
      <v-divider class="d-sm-none my-2"></v-divider>

      <v-list-item class="px-4 d-sm-none">
        <v-icon class="pr-3 grey--text">mdi-wallet</v-icon>
        <!-- <span class="pl-3 pr-2">Balance</span> -->
        <div class="pl-3">
          {{ balance }}
          <span class="font-weight-light text-caption">Br</span>
        </div>
      </v-list-item>

      <v-dialog v-model="redeemVoucherDialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            :class="`px-4 py-0 cursor-pointer rounded ${
              claimHover ? 'selection' : ''
            }`"
            v-bind="attrs"
            v-on="on"
            @click="
              {
                redeemVoucherDialog = true;
                claimHover = false;
              }
            "
            @mouseenter="mouseEnter('redeem-voucher')"
            @mouseleave="mouseLeave('redeem-voucher')"
            ><v-icon class="pr-3">mdi-cash-plus</v-icon
            ><span class="pl-3 pr-2">Redeem Voucher</span></v-list-item
          >
        </template>
        <RedeemVoucherDialog
          v-on:voucher-redeemed="onVoucherRedeemed"
          v-on:close-redeem-voucher-dialog="redeemVoucherDialog = false"
        />
      </v-dialog>

      <v-divider class="my-1"></v-divider>

      <v-list-item
        to="/profile"
        :class="`px-4 py-0 cursor-pointer rounded ${
          profileItemHover ? 'selection' : ''
        }`"
        @mouseenter="mouseEnter('profile')"
        @mouseleave="mouseLeave('profile')"
        @click="profileItemHover = false"
        ><v-icon class="pr-3">mdi-account</v-icon
        ><span class="pl-3 pr-2">Profile</span></v-list-item
      >
      <v-list-item
        to="/home/bookmarks"
        :class="`px-4 py-0 cursor-pointer rounded ${
          bookmarksItemHover ? 'selection' : ''
        }`"
        @mouseenter="mouseEnter('bookmarks')"
        @mouseleave="mouseLeave('bookmarks')"
        @click="bookmarksItemHover = false"
        ><v-icon class="pr-3">mdi-bookmark</v-icon
        ><span class="pl-3 pr-2">Saved</span></v-list-item
      >
      <v-divider class="my-1"></v-divider>
      <v-list-item
        to="/home/settings"
        :class="`px-4 cursor-pointer rounded  ${
          settingsItemHover ? 'selection' : ''
        }`"
        @mouseenter="mouseEnter('settings')"
        @mouseleave="mouseLeave('settings')"
        @click="settingsItemHover = false"
        ><v-icon class="pr-3">mdi-cog</v-icon
        ><span class="pl-3 pr-2">Account</span></v-list-item
      >
      <v-list-item class="px-4 rounded"
        ><v-icon class="pr-3">mdi-brightness-3</v-icon>
        <span class="pl-3 pr-3">Dark Theme</span>
        <span class="pl-2 pr-2"><ThemeToggle /></span
      ></v-list-item>
      <v-divider class="my-1"></v-divider>
      <v-list-item
        :class="`px-4 cursor-pointer rounded error--text text--lighten-1  ${
          signOutItemHover ? 'selection' : ''
        }`"
        @mouseenter="mouseEnter('signout')"
        @mouseleave="mouseLeave('signout')"
        @click="signOutItemHover = false"
        ><v-icon class="pr-3 error--text text--lighten-1">mdi-exit-run</v-icon
        ><span class="pl-3 pr-2" @click.prevent="signOut"
          >Sign Out</span
        ></v-list-item
      >
    </v-list>
  </v-menu>
</template>

<script>
import { getUserBalance } from "~/queries/user/getUserBalance.gql";
export default {
  apollo: {
    user_by_pk: {
      query: getUserBalance,
      variables() {
        return {
          userId: this.userId,
        };
      },
      result({ data }) {
        this.useableBalance = data.user_by_pk.wallet.useable_balance;
      },
      skip() {
        return !this.userId || this.loggingOut;
      },
      fetchPolicy: "no-cache",
    },
  },
  computed: {
    userId() {
      return localStorage.userId;
    },
    name() {
      return `${this.firstName} ${this.lastName}`;
    },
    firstName() {
      return localStorage.userFirstName;
    },
    lastName() {
      return localStorage.userLastName;
    },
    isVerified() {
      return localStorage.userIsVerified == "true";
    },
    imageUrl() {
      return localStorage.userAvatarUrl != "null"
        ? localStorage.userAvatarUrl
        : require("~/assets/default-avatar.svg");
    },
    balance() {
      return this.$money.format(this.useableBalance, true);
    },
  },
  data() {
    return {
      menuHover: false,
      claimHover: false,
      profileItemHover: false,
      bookmarksItemHover: false,
      settingsItemHover: false,
      signOutItemHover: false,
      showMenu: false,
      redeemVoucherDialog: false,
      useableBalance: 0.0,
      loggingOut: false,
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    mouseEnter(prop) {
      if (prop === "menu") {
        this.menuHover = true;
      } else if (prop === "profile") {
        this.profileItemHover = true;
      } else if (prop === "bookmarks") {
        this.bookmarksItemHover = true;
      } else if (prop === "settings") {
        this.settingsItemHover = true;
      } else if (prop === "signout") {
        this.signOutItemHover = true;
      } else if (prop === "redeem-voucher") {
        this.claimHover = true;
      }
    },
    mouseLeave(prop) {
      if (prop === "menu") {
        this.menuHover = false;
      } else if (prop === "profile") {
        this.profileItemHover = false;
      } else if (prop === "bookmarks") {
        this.bookmarksItemHover = false;
      } else if (prop === "settings") {
        this.settingsItemHover = false;
      } else if (prop === "signout") {
        this.signOutItemHover = false;
      } else if (prop === "redeem-voucher") {
        this.claimHover = false;
      }
    },
    signOut() {
      this.loggingOut = true;
      this.$authHelper.cleanupUserInfo();
      this.$apolloHelpers.onLogout();
      this.$router.push("/");
    },
    onVoucherRedeemed() {
      this.redeemVoucherDialog = false;
      this.$apollo.queries.user_by_pk.refetch();
    },
  },
};
</script>

<style>
.user-select-none {
  user-select: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>