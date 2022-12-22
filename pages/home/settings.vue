<template>
  <div
    class="
      d-flex
      flex-lg-row flex-md-row flex-sm-row flex-column
      justify-center
    "
  >
    <div class="d-sm-none d-flex justify-start">
      <v-btn class="" fab plain @click="mobileMenuOpen = !mobileMenuOpen">
        <v-icon left>mdi-menu</v-icon>
      </v-btn>
    </div>
    <v-col
      :class="`col col-sm-3 col-md-2 ${
        mobileMenuOpen ? '' : 'd-none'
      } d-sm-block`"
    >
      <v-list class="background">
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'account'"
            @click="setSelection('account')"
            >Account</v-btn
          ></v-list-item
        >
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'creatorship'"
            @click="setSelection('creatorship')"
            >Creatorship</v-btn
          ></v-list-item
        >
        <!-- <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'comments'"
            @click="setSelection('comments')"
            >Comments</v-btn
          ></v-list-item
        > -->
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'pledges'"
            @click="setSelection('pledges')"
            >Pledges</v-btn
          ></v-list-item
        >
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'transactions'"
            @click="setSelection('transactions')"
            >Transactions</v-btn
          ></v-list-item
        >
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'rewards'"
            @click="setSelection('rewards')"
            >Rewards</v-btn
          ></v-list-item
        >
        <v-list-item class="justify-center"
          ><v-btn
            block
            color="primary"
            elevation="0"
            class="text-capitalize rounded-0 text-body-1"
            :text="selection !== 'security'"
            @click="setSelection('security')"
            >Security</v-btn
          ></v-list-item
        >
      </v-list>
    </v-col>

    <v-col class="col col-sm-8 col-md-9 col-lg-8 col-xl-6 px-0 px-sm 2">
      <v-card class="px-5 px-sm-8 py-8 add-transition-05">
        <div class="add-transition-05">
          <h2 class="text-h5">{{ selectionTitle }}</h2>
          <!-- <v-divider class="mb-5 mt-3"></v-divider> -->
          <NuxtChild />
        </div>
      </v-card>
    </v-col>
  </div>
</template>

<script>
export default {
  middleware: "isAuth",
  computed: {
    userId() {
      if (!localStorage.userId) {
        this.$apolloHelpers.onLogout();
        this.$authHelper.cleanupUserInfo();
        this.$router.push("/auth/login");
        return null;
      }
      return localStorage.userId;
    },
    selectionTitle() {
      if (this.selection === "account") {
        return "Account Information";
      } else if (this.selection === "comments") {
        return "Comments";
      } else if (this.selection === "pledges") {
        return "Pledges";
      } else if (this.selection === "transactions") {
        return "Transactions";
      } else if (this.selection === "rewards") {
        return "Rewards";
      } else if (this.selection === "security") {
        return "Security";
      } else if (this.selection === "creatorship") {
        return "Creatorship";
      }
    },
  },
  data() {
    return {
      mobileMenuOpen: false,
      selection: this.initSelection(),
    };
  },
  methods: {
    setSelection(selectionName) {
      this.selection = selectionName;
      if (this.selection === "account") {
        this.$router.push("/home/settings");
      } else {
        this.$router.push(`/home/settings/${selectionName}`);
      }
    },
    initSelection() {
      const path = this.$route.fullPath.split("/");
      const current = path[path.length - 1];
      switch (current) {
        case "settings":
          return "account";
        default:
          return current;
      }
    },
  },
};
</script>

<style>
</style>