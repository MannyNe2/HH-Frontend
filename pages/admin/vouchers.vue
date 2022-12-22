<template>
  <v-flex class="flex-column">
    <v-flex class="d-flex justify-space-between py-5 align-center">
      <div>
        <h1 class="font-weight-thin text-h4">Vouchers</h1>
      </div>
      <AdminVoucherGenerator v-on:voucher-generated="updateQuery" />
    </v-flex>
    <v-simple-table class="pa-3 rounded-lg elevation-10">
      <thead class="font-weight-bold div-contain">
        <td class="col-2">ID</td>
        <td class="col-2">Code</td>
        <td class="col-2">Issued At</td>
        <td class="col-2">Expiration Date</td>
        <td class="col-1 text-right">Value</td>
        <td class="col-2 text-center">Status</td>
      </thead>
      <tbody>
        <tr v-for="voucher in vouchers" :key="voucher.id">
          <td class="col-2">{{ voucher.id }}</td>
          <td class="col-2">{{ voucherize(voucher.code) }}</td>
          <td class="col-2">{{ voucher.created_at }}</td>
          <td class="col-2">{{ voucher.exp_date }}</td>
          <td class="col-1 text-right">{{ voucher.value }} Br</td>
          <td class="">
            <div class="justify-center align-center d-flex">
              <v-chip v-if="voucher.is_used">Used</v-chip>
              <v-chip
                color="error"
                v-else-if="Date.parse(voucher.exp_date) < Date.now()"
                >Expired</v-chip
              >
              <v-chip color="success" v-else>Available</v-chip>
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-flex>
</template>

<script>
import gql from "graphql-tag";
export default {
  middleware: "isAdmin",
  apollo: {
    voucher: {
      query: gql`
        query getVouchers {
          voucher {
            id
            code
            is_used
            exp_date
            created_at
            updated_at
            value
          }
        }
      `,
      result({ data }) {
        this.vouchers = data.voucher;
      },
      fetchPolicy: "no-cache",
    },
  },
  data() {
    return {
      vouchers: [],
    };
  },
  methods: {
    voucherize(code) {
      let n = 4;
      let ret = "";
      for (let i = 0; i < code.length; i += n) {
        ret += code.substr(i, n);
        ret += " ";
      }
      return ret.trimEnd();
    },
    updateQuery() {
      this.$apollo.queries.voucher.refetch();
    },
  },
};
</script>

<style>
</style>